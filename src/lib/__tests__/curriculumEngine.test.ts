import { describe, it, expect } from 'vitest'
import {
  getCurriculumSeed,
  getAllCourses,
  calculateCourseState,
  getAffectedDownstreamCourses,
  calculateCurriculumMetrics
} from '../curriculumEngine'
import { calculateXP, calculateLevelInfo, evaluateUnlockedAchievements } from '../gamificationEngine'
import type { CourseStatusType } from '../../types/curriculum'

describe('Curriculum Engine & DAG Verification', () => {
  it('should parse seed_data.json correctly with 66 courses and 158 total credits', () => {
    const seed = getCurriculumSeed()
    expect(seed.program.name).toBe('Administración de Empresas')
    expect(seed.program.total_periods).toBe(9)

    const courses = getAllCourses()
    expect(courses.length).toBe(66)

    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)
    expect(totalCredits).toBe(158)
  })

  it('should unlock courses without prerequisites by default', () => {
    const userMap = new Map<string, CourseStatusType>()
    const contabilidadState = calculateCourseState('CAD102020104', userMap)
    expect(contabilidadState).toBe('unlocked')
  })

  it('should lock courses with unfulfilled prerequisites', () => {
    const userMap = new Map<string, CourseStatusType>()
    // Costos y Presupuesto requires Contabilidad General
    const costosState = calculateCourseState('CAD102020209', userMap)
    expect(costosState).toBe('locked')
  })

  it('should unlock downstream course when prerequisite is marked completed', () => {
    const userMap = new Map<string, CourseStatusType>()
    userMap.set('CAD102020104', 'completed') // Contabilidad General

    const costosState = calculateCourseState('CAD102020209', userMap)
    expect(costosState).toBe('unlocked')
  })

  it('should perform recursive BFS graph traversal for cascading rollback', () => {
    // Matemática Financiera (Sem 4) -> Análisis Financiero (Sem 5) -> Admin Financiera (Sem 6) -> Finanzas Internacionales (Sem 7)
    const affectedSet = getAffectedDownstreamCourses('CAD102020419')
    expect(affectedSet.has('CAD102020523')).toBe(true) // Análisis Financiero
    expect(affectedSet.has('CAD102020631')).toBe(true) // Admin Financiera
    expect(affectedSet.has('CAD102020736')).toBe(true) // Finanzas Internacionales
  })

  it('should calculate XP deterministically (1 credit = 100 XP)', () => {
    const courses = getAllCourses()
    const userMap = new Map<string, CourseStatusType>()
    
    // Contabilidad General = 4 credits = 400 XP
    userMap.set('CAD102020104', 'completed')
    
    const xp = calculateXP(courses, userMap)
    expect(xp).toBe(400)

    const lvl = calculateLevelInfo(xp)
    expect(lvl.level).toBe(1)
  })

  it('should reach Level 10 with 15,800 XP when 100% courses are completed', () => {
    const courses = getAllCourses()
    const userMap = new Map<string, CourseStatusType>()

    for (const c of courses) {
      userMap.set(c.code, 'completed')
    }

    const xp = calculateXP(courses, userMap)
    expect(xp).toBe(15800)

    const lvl = calculateLevelInfo(xp)
    expect(lvl.level).toBe(10)
    expect(lvl.title).toBe('Administrador Legendario')

    const achievements = evaluateUnlockedAchievements(courses, userMap)
    expect(achievements.some(a => a.id === 'JEFE_FINAL')).toBe(true)
  })

  it('should compute area metrics correctly', () => {
    const userMap = new Map<string, CourseStatusType>()
    userMap.set('CAD102020104', 'completed') // 4 credits in Contabilidad y Costos

    const metrics = calculateCurriculumMetrics(userMap)
    expect(metrics.completedCredits).toBe(4)
    expect(metrics.totalCredits).toBe(158)
    expect(metrics.creditsByField['Contabilidad y Costos'].completed).toBe(4)
  })
})
