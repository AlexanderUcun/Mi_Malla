-- ============================================================
-- Curriculum Tracker — Database Schema
-- Dialect: SQLite-compatible (portable to Postgres with minor
-- tweaks: INTEGER PRIMARY KEY -> SERIAL/IDENTITY, BOOLEAN native, etc.)
-- ============================================================

-- One row per academic program/institution combo.
-- Designed so MULTIPLE programs (other careers, other universities,
-- future plan versions) can live in the same database.
CREATE TABLE programs (
  id             INTEGER PRIMARY KEY,
  name           TEXT NOT NULL,          -- "Administración de Empresas"
  institution    TEXT,                   -- "Universidad de Cundinamarca"
  campus         TEXT,                   -- "Chía"
  modality       TEXT,                   -- "Mixta"
  total_periods  INTEGER NOT NULL,       -- 9
  resolution_code TEXT,                  -- plan version / resolución, for when the curriculum changes
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE periods (
  id          INTEGER PRIMARY KEY,
  program_id  INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  number      INTEGER NOT NULL,          -- 1..9
  UNIQUE(program_id, number)
);

-- Catalog of learning fields / academic areas — used to power dashboards
-- like "credits completed by area". Populated in seed_data.json.
CREATE TABLE learning_fields (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
  id                        INTEGER PRIMARY KEY,
  program_id                INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  period_id                 INTEGER NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
  learning_field_id         INTEGER REFERENCES learning_fields(id),
  code                      TEXT NOT NULL UNIQUE,   -- e.g. "CAD102020104"
  name                      TEXT NOT NULL,
  hours_theoretical         INTEGER DEFAULT 0,      -- HT
  hours_practical           INTEGER DEFAULT 0,      -- HP
  hours_independent_work    INTEGER DEFAULT 0,      -- HTP
  credits                   INTEGER NOT NULL DEFAULT 0,
  academic_weighting        INTEGER,                -- "Ponderación Académica" column
  category                  TEXT NOT NULL DEFAULT 'core'
                              CHECK (category IN (
                                'core',             -- regular disciplinary courses
                                'diagnostic',       -- 0-credit placement/nivelatory tests (DNC*)
                                'general_education',-- Comunicación, Lengua Extranjera, Ciudadanía, Cátedra, Emprendimiento (CAI* courses)
                                'elective',         -- Electiva I..V (small 2-credit choose-one slots)
                                'specialization',   -- Profundización (large 8-credit emphasis block, NOT an elective)
                                'capstone'          -- Opción de Grado
                              )),
  is_diagnostic             BOOLEAN DEFAULT 0,      -- "DIAGNOSTICO Y NIVELATORIO" (0-credit placement tests)
  is_elective               BOOLEAN DEFAULT 0,      -- true only for Electiva I..V (small catalog choices, NOT Profundización)
  elective_slot             TEXT                    -- e.g. "ELECTIVA_I" groups the catalog of options for that slot
);

CREATE INDEX idx_courses_period ON courses(period_id);
CREATE INDEX idx_courses_program ON courses(program_id);

-- Prerequisite / corequisite graph.
-- requirement_type: R = Requisito (must be completed before),
--                    C = Correquisito (must be taken same term or before),
--                    N = Nota mínima (minimum grade requirement)
CREATE TABLE course_requirements (
  id                  INTEGER PRIMARY KEY,
  course_id           INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  required_course_id  INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  requirement_type    TEXT NOT NULL DEFAULT 'R' CHECK (requirement_type IN ('R','C','N')),
  min_grade           REAL,              -- only used when requirement_type = 'N'
  UNIQUE(course_id, required_course_id, requirement_type)
);

CREATE INDEX idx_reqs_course ON course_requirements(course_id);
CREATE INDEX idx_reqs_required ON course_requirements(required_course_id);

-- ============================================================
-- Users / students — this is what makes the app multi-user
-- and is the foundation for turning it into a real product.
-- ============================================================
CREATE TABLE users (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT UNIQUE,
  program_id   INTEGER REFERENCES programs(id),
  cohort       TEXT,               -- e.g. "2024-1" (entry term), useful if the plan changes over time
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Per-user progress on each course. This table is the one that
-- grows fastest (rows = users × courses), so it's the one to
-- shard/partition first if this ever needs to scale to many users.
CREATE TABLE user_course_status (
  id           INTEGER PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','in_progress','completed','failed')),
  grade        REAL,
  term_taken   TEXT,               -- e.g. "2025-2"
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_status_user ON user_course_status(user_id);
CREATE INDEX idx_status_course ON user_course_status(course_id);

-- ============================================================
-- Convenience view: a course is "unlocked" for a user if every
-- one of its R-type requirements is 'completed' for that user.
-- Most SQL engines (incl. SQLite 3.25+ and Postgres) support this.
-- ============================================================
CREATE VIEW v_course_unlock_status AS
SELECT
  u.id AS user_id,
  c.id AS course_id,
  c.code,
  c.name,
  COALESCE(ucs.status, 'pending') AS current_status,
  CASE WHEN NOT EXISTS (
    SELECT 1 FROM course_requirements cr
    JOIN users u2 ON u2.id = u.id
    LEFT JOIN user_course_status req_status
      ON req_status.user_id = u.id AND req_status.course_id = cr.required_course_id
    WHERE cr.course_id = c.id
      AND cr.requirement_type = 'R'
      AND (req_status.status IS NULL OR req_status.status != 'completed')
  ) THEN 1 ELSE 0 END AS is_unlocked
FROM users u
CROSS JOIN courses c
LEFT JOIN user_course_status ucs ON ucs.user_id = u.id AND ucs.course_id = c.id;
