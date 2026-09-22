import rawSeedData from '../../seed_data.json'
import {
  ZCurriculumSeed,
  type CurriculumSeed,
  type Course,
  type CourseStatusType,
  type ComputedCourseState
} from '../types/curriculum'

// ==========================================================================
// SEED HYDRATION & MAP INDEXING IN RAM (O(1) Latency)
// ==========================================================================

const validatedSeed: CurriculumSeed = ZCurriculumSeed.parse(rawSeedData)

const courseMap = new Map<string, Course>()
const periodMap = new Map<number, Course[]>()
const prereqMap = new Map<string, string[]>()
const unlocksMap = new Map<string, string[]>()

// Index courses in RAM
for (const course of validatedSeed.courses) {
  courseMap.set(course.code, course)

  // Group by period
  const list = periodMap.get(course.period) || []
  list.push(course)
  periodMap.set(course.period, list)

  // Prereqs
  prereqMap.set(course.code, course.prereqs || [])
}

// Ensure diagnostic courses are sorted at the end of each period list
for (const list of periodMap.values()) {
  list.sort((a, b) => {
    if (a.is_diagnostic === b.is_diagnostic) return 0
    return a.is_diagnostic ? 1 : -1
  })
}

// Build reverse unlock graph (unlocksMap)
for (const course of validatedSeed.courses) {
  for (const prereqCode of course.prereqs) {
    const list = unlocksMap.get(prereqCode) || []
    if (!list.includes(course.code)) {
      list.push(course.code)
    }
    unlocksMap.set(prereqCode, list)
  }
}

// ==========================================================================
// CURRICULUM ENGINE EXPORTED METHODS
// ==========================================================================

export function getCurriculumSeed(): CurriculumSeed {
  return validatedSeed
}

export function getAllCourses(): Course[] {
  return validatedSeed.courses
}

export function getCourse(code: string): Course | undefined {
  return courseMap.get(code)
}

export function getCoursesByPeriod(period: number): Course[] {
  return periodMap.get(period) || []
}

export function getPrerequisites(code: string): Course[] {
  const codes = prereqMap.get(code) || []
  return codes.map(c => courseMap.get(c)).filter((c): c is Course => c !== undefined)
}

export function getUnlockedTargetCourses(code: string): Course[] {
  const codes = unlocksMap.get(code) || []
  return codes.map(c => courseMap.get(c)).filter((c): c is Course => c !== undefined)
}

/**
 * Returns minimum passing grade required according to Reglamento Estudiantil (Art. 42 REA).
 * General rule: 3.0 (60% REA).
 * Special cases: 3.5 (70% REA) for Lengua Extranjera (CAI), Ciudadanía Siglo 21 (CAI),
 * Cátedra Generación Siglo 21 (CAI), and Prácticas profesionales/pedagógicas/educativas (CADI).
 */
export function getMinPassingGrade(course: Course): number {
  if (course.is_diagnostic) return 3.0

  const nameLower = course.name.toLowerCase()
  const codeUpper = course.code.toUpperCase()
  const fieldLower = (course.learning_field || '').toLowerCase()

  // Lengua Extranjera (CAI) / Inglés
  if (
    fieldLower === 'idiomas' ||
    nameLower.includes('lengua extranjera') ||
    nameLower.includes('inglés') ||
    nameLower.includes('ingles')
  ) {
    return 3.5
  }

  // Ciudadanía Siglo 21 (CAI)
  if (
    nameLower.includes('ciudadanía') ||
    nameLower.includes('ciudadania') ||
    codeUpper.includes('CAI1002020303')
  ) {
    return 3.5
  }

  // Cátedra Generación Siglo 21 (CAI)
  if (
    nameLower.includes('cátedra generación') ||
    nameLower.includes('catedra generacion') ||
    codeUpper.includes('CAI1002020609')
  ) {
    return 3.5
  }

  // Prácticas profesionales, pedagógicas o educativas (CADI)
  if (nameLower.includes('práctica') || nameLower.includes('practica')) {
    return 3.5
  }

  return 3.0
}

export function isGradePassing(course: Course, grade: number): boolean {
  return grade >= getMinPassingGrade(course)
}

/**
 * Calculates the exact computed state for a course based on the student's status map.
 */
export function calculateCourseState(
  courseCode: string,
  userStatusMap: Map<string, CourseStatusType>
): ComputedCourseState {
  const userStatus = userStatusMap.get(courseCode)

  if (userStatus === 'completed') return 'completed'
  if (userStatus === 'in_progress') return 'in_progress'
  if (userStatus === 'failed') return 'failed'

  const prereqs = prereqMap.get(courseCode) || []
  if (prereqs.length === 0) {
    return 'unlocked'
  }

  // All prereqs must be marked as completed
  const allPrereqsMet = prereqs.every(reqCode => userStatusMap.get(reqCode) === 'completed')
  return allPrereqsMet ? 'unlocked' : 'locked'
}

/**
 * RECURSIVE REVERSE GRAPH TRAVERSAL (BFS/DFS)
 * Finds ALL downstream courses that depend directly or indirectly on `courseCode`.
 * Used for safe cascade rollback when a student unchecks a course.
 */
export function getAffectedDownstreamCourses(courseCode: string): Set<string> {
  const affected = new Set<string>()
  const queue: string[] = [courseCode]

  while (queue.length > 0) {
    const current = queue.shift()!
    const directDependents = unlocksMap.get(current) || []

    for (const depCode of directDependents) {
      if (!affected.has(depCode)) {
        affected.add(depCode)
        queue.push(depCode)
      }
    }
  }

  return affected
}

/**
 * RECURSIVE BACKWARD GRAPH TRAVERSAL (BFS/DFS)
 * Finds ALL prerequisite courses required directly or indirectly before `courseCode`.
 * Used for backward Chain Glow highlighting (Predecessors).
 */
export function getAncestorPrerequisites(courseCode: string): Set<string> {
  const ancestors = new Set<string>()
  const queue: string[] = [courseCode]

  while (queue.length > 0) {
    const current = queue.shift()!
    const directPrereqs = prereqMap.get(current) || []

    for (const pCode of directPrereqs) {
      if (!ancestors.has(pCode)) {
        ancestors.add(pCode)
        queue.push(pCode)
      }
    }
  }

  return ancestors
}

/**
 * Calculates total credits and breakdown by area/category
 */
export function calculateCurriculumMetrics(userStatusMap: Map<string, CourseStatusType>) {
  let completedCredits = 0
  let totalCredits = 0
  let completedCoursesCount = 0

  const creditsByField: Record<string, { completed: number; total: number }> = {}

  for (const field of validatedSeed.learning_fields) {
    creditsByField[field] = { completed: 0, total: 0 }
  }

  for (const course of validatedSeed.courses) {
    totalCredits += course.credits

    if (course.learning_field && creditsByField[course.learning_field]) {
      creditsByField[course.learning_field].total += course.credits
    }

    if (userStatusMap.get(course.code) === 'completed') {
      completedCredits += course.credits
      completedCoursesCount++

      if (course.learning_field && creditsByField[course.learning_field]) {
        creditsByField[course.learning_field].completed += course.credits
      }
    }
  }

  const completionPercentage = totalCredits > 0 ? (completedCredits / totalCredits) * 100 : 0

  return {
    completedCredits,
    totalCredits,
    completedCoursesCount,
    totalCoursesCount: validatedSeed.courses.length,
    completionPercentage,
    creditsByField
  }
}

export interface SemesterGPADetail {
  gpa: number | null
  totalPoints: number
  totalCreditsWithGrade: number
  gradedCoursesCount: number
}

export interface GPAMetrics {
  cumulativeGPA: number | null
  totalPoints: number
  totalCreditsWithGrade: number
  gradedCoursesCount: number
  semesterGPAs: Record<number, SemesterGPADetail>
}

export type AcademicStandingStatus = 'pending' | 'good' | 'risk'

/**
 * Evaluates academic standing according to student regulations:
 * Minimum cumulative GPA must never fall below 3.2.
 * For 1st semester students, the 1st period GPA acts as cumulative.
 */
export function getAcademicStanding(cumulativeGPA: number | null): {
  status: AcademicStandingStatus
  minRequired: number
  difference: number | null
} {
  const minRequired = 3.2
  if (cumulativeGPA === null) {
    return { status: 'pending', minRequired, difference: null }
  }
  const difference = Math.round((cumulativeGPA - minRequired) * 100) / 100
  return {
    status: cumulativeGPA >= minRequired ? 'good' : 'risk',
    minRequired,
    difference
  }
}

/**
 * Calculates weighted GPA per semester and cumulative GPA across the curriculum.
 * Only includes completed courses with >0 credits that have an explicit grade (0.0 to 5.0).
 */
export function calculateGPAMetrics(
  userStatusMap: Map<string, CourseStatusType>,
  gradesMap: Map<string, number>
): GPAMetrics {
  let cumulativePoints = 0
  let cumulativeCredits = 0
  let cumulativeGradedCount = 0

  const semesterGPAs: Record<number, SemesterGPADetail> = {}
  for (let p = 1; p <= validatedSeed.program.total_periods; p++) {
    semesterGPAs[p] = {
      gpa: null,
      totalPoints: 0,
      totalCreditsWithGrade: 0,
      gradedCoursesCount: 0
    }
  }

  for (const course of validatedSeed.courses) {
    const isCompleted = userStatusMap.get(course.code) === 'completed'
    const grade = gradesMap.get(course.code)

    if (isCompleted && grade !== undefined && grade !== null && !isNaN(grade)) {
      if (course.credits > 0) {
        const points = grade * course.credits
        cumulativePoints += points
        cumulativeCredits += course.credits
        cumulativeGradedCount++

        const semDetail = semesterGPAs[course.period]
        if (semDetail) {
          semDetail.totalPoints += points
          semDetail.totalCreditsWithGrade += course.credits
          semDetail.gradedCoursesCount++
        }
      }
    }
  }

  // Compute GPAs
  for (let p = 1; p <= validatedSeed.program.total_periods; p++) {
    const sem = semesterGPAs[p]
    if (sem.totalCreditsWithGrade > 0) {
      sem.gpa = Math.round((sem.totalPoints / sem.totalCreditsWithGrade) * 100) / 100
    }
  }

  const cumulativeGPA = cumulativeCredits > 0
    ? Math.round((cumulativePoints / cumulativeCredits) * 100) / 100
    : null

  return {
    cumulativeGPA,
    totalPoints: cumulativePoints,
    totalCreditsWithGrade: cumulativeCredits,
    gradedCoursesCount: cumulativeGradedCount,
    semesterGPAs
  }
}

