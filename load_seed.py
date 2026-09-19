"""
Loads schema.sql + seed_data.json into a local SQLite database (curriculum.db).
Run: python load_seed.py

This is a starting point — Antigravity can extend it to target Postgres/
Supabase later by swapping the connection layer.
"""
import json
import sqlite3
from pathlib import Path

BASE = Path(__file__).parent
DB_PATH = BASE / "curriculum.db"
SCHEMA_PATH = BASE / "schema.sql"
SEED_PATH = BASE / "seed_data.json"


def main():
    if DB_PATH.exists():
        DB_PATH.unlink()

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")

    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        conn.executescript(f.read())

    with open(SEED_PATH, "r", encoding="utf-8") as f:
        seed = json.load(f)

    program = seed["program"]
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO programs (name, institution, campus, modality, total_periods) VALUES (?, ?, ?, ?, ?)",
        (program["name"], program["institution"], program["campus"], program["modality"], program["total_periods"]),
    )
    program_id = cur.lastrowid

    period_ids = {}
    for n in range(1, program["total_periods"] + 1):
        cur.execute("INSERT INTO periods (program_id, number) VALUES (?, ?)", (program_id, n))
        period_ids[n] = cur.lastrowid

    # Insert learning fields and build a name → id map.
    field_name_to_id = {}
    for field_name in seed.get("learning_fields", []):
        cur.execute("INSERT OR IGNORE INTO learning_fields (name) VALUES (?)", (field_name,))
        cur.execute("SELECT id FROM learning_fields WHERE name = ?", (field_name,))
        field_name_to_id[field_name] = cur.fetchone()[0]

    code_to_id = {}
    for c in seed["courses"]:
        lf_name = c.get("learning_field")
        lf_id = field_name_to_id.get(lf_name) if lf_name else None
        cur.execute(
            """INSERT INTO courses
               (program_id, period_id, code, name, hours_theoretical, hours_practical,
                hours_independent_work, credits, academic_weighting, category,
                is_diagnostic, is_elective, elective_slot, learning_field_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                program_id,
                period_ids[c["period"]],
                c["code"],
                c["name"],
                c["ht"],
                c["hp"],
                c["htp"],
                c["credits"],
                c["weighting"],
                c.get("category", "core"),
                int(c["is_diagnostic"]),
                int(c["is_elective"]),
                c.get("elective_slot"),
                lf_id,
            ),
        )
        code_to_id[c["code"]] = cur.lastrowid

    # Second pass: now that every course has an id, insert prerequisite edges.
    for c in seed["courses"]:
        for req_code in c["prereqs"]:
            if req_code not in code_to_id:
                print(f"WARNING: {c['code']} references unknown prerequisite {req_code}")
                continue
            cur.execute(
                "INSERT INTO course_requirements (course_id, required_course_id, requirement_type) VALUES (?, ?, 'R')",
                (code_to_id[c["code"]], code_to_id[req_code]),
            )

    conn.commit()
    n_courses = cur.execute("SELECT COUNT(*) FROM courses").fetchone()[0]
    n_reqs = cur.execute("SELECT COUNT(*) FROM course_requirements").fetchone()[0]
    n_fields = cur.execute("SELECT COUNT(*) FROM learning_fields").fetchone()[0]
    print(f"Loaded {n_fields} learning fields, {n_courses} courses and {n_reqs} prerequisite edges into {DB_PATH}")
    conn.close()


if __name__ == "__main__":
    main()
