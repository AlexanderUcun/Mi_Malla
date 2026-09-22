import React, { createContext, useContext, useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  db,
  saveCourseStatus,
  getAllUserCourseRecords,
  resetAllProgress,
  saveSetting
} from '../lib/db'
import {
  getAllCourses,
  calculateCourseState,
  getAffectedDownstreamCourses,
  getAncestorPrerequisites,
  calculateCurriculumMetrics,
  calculateGPAMetrics
} from '../lib/curriculumEngine'
import {
  calculateXP,
  calculateLevelInfo,
  evaluateUnlockedAchievements
} from '../lib/gamificationEngine'
import {
  type Course,
  type CourseStatusType,
  type ComputedCourseState,
  type LevelInfo,
  type Achievement
} from '../types/curriculum'

interface CurriculumContextType {
  isHydrating: boolean
  courses: Course[]
  userStatusMap: Map<string, CourseStatusType>
  computedStateMap: Map<string, ComputedCourseState>
  customNamesMap: Map<string, string>
  gradesMap: Map<string, number>
  selectedPeriod: number
  setSelectedPeriod: (period: number) => void
  activeTab: 'malla' | 'logros' | 'analytics' | 'settings' | 'about'
  setActiveTab: (tab: 'malla' | 'logros' | 'analytics' | 'settings' | 'about') => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  inspectedCourseCode: string | null
  setInspectedCourseCode: (code: string | null) => void

  // Diagnostics Visibility State
  hideDiagnosticsInMalla: boolean
  toggleHideDiagnosticsInMalla: () => Promise<void>

  // Chain Glow Focus State
  focusedCourseCode: string | null
  setFocusedCourseCode: (code: string | null) => void
  ancestorPrereqCodes: Set<string>
  descendantUnlockCodes: Set<string>
  
  // Actions
  toggleCourseStatus: (code: string) => Promise<void>
  setCourseStatus: (code: string, status: CourseStatusType) => Promise<void>
  setCourseExtras: (code: string, extras: { grade?: number; custom_name?: string }) => Promise<void>
  completeSemester: (periodNumber: number) => Promise<void>
  resetProgress: () => Promise<void>
  
  // Simulation Mode
  isSimulationMode: boolean
  toggleSimulationMode: () => void
  
  // Metrics & Gamification
  totalXP: number
  levelInfo: LevelInfo
  unlockedAchievements: Achievement[]
  metrics: ReturnType<typeof calculateCurriculumMetrics>
  gpaMetrics: ReturnType<typeof calculateGPAMetrics>
  
  // Undo Toast State
  undoState: { code: string; previousStatus: CourseStatusType } | null
  undoLastAction: () => Promise<void>
  clearUndo: () => void
}

const CurriculumContext = createContext<CurriculumContextType | null>(null)

export const CurriculumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'malla' | 'logros' | 'analytics' | 'settings' | 'about'>('malla')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [inspectedCourseCode, setInspectedCourseCode] = useState<string | null>(null)
  const [focusedCourseCode, setFocusedCourseCode] = useState<string | null>(null)
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false)
  const [simulatedStatuses, setSimulatedStatuses] = useState<Map<string, CourseStatusType>>(new Map())
  const [undoState, setUndoState] = useState<{ code: string; previousStatus: CourseStatusType } | null>(null)

  // Live Query from Dexie.js (Reactive Local-First)
  const liveRecords = useLiveQuery(async () => {
    return await getAllUserCourseRecords()
  }, [])

  const isHydrating = liveRecords === undefined

  const allCourses = useMemo(() => getAllCourses(), [])

  // Build real userStatusMap & customNamesMap from Dexie
  const { userStatusMap, customNamesMap, gradesMap } = useMemo(() => {
    const statusMap = new Map<string, CourseStatusType>()
    const namesMap = new Map<string, string>()
    const gMap = new Map<string, number>()

    if (isSimulationMode) {
      // In simulation mode, use simulated clone
      return {
        userStatusMap: new Map(simulatedStatuses),
        customNamesMap: namesMap,
        gradesMap: gMap
      }
    }

    if (liveRecords) {
      for (const rec of liveRecords) {
        statusMap.set(rec.course_code, rec.status)
        if (rec.custom_name) namesMap.set(rec.course_code, rec.custom_name)
        if (rec.grade !== undefined) gMap.set(rec.course_code, rec.grade)
      }
    }

    return { userStatusMap: statusMap, customNamesMap: namesMap, gradesMap: gMap }
  }, [liveRecords, isSimulationMode, simulatedStatuses])

  // Computed state map (locked, unlocked, in_progress, completed, failed)
  const computedStateMap = useMemo(() => {
    const map = new Map<string, ComputedCourseState>()
    for (const course of allCourses) {
      map.set(course.code, calculateCourseState(course.code, userStatusMap))
    }
    return map
  }, [allCourses, userStatusMap])

  // Live Query for Hide Diagnostics in Malla setting
  const liveHideDiag = useLiveQuery(async () => {
    const rec = await db.user_settings.get('hideDiagnosticsInMalla')
    return rec ? Boolean(rec.value) : false
  }, [])

  const hideDiagnosticsInMalla = liveHideDiag ?? false

  const toggleHideDiagnosticsInMalla = async () => {
    await saveSetting('hideDiagnosticsInMalla', !hideDiagnosticsInMalla)
  }

  // Gamification & Metrics
  const totalXP = useMemo(() => calculateXP(allCourses, userStatusMap), [allCourses, userStatusMap])
  const levelInfo = useMemo(() => calculateLevelInfo(totalXP), [totalXP])
  const unlockedAchievements = useMemo(
    () => evaluateUnlockedAchievements(allCourses, userStatusMap),
    [allCourses, userStatusMap]
  )
  const metrics = useMemo(() => calculateCurriculumMetrics(userStatusMap), [userStatusMap])
  const gpaMetrics = useMemo(() => calculateGPAMetrics(userStatusMap, gradesMap), [userStatusMap, gradesMap])

  // Chain Glow Ancestors & Descendants calculation
  const { ancestorPrereqCodes, descendantUnlockCodes } = useMemo(() => {
    if (!focusedCourseCode) {
      return { ancestorPrereqCodes: new Set<string>(), descendantUnlockCodes: new Set<string>() }
    }
    return {
      ancestorPrereqCodes: getAncestorPrerequisites(focusedCourseCode),
      descendantUnlockCodes: getAffectedDownstreamCourses(focusedCourseCode)
    }
  }, [focusedCourseCode])

  // Theme toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  // Toggle Course Status Action (with Cascading Rollback)
  const setCourseStatus = async (code: string, newStatus: CourseStatusType) => {
    const previousStatus = userStatusMap.get(code) || 'pending'
    setUndoState({ code, previousStatus })

    if (isSimulationMode) {
      const nextMap = new Map(simulatedStatuses)
      if (newStatus === 'pending') {
        nextMap.delete(code)
        // Cascade rollback
        const affected = getAffectedDownstreamCourses(code)
        for (const affCode of affected) {
          nextMap.delete(affCode)
        }
      } else {
        nextMap.set(code, newStatus)
      }
      setSimulatedStatuses(nextMap)
      return
    }

    if (newStatus === 'pending' || newStatus === 'failed') {
      // Cascading rollback: find all downstream courses and reset them
      const affected = getAffectedDownstreamCourses(code)
      await db.transaction('rw', db.user_course_status, async () => {
        await saveCourseStatus(code, newStatus)
        for (const affCode of affected) {
          await saveCourseStatus(affCode, 'pending')
        }
      })
    } else {
      await saveCourseStatus(code, newStatus)
    }
  }

  const toggleCourseStatus = async (code: string) => {
    const current = computedStateMap.get(code)
    if (current === 'completed') {
      await setCourseStatus(code, 'pending')
    } else if (current === 'in_progress') {
      await setCourseStatus(code, 'completed')
    } else if (current === 'unlocked') {
      await setCourseStatus(code, 'completed')
    }
  }

  const setCourseExtras = async (code: string, extras: { grade?: number; custom_name?: string }) => {
    const currentStatus = userStatusMap.get(code) || 'pending'
    if (!isSimulationMode) {
      await saveCourseStatus(code, currentStatus, extras)
    }
  }

  const completeSemester = async (periodNumber: number) => {
    const periodCourses = allCourses.filter(c => c.period === periodNumber)
    if (isSimulationMode) {
      const nextMap = new Map(simulatedStatuses)
      for (const c of periodCourses) {
        nextMap.set(c.code, 'completed')
      }
      setSimulatedStatuses(nextMap)
      return
    }

    await db.transaction('rw', db.user_course_status, async () => {
      for (const c of periodCourses) {
        await saveCourseStatus(c.code, 'completed')
      }
    })
  }

  const resetProgress = async () => {
    if (isSimulationMode) {
      setSimulatedStatuses(new Map())
      return
    }
    await resetAllProgress()
  }

  const toggleSimulationMode = () => {
    if (!isSimulationMode) {
      // Start simulation with clone of current state
      setSimulatedStatuses(new Map(userStatusMap))
    }
    setIsSimulationMode(!isSimulationMode)
  }

  const undoLastAction = async () => {
    if (!undoState) return
    await setCourseStatus(undoState.code, undoState.previousStatus)
    setUndoState(null)
  }

  const clearUndo = () => setUndoState(null)

  return (
    <CurriculumContext.Provider
      value={{
        isHydrating,
        courses: allCourses,
        userStatusMap,
        computedStateMap,
        customNamesMap,
        gradesMap,
        selectedPeriod,
        setSelectedPeriod,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        inspectedCourseCode,
        setInspectedCourseCode,
        hideDiagnosticsInMalla,
        toggleHideDiagnosticsInMalla,
        focusedCourseCode,
        setFocusedCourseCode,
        ancestorPrereqCodes,
        descendantUnlockCodes,
        toggleCourseStatus,
        setCourseStatus,
        setCourseExtras,
        completeSemester,
        resetProgress,
        isSimulationMode,
        toggleSimulationMode,
        totalXP,
        levelInfo,
        unlockedAchievements,
        metrics,
        gpaMetrics,
        undoState,
        undoLastAction,
        clearUndo
      }}
    >
      {children}
    </CurriculumContext.Provider>
  )
}

export const useCurriculum = () => {
  const context = useContext(CurriculumContext)
  if (!context) {
    throw new Error('useCurriculum must be used within a CurriculumProvider')
  }
  return context
}
