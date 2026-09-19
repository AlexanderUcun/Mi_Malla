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
