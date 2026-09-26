import { useContext } from 'react'
import { CurriculumContext } from '../context/CurriculumContext'

export const useCurriculum = () => {
  const context = useContext(CurriculumContext)
  if (!context) {
    throw new Error('useCurriculum must be used within a CurriculumProvider')
  }
  return context
}
