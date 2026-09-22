import type { Course, CourseStatusType, LevelInfo, Achievement } from '../types/curriculum'

// ==========================================================================
// LEVEL THRESHOLDS & PROGRESSIVE EXP CURVE (Total = 15,800 XP)
// ==========================================================================

export interface LevelConfig {
  level: number
  title: string
  minXP: number
  maxXP: number
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, title: 'Recluta Universitario', minXP: 0, maxXP: 1000 },
  { level: 2, title: 'Explorador de Conceptos', minXP: 1001, maxXP: 2500 },
  { level: 3, title: 'Analista Junior', minXP: 2501, maxXP: 4200 },
  { level: 4, title: 'Estratega en Formación', minXP: 4201, maxXP: 6100 },
  { level: 5, title: 'Gestor de Proyectos', minXP: 6101, maxXP: 8200 },
  { level: 6, title: 'Consultor Organizacional', minXP: 8201, maxXP: 10400 },
  { level: 7, title: 'Director de Área', minXP: 10401, maxXP: 12600 },
  { level: 8, title: 'Ejecutivo Máster', minXP: 12601, maxXP: 14400 },
  { level: 9, title: 'Candidato a Título', minXP: 14401, maxXP: 15799 },
  { level: 10, title: 'Administrador Legendario', minXP: 15800, maxXP: 15800 }
]

/**
 * Calculates total XP deterministically from completed courses.
 * XP = sum(credits) * 100
 */
export function calculateXP(courses: Course[], userStatusMap: Map<string, CourseStatusType>): number {
  let totalXP = 0
  for (const course of courses) {
    if (userStatusMap.get(course.code) === 'completed') {
      totalXP += course.credits * 100
    }
  }
  return totalXP
}

/**
 * Calculates current level and progress info from total XP
 */
export function calculateLevelInfo(xp: number): LevelInfo {
  const currentXP = Math.max(0, Math.min(15800, xp))

  let currentLevelConfig = LEVEL_CONFIGS[0]
  for (const cfg of LEVEL_CONFIGS) {
    if (currentXP >= cfg.minXP) {
      currentLevelConfig = cfg
    }
  }

  const isMaxLevel = currentLevelConfig.level === 10
  const nextLevelXP = isMaxLevel ? 15800 : currentLevelConfig.maxXP
  const levelRange = nextLevelXP - currentLevelConfig.minXP
  const xpInLevel = currentXP - currentLevelConfig.minXP

  const progressPercentage = isMaxLevel
    ? 100
    : Math.min(100, Math.max(0, (xpInLevel / (levelRange || 1)) * 100))

  return {
    level: currentLevelConfig.level,
    title: currentLevelConfig.title,
    currentXP,
    requiredXP: nextLevelXP,
    nextLevelXP,
    progressPercentage
  }
}

// ==========================================================================
// DYNAMIC ACHIEVEMENTS ENGINE
// ==========================================================================

export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: 'MENTE_CALIBRADA',
    title: 'Mente Calibrada',
    description: 'Superar las pruebas de diagnóstico nivelatorio de Semestre 1 y 2.',
    iconName: 'BrainCheck',
    category: 'special',
    criteriaFn: (courses, userStatusMap) => {
      const diagCourses = courses.filter(c => c.is_diagnostic && (c.period === 1 || c.period === 2))
      return diagCourses.length > 0 && diagCourses.every(c => userStatusMap.get(c.code) === 'completed')
    }
  },
  {
    id: 'INVESTIGADOR',
    title: 'Investigador Nato',
    description: 'Superar el Diagnóstico Nivelatorio de Fundamentos de Investigación.',
    iconName: 'FlaskConical',
    category: 'special',
    criteriaFn: (_courses, userStatusMap) => {
      return userStatusMap.get('DNCTI102020628') === 'completed'
    }
  },
  {
    id: 'LOBO_WALL_STREET',
    title: 'Lobo de Wall Street',
    description: 'Completar el 100% del área de Finanzas.',
    iconName: 'TrendingUp',
    category: 'area',
    criteriaFn: (courses, userStatusMap) => {
      const finCourses = courses.filter(c => c.learning_field === 'Finanzas')
      return finCourses.length > 0 && finCourses.every(c => userStatusMap.get(c.code) === 'completed')
    }
  },
  {
    id: 'LIDER_EQUIPOS',
    title: 'Líder de Equipos',
    description: 'Completar el área de Talento Humano.',
    iconName: 'Users',
    category: 'area',
    criteriaFn: (courses, userStatusMap) => {
      const hrCourses = courses.filter(c => c.learning_field === 'Talento Humano')
      return hrCourses.length > 0 && hrCourses.every(c => userStatusMap.get(c.code) === 'completed')
    }
  },
  {
    id: 'POLIGLOTA',
    title: 'Políglota Institucional',
    description: 'Completar todos los niveles de Lengua Extranjera (I al IV).',
    iconName: 'Globe',
    category: 'area',
    criteriaFn: (_courses, userStatusMap) => {
      const langCodes = ['CAI1002020304', 'CAI1002020406', 'CAI1002020507', 'CAI1002020608']
      return langCodes.every(code => userStatusMap.get(code) === 'completed')
    }
  },
  {
    id: 'SEM_1_MASTER',
    title: 'Superviviente de 1º Semestre',
    description: 'Aprobar el 100% de las materias del Primer Semestre.',
    iconName: 'Award',
    category: 'milestone',
    criteriaFn: (courses, userStatusMap) => {
      const sem1Courses = courses.filter(c => c.period === 1)
      return sem1Courses.length > 0 && sem1Courses.every(c => userStatusMap.get(c.code) === 'completed')
    }
  },
  {
    id: 'SEM_3_MASTER',
    title: 'Dominio del 3º Semestre',
    description: 'Aprobar el 100% de las materias del Tercer Semestre.',
    iconName: 'Award',
    category: 'milestone',
    criteriaFn: (courses, userStatusMap) => {
      const sem3Courses = courses.filter(c => c.period === 3)
      return sem3Courses.length > 0 && sem3Courses.every(c => userStatusMap.get(c.code) === 'completed')
    }
  },
  {
    id: 'SEM_5_MASTER',
    title: 'Conquistador del 5º Semestre',
    description: 'Aprobar el 100% de las materias del Quinto Semestre.',
    iconName: 'Award',
    category: 'milestone',
    criteriaFn: (courses, userStatusMap) => {
      const sem5Courses = courses.filter(c => c.period === 5)
      return sem5Courses.length > 0 && sem5Courses.every(c => userStatusMap.get(c.code) === 'completed')
    }
  },
  {
    id: 'SEM_7_MASTER',
    title: 'Veterano del 7º Semestre',
    description: 'Aprobar el 100% de las materias del Séptimo Semestre.',
    iconName: 'Award',
    category: 'milestone',
    criteriaFn: (courses, userStatusMap) => {
      const sem7Courses = courses.filter(c => c.period === 7)
      return sem7Courses.length > 0 && sem7Courses.every(c => userStatusMap.get(c.code) === 'completed')
    }
  },
  {
    id: 'ESPECIALISTA',
    title: 'Especialista Consagrado',
    description: 'Aprobar el bloque de Profundización (8 créditos).',
    iconName: 'Star',
    category: 'special',
    criteriaFn: (_courses, userStatusMap) => {
      return userStatusMap.get('CAD102020950C') === 'completed'
    }
  },
  {
    id: 'JEFE_FINAL',
    title: 'Jefe Final Derrotado',
    description: 'Completar Opción de Grado y el 100% del plan de estudios (158 créditos).',
    iconName: 'Crown',
    category: 'milestone',
    criteriaFn: (courses, userStatusMap) => {
      return courses.every(c => userStatusMap.get(c.code) === 'completed')
    }
  }
]

export function evaluateUnlockedAchievements(
  courses: Course[],
  userStatusMap: Map<string, CourseStatusType>
): Achievement[] {
  return ACHIEVEMENTS_CATALOG.filter(ach => ach.criteriaFn(courses, userStatusMap))
}

export interface AchievementProgressDetail {
  achievement: Achievement
  isUnlocked: boolean
  requiredCourses: { course: Course; isCompleted: boolean }[]
  totalRequired: number
  totalCompleted: number
  percentage: number
}

export function getAchievementProgressDetail(
  achievementId: string,
  courses: Course[],
  userStatusMap: Map<string, CourseStatusType>
): AchievementProgressDetail | null {
  const achievement = ACHIEVEMENTS_CATALOG.find(a => a.id === achievementId)
  if (!achievement) return null

  let requiredCourseObjects: Course[] = []

  // IMPORTANT: These filters MUST match the criteriaFn logic exactly
  switch (achievementId) {
    case 'MENTE_CALIBRADA':
      requiredCourseObjects = courses.filter(c => c.is_diagnostic && (c.period === 1 || c.period === 2))
      break
    case 'INVESTIGADOR':
      requiredCourseObjects = courses.filter(c => c.code === 'DNCTI102020628')
      break
    case 'LOBO_WALL_STREET':
      requiredCourseObjects = courses.filter(c => c.learning_field === 'Finanzas')
      break
    case 'LIDER_EQUIPOS':
      requiredCourseObjects = courses.filter(c => c.learning_field === 'Talento Humano')
      break
    case 'POLIGLOTA': {
      const langCodes = ['CAI1002020304', 'CAI1002020406', 'CAI1002020507', 'CAI1002020608']
      requiredCourseObjects = courses.filter(c => langCodes.includes(c.code))
      break
    }
    case 'SEM_1_MASTER':
      requiredCourseObjects = courses.filter(c => c.period === 1)
      break
    case 'SEM_3_MASTER':
      requiredCourseObjects = courses.filter(c => c.period === 3)
      break
    case 'SEM_5_MASTER':
      requiredCourseObjects = courses.filter(c => c.period === 5)
      break
    case 'SEM_7_MASTER':
      requiredCourseObjects = courses.filter(c => c.period === 7)
      break
    case 'ESPECIALISTA':
      requiredCourseObjects = courses.filter(c => c.code === 'CAD102020950C')
      break
    case 'JEFE_FINAL':
      requiredCourseObjects = courses
      break
  }

  const isUnlocked = achievement.criteriaFn(courses, userStatusMap)


  const requiredCourses = requiredCourseObjects.map(c => ({
    course: c,
    isCompleted: userStatusMap.get(c.code) === 'completed'
  }))

  const totalRequired = requiredCourses.length
  const totalCompleted = requiredCourses.filter(r => r.isCompleted).length
  const percentage = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0

  return {
    achievement,
    isUnlocked,
    requiredCourses,
    totalRequired,
    totalCompleted,
    percentage
  }
}
