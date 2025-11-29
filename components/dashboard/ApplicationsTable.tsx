'use client'

import {
  useState,
  useOptimistic,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useLayoutEffect,
  memo,
  useCallback,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toggleSelection } from '@/app/actions/toggleSelection'
import DownloadCSVButton from '@/components/dashboard/DownloadCSVButton'
import DownloadShortlistedCSVButton from '@/components/dashboard/DownloadShortlistedCSVButton'
import { ApplicationsContext } from '@/lib/context/ApplicationsContext'

type Application = {
  id: string
  created_at: string
  student_name: string
  roll_number: string
  email: string
  reason: string | null
  internship: string | null
  selected_subjects: any[] | null 
}

const parseSubject = (subj: any) => {
  if (!subj) return { name: 'Unknown', grade: '-', priority: '-' }
  if (typeof subj === 'string') return { name: subj, grade: '-', priority: '-' }

  const name = subj.name || subj.subject || subj.code || subj.title || JSON.stringify(subj)
  const grade = subj.grade || subj.mark || subj.score || '-'
  const priority = subj.priority || '-'

  return { name, grade, priority }
}

const SUBJECT_MAPPING: Record<string, string[]> = {
  'First Year': [
    '23CSE111 - Object Oriented Programming',
    '23CSE113 - User Interface Design',
  ],
  'Second Year': [
    '23CSE211 - Design and Analysis of Algorithms',
    '23CSE212 - Principles of Functional Languages',
    '23CSE213 - Computer Organization and Architecture',
    '23CSE214 - Operating Systems',
  ],
  'Third Year': [
    '23CSE311 - Software Engineering',
    '23CSE312 - Distributed Systems',
    '23CSE313 - Foundations of Cyber Security',
    '23CSE314 - Compiler Design',
  ],
  'Third Year Free Electives': [
    '23CSE475 - Generative AI',
    '23CSE461 - Full Stack Frameworks',
    '23CSE465 - Mobile Application Development',
    '23CSE363 - Cloud Computing',
    '23CSE473 - Neural Networks and Deep Learning',
    '23CSE452 - Business Analytics',
    '23CSE334 - Cyber Forensics and Malware',
    '23CSE365 - Internet of Things',
  ],
}

const BATCH_MAPPING = [
  { label: 'All Batches', value: 'All' },
  { label: 'Final Year (2022)', value: '22' },
  { label: 'Pre-Final Year (2023)', value: '23' },
]

const ReadMoreText = memo(function ReadMoreText({
  text,
  maxLength = 260,
  maxLines = 5,
  isExpanded: controlledExpanded,
  onToggle,
  syncedClampHeight,
  onHeightChange,
}: {
  text: string | null
  maxLength?: number
  maxLines?: number
  isExpanded?: boolean
  onToggle?: (next: boolean) => void
  syncedClampHeight?: number
  onHeightChange?: (height: number | undefined) => void
}) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false)
  const [needsTruncation, setNeedsTruncation] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const onHeightChangeRef = useRef(onHeightChange)
  const isControlled = typeof controlledExpanded === 'boolean'
  const isExpanded = isControlled ? controlledExpanded : uncontrolledExpanded

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onHeightChangeRef.current = onHeightChange
  }, [onHeightChange])

  const handleToggle = () => {
    const next = !isExpanded
    if (typeof window !== 'undefined' && containerRef.current) {
      const initialRect = containerRef.current.getBoundingClientRect()
      const initialScrollY = window.scrollY

      requestAnimationFrame(() => {
        if (!containerRef.current) return
        const newRect = containerRef.current.getBoundingClientRect()
        const delta = newRect.top - initialRect.top
        if (delta !== 0) {
          window.scrollTo({ top: initialScrollY + delta })
        }
      })
    }

    onToggle?.(next)
    if (!isControlled) {
      setUncontrolledExpanded(next)
    }
  }

  useLayoutEffect(() => {
    if (isExpanded && contentRef.current) {
      onHeightChangeRef.current?.(contentRef.current.scrollHeight)
    } else if (!isExpanded) {
      onHeightChangeRef.current?.(undefined)
    }
  }, [isExpanded, text])

  useEffect(() => {
    if (!contentRef.current || !text) {
      setNeedsTruncation(false)
      return
    }

    const measureHeight = () => {
      if (!contentRef.current) return
      
      const element = contentRef.current
      
      if (element.offsetWidth === 0) {
        setTimeout(measureHeight, 50)
        return
      }
      
      const computedStyle = getComputedStyle(element)
      const width = element.offsetWidth || parseFloat(computedStyle.width) || 300
      const lineHeight = parseFloat(computedStyle.lineHeight) || 24
      const clampedHeight = syncedClampHeight || (lineHeight * maxLines)
      
      const measureElement = document.createElement('p')
      measureElement.textContent = text
      measureElement.style.cssText = `
        position: absolute;
        visibility: hidden;
        height: auto;
        max-height: none;
        display: block;
        width: ${width}px;
        white-space: pre-wrap;
        word-break: break-word;
        text-align: left;
        line-height: ${lineHeight}px;
        margin: 0;
        padding: 0;
        font-family: ${computedStyle.fontFamily};
        font-size: ${computedStyle.fontSize};
        font-weight: ${computedStyle.fontWeight};
      `
      document.body.appendChild(measureElement)
      void measureElement.offsetHeight
      const fullHeight = measureElement.offsetHeight
      document.body.removeChild(measureElement)
      
      const isActuallyTruncated = fullHeight > clampedHeight + 8
      
      setNeedsTruncation(isActuallyTruncated)
    }

    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(measureHeight, { timeout: 300 })
      return () => cancelIdleCallback(id)
    } else {
      const timeoutId = setTimeout(measureHeight, 150)
      return () => clearTimeout(timeoutId)
    }
  }, [text, maxLines, syncedClampHeight, isExpanded])

  if (!text || text.trim() === '') {
    return <span className="text-gray-400 italic">None provided</span>
  }

  return (
    <div className="space-y-2" ref={containerRef}>
      <p
        ref={contentRef}
        className="whitespace-pre-wrap break-words text-left"
        style={
          !isExpanded
            ? syncedClampHeight
              ? {
                  maxHeight: syncedClampHeight,
                  overflow: 'hidden',
                }
              : {
                  display: '-webkit-box',
                  WebkitLineClamp: maxLines,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }
            : undefined
        }
      >
        {text}
      </p>
      {needsTruncation && (
        <button
          type="button"
          onClick={handleToggle}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
})

export default function ApplicationsTable({
  applications: propApplications,
  initialSelections: propInitialSelections,
  takenSelections = new Set(),
}: {
  applications?: Application[]
  initialSelections?: Set<string>
  takenSelections?: Set<string>
}) {
  const context = useContext(ApplicationsContext)
  const pathname = usePathname()
  const router = useRouter()
  
  const isShortlistedPage = pathname === '/dashboard/chosen'
  
  const applications = propApplications || (context?.applications || [])
  
  const initialSelections = propInitialSelections || (context?.selections || new Set<string>())

  const selectionData = context?.selectionData || {}

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedBatch, setSelectedBatch] = useState('All')
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' })
  const [isSubjectSelectOpen, setIsSubjectSelectOpen] = useState(false)
  const [isBatchSelectOpen, setIsBatchSelectOpen] = useState(false)
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false)
  const [isSortSelectOpen, setIsSortSelectOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<
    Record<string, { reason: boolean; internship: boolean }>
  >({})
  const [rowSyncState, setRowSyncState] = useState<
    Record<string, { controller: 'reason' | 'internship' | null; height?: number }>
  >({})

  const getRowExpansion = (id: string) => expandedRows[id] || { reason: false, internship: false }
  const getRowSync = (id: string) => rowSyncState[id] || { controller: null, height: undefined }

  const handleRowToggle = (id: string, column: 'reason' | 'internship', next: boolean) => {
    setExpandedRows((prev) => {
      const current = prev[id] || { reason: false, internship: false }
      const updated = next
        ? {
            reason: column === 'reason' ? true : false,
            internship: column === 'internship' ? true : false,
          }
        : { reason: false, internship: false }
      return { ...prev, [id]: updated }
    })

    setRowSyncState((prev) => {
      if (!next) {
        return { ...prev, [id]: { controller: null, height: undefined } }
      }
      return {
        ...prev,
      [id]: { controller: column, height: undefined },
      }
    })
  }

  const handleHeightChange = useCallback((id: string, column: 'reason' | 'internship') => {
    return (height?: number) => {
      setRowSyncState((prev) => {
        const current = prev[id]
        if (!current || current.controller !== column) {
          return prev
        }
        if (current.height === height) {
          return prev
        }
        return { ...prev, [id]: { ...current, height } }
      })
    }
  }, [])

  const [optimisticSelections, addOptimisticSelection] = useOptimistic(
    initialSelections,
    (state, id: string) => {
      const newState = new Set(state)
      if (newState.has(id)) newState.delete(id)
      else newState.add(id)
      return newState
    }
  )

  const [localSelectionTimestamps, setLocalSelectionTimestamps] = useState<Record<string, number>>({})
  const [loadingSelections, setLoadingSelections] = useState<Set<string>>(new Set())
  const subjectDropdownRef = useRef<HTMLDivElement>(null)
  const pendingOperationsRef = useRef<Set<string>>(new Set())
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sync optimistic state with context when it updates (but not during pending operations)
  useEffect(() => {
    // Only sync if there are no pending operations to avoid conflicts
    if (pendingOperationsRef.current.size === 0) {
      // The useOptimistic hook will automatically use the new initialSelections
      // when there are no pending updates, so we don't need to manually sync
    }
  }, [initialSelections])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
        setIsSubjectSelectOpen(false)
      }
    }

    if (isSubjectSelectOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSubjectSelectOpen])

  useEffect(() => {
    if (selectionData && Object.keys(selectionData).length > 0) {
      const syncedTimestamps: Record<string, number> = {}
      Object.entries(selectionData).forEach(([key, data]) => {
        if (data.created_at) {
          syncedTimestamps[key] = new Date(data.created_at).getTime()
        }
      })
      setLocalSelectionTimestamps((prev) => ({ ...prev, ...syncedTimestamps }))
    }
  }, [selectionData])

  const handleToggle = async (id: string, subject: string) => {
    const compositeKey = `${id}::${subject}`
    const isAdding = !optimisticSelections.has(compositeKey)
    
    // Track this operation as pending and show loading state
    pendingOperationsRef.current.add(compositeKey)
    setLoadingSelections((prev) => new Set(prev).add(compositeKey))
    
    // Optimistic update - immediate UI feedback
    startTransition(() => {
      addOptimisticSelection(compositeKey)
      if (isAdding) {
        setLocalSelectionTimestamps((prev) => ({
          ...prev,
          [compositeKey]: Date.now(),
        }))
      } else {
        setLocalSelectionTimestamps((prev) => {
          const newTimestamps = { ...prev }
          delete newTimestamps[compositeKey]
          return newTimestamps
        })
      }
    })
    
    try {
      const result = await toggleSelection(id, subject)
      
      if (result?.error) {
        // Remove loading state on error
        pendingOperationsRef.current.delete(compositeKey)
        setLoadingSelections((prev) => {
          const next = new Set(prev)
          next.delete(compositeKey)
          return next
        })
        alert(result.error)
        // Revert optimistic update on error
        startTransition(() => {
          addOptimisticSelection(compositeKey)
        })
      } else if (result?.success) {
        // Batch refreshes - clear any pending refresh and schedule a new one
        // This prevents multiple refreshes when clicking multiple stars quickly
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current)
        }
        
        refreshTimeoutRef.current = setTimeout(async () => {
          // After shortlisting, we need fresh data from API (not cache)
          // because the cache doesn't have the updated shortlist yet
          // Keep spinner visible until refresh completes
          if (context) {
            try {
              await context.refresh(false)
            } catch (err) {
              console.error('Error refreshing context:', err)
            } finally {
              // Remove loading state only after refresh completes
              pendingOperationsRef.current.delete(compositeKey)
              setLoadingSelections((prev) => {
                const next = new Set(prev)
                next.delete(compositeKey)
                return next
              })
            }
          } else {
            // If no context, remove loading state immediately
            pendingOperationsRef.current.delete(compositeKey)
            setLoadingSelections((prev) => {
              const next = new Set(prev)
              next.delete(compositeKey)
              return next
            })
          }
          refreshTimeoutRef.current = null
        }, 500)
      }
    } catch (error) {
      console.error('Error toggling selection:', error)
      // Remove from pending operations and loading state
      pendingOperationsRef.current.delete(compositeKey)
      setLoadingSelections((prev) => {
        const next = new Set(prev)
        next.delete(compositeKey)
        return next
      })
      // Revert optimistic update on error
      startTransition(() => {
        addOptimisticSelection(compositeKey)
      })
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubjects([])
  }
  const handleSubjectSelect = (subject: string) => {
    if (subject && !selectedSubjects.includes(subject)) {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }
  const removeSubject = (subjectToRemove: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectToRemove))
  }

  const availableSubjects =
    selectedCategory === 'All'
      ? Object.values(SUBJECT_MAPPING).flat()
      : SUBJECT_MAPPING[selectedCategory]

  const filteredApplications = applications.filter((app) => {
    let searchMatch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      searchMatch =
        app.student_name.toLowerCase().includes(q) ||
        app.roll_number.toLowerCase().includes(q)
    }

    let batchMatch = true
    if (selectedBatch !== 'All') {
      batchMatch = app.roll_number.startsWith(`CSE${selectedBatch}`)
    }

    let categoryMatch = true
    if (selectedCategory !== 'All') {
      const categoryCodes = SUBJECT_MAPPING[selectedCategory].map((s) => s.split(' - ')[0])
      if (!app.selected_subjects || !Array.isArray(app.selected_subjects)) {
        categoryMatch = false
      } else {
        categoryMatch = app.selected_subjects.some((subjObj) => {
          const { name } = parseSubject(subjObj)
          return categoryCodes.some((code) => String(name).includes(code))
        })
      }
    }

    let subjectMatch = true
    if (selectedSubjects.length > 0) {
      if (!app.selected_subjects || !Array.isArray(app.selected_subjects)) {
        subjectMatch = false
      } else {
        subjectMatch = selectedSubjects.some((filterSubject) => {
          const filterCode = filterSubject.split(' - ')[0]
          return app.selected_subjects?.some((subjObj) => {
            const { name } = parseSubject(subjObj)
            return String(name).includes(filterCode)
          })
        })
      }
    }

    return searchMatch && batchMatch && categoryMatch && subjectMatch
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortConfig.key === 'grade') {
      const GRADE_VALUES: Record<string, number> = {
        'O': 10,
        'A+': 9.5,
        'A': 9,
        'B+': 8,
        'B': 7,
        'C': 6,
        'P': 5,
        'F': 0,
        '0': 0,
        '-': -1,
      }
      const getGradeScore = (grade: string) => {
        const trimmedGrade = grade.trim().toUpperCase()
        if (trimmedGrade === '' || trimmedGrade === '0') return 0
        return GRADE_VALUES[trimmedGrade] ?? -1
      }

      const getGradeForSorting = (app: Application): number => {
        if (!app.selected_subjects || !Array.isArray(app.selected_subjects) || app.selected_subjects.length === 0) {
          return -1
        }

        if (selectedSubjects.length > 0) {
          for (const filterSubject of selectedSubjects) {
            const filterCode = filterSubject.split(' - ')[0]
            for (const subj of app.selected_subjects) {
              const { name, grade } = parseSubject(subj)
              if (String(name).includes(filterCode)) {
                return getGradeScore(grade)
              }
            }
          }
        }

        const selectedSubjectsWithTimestamps = Array.from(optimisticSelections)
          .filter((s) => s.startsWith(`${app.id}::`))
          .map((s) => {
            const selData = selectionData[s]
            const localTimestamp = localSelectionTimestamps[s]
            let timestamp: number = 0
            
            if (localTimestamp) {
              timestamp = localTimestamp
            } else if (selData?.created_at) {
              timestamp = new Date(selData.created_at).getTime()
            }
            
            return { subject: s.split('::')[1], timestamp, key: s }
          })
          .filter((item) => item.timestamp > 0)
          .sort((a, b) => b.timestamp - a.timestamp)

        if (selectedSubjectsWithTimestamps.length > 0) {
          const mostRecentSubject = selectedSubjectsWithTimestamps[0].subject
          for (const subj of app.selected_subjects) {
            const { name, grade } = parseSubject(subj)
            if (name === mostRecentSubject) {
              return getGradeScore(grade)
            }
          }
        }

        const subjectsWithPriority = app.selected_subjects
          .map((s) => {
            const { priority, grade } = parseSubject(s)
            const priorityNum = priority !== '-' ? parseInt(priority, 10) : Infinity
            return { priority: isNaN(priorityNum) ? Infinity : priorityNum, grade, gradeScore: getGradeScore(grade) }
          })
          .filter((s) => s.priority !== Infinity)
        
        if (subjectsWithPriority.length > 0) {
          const minPriority = Math.min(...subjectsWithPriority.map((s) => s.priority))
          const priorityOneSubject = subjectsWithPriority.find((s) => s.priority === minPriority)
          if (priorityOneSubject) {
            return priorityOneSubject.gradeScore
          }
        }

        const allGrades = app.selected_subjects.map((s) => getGradeScore(parseSubject(s).grade))
        return Math.max(...allGrades)
      }

      const gradeA = getGradeForSorting(a)
      const gradeB = getGradeForSorting(b)
      return sortConfig.direction === 'desc' ? gradeB - gradeA : gradeA - gradeB
    }
    if (sortConfig.key === 'roll_number') {
      return sortConfig.direction === 'asc'
        ? a.roll_number.localeCompare(b.roll_number)
        : b.roll_number.localeCompare(a.roll_number)
    }
    return sortConfig.direction === 'asc'
      ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by Student Name or Roll Number..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col xl:flex-row gap-4 justify-between items-start pb-8 overflow-x-auto">
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-start">
          <div className="w-full md:w-48 relative">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Filter by Batch
            </label>
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value)
                  setIsBatchSelectOpen(false)
                }}
                onMouseDown={() => setIsBatchSelectOpen(!isBatchSelectOpen)}
                onBlur={() => setIsBatchSelectOpen(false)}
                className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                {BATCH_MAPPING.map((batch) => (
                  <option key={batch.value} value={batch.value}>
                    {batch.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                {isBatchSelectOpen ? (
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-48 relative">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Filter by Course Year
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  handleCategoryChange(e.target.value)
                  setIsCategorySelectOpen(false)
                }}
                onMouseDown={() => setIsCategorySelectOpen(!isCategorySelectOpen)}
                onBlur={() => setIsCategorySelectOpen(false)}
                className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="All">All Years</option>
                {Object.keys(SUBJECT_MAPPING).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                {isCategorySelectOpen ? (
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto relative">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Filter by Course
            </label>
            <div ref={subjectDropdownRef} className="relative inline-block w-full md:w-auto max-w-full">
              <button
                type="button"
                onClick={() => setIsSubjectSelectOpen(!isSubjectSelectOpen)}
                className="flex items-center justify-between w-full min-w-[200px] md:min-w-[280px] max-w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-left overflow-hidden"
              >
                <span className={selectedSubjects.length > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                  {selectedSubjects.length > 0 ? selectedSubjects.join(', ') : 'Filter by course'}
                </span>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  {isSubjectSelectOpen ? (
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>
              {isSubjectSelectOpen && (
                <div className="absolute z-50 w-full min-w-[200px] md:min-w-[280px] max-w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {availableSubjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => {
                        if (!selectedSubjects.includes(subject)) {
                          handleSubjectSelect(subject)
                        }
                        setIsSubjectSelectOpen(false)
                      }}
                      disabled={selectedSubjects.includes(subject)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        selectedSubjects.includes(subject)
                          ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4 items-end flex-shrink-0 min-w-0">
          <div className="w-full sm:w-48 relative flex-shrink-0">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Sort By
            </label>
            <div className="relative">
              <select
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split('-')
                  setSortConfig({ key, direction })
                  setIsSortSelectOpen(false)
                }}
                onMouseDown={() => setIsSortSelectOpen(!isSortSelectOpen)}
                onBlur={() => setIsSortSelectOpen(false)}
                className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="grade-desc">Highest Grade First</option>
                <option value="grade-asc">Lowest Grade First</option>
                <option value="roll_number-asc">Roll Number (Asc)</option>
                <option value="roll_number-desc">Roll Number (Desc)</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                {isSortSelectOpen ? (
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto flex-shrink-0 min-w-0 max-w-full">
            {isShortlistedPage ? (
              <DownloadShortlistedCSVButton 
                applications={sortedApplications}
                selections={context?.selections || initialSelections}
                selectionData={selectionData}
              />
            ) : (
              <DownloadCSVButton 
                applications={sortedApplications} 
                selections={propApplications ? (context?.selections || initialSelections) : undefined}
                selectionData={propApplications ? selectionData : undefined}
              />
            )}
          </div>
        </div>
      </div>

      {selectedSubjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
            >
              {subject}
              <button
                onClick={() => removeSubject(subject)}
                className="ml-2 hover:text-blue-900 dark:hover:text-blue-100 font-bold"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={() => setSelectedSubjects([])}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse min-w-[1200px]">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 min-w-[150px] text-center align-middle">Student Name</th>
              <th className="px-4 py-3 min-w/[100px] text-center align-middle">Roll No</th>
              <th className="px-4 py-3 min-w-[120px] text-center align-middle">Email</th>
              <th className="px-4 py-3 min-w/[210px] text-center align-middle">Subject</th>
              <th className="px-4 py-3 w-16 text-center align-middle">Pref</th>
              <th className="px-4 py-3 w-20 text-center align-middle">Grade</th>
              <th className="px-4 py-3 min-w-[400px] text-center align-middle">Reason</th>
              <th className="px-4 py-3 min-w-[400px] text-center align-middle">Internship</th>
            </tr>
          </thead>
          {sortedApplications.length > 0 ? (
            sortedApplications.map((app) => {
              const subjects =
                Array.isArray(app.selected_subjects) && app.selected_subjects.length > 0
                  ? app.selected_subjects
                  : [null]
              const rowSpan = subjects.length

              return (
                <tbody key={app.id} className="group border-b border-gray-200 dark:border-gray-700 last:border-0">
                  {subjects.map((subj, index) => {
                    const { name, grade, priority } = parseSubject(subj)
                    const isFirst = index === 0
                    const compositeKey = `${app.id}::${name}`
                    const isSelected = optimisticSelections.has(compositeKey)
                    const rowExpansion = getRowExpansion(app.id)
                    const rowSync = getRowSync(app.id)

                    return (
                      <tr
                        key={`${app.id}-${index}`}
                        className="bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 transition-colors"
                      >
                        {isFirst && (
                          <>
                            <th
                              rowSpan={rowSpan}
                              scope="row"
                              className="px-4 py-5 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 align-middle whitespace-nowrap text-center"
                            >
                              {app.student_name}
                            </th>
                            <td
                              rowSpan={rowSpan}
                              className="px-4 py-5 border-r border-gray-200 dark:border-gray-700 align-middle whitespace-nowrap font-mono text-sm text-center"
                            >
                              {app.roll_number}
                            </td>
                            <td
                              rowSpan={rowSpan}
                              className="px-4 py-5 border-r border-gray-200 dark:border-gray-700 align-middle break-words max-w-[120px] text-center"
                            >
                              {app.email}
                            </td>
                          </>
                        )}

                        <td className="px-4 py-5 border-r border-gray-200 dark:border-gray-700 align-middle font-medium text-gray-800 dark:text-gray-200 break-words max-w-[210px] text-center">
                          <div className="flex items-center justify-start gap-2">
                            <button
                              onClick={() => handleToggle(app.id, name)}
                              disabled={loadingSelections.has(compositeKey)}
                              className={`text-lg leading-none focus:outline-none transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-wait ${isSelected ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300 hover:text-gray-400'}`}
                              title={loadingSelections.has(compositeKey) ? 'Saving...' : isSelected ? 'Unselect' : 'Select'}
                            >
                              {loadingSelections.has(compositeKey) ? (
                                <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                '★'
                              )}
                            </button>
                            <span className="flex-1 text-center">{name}</span>
                          </div>
                        </td>

                        <td className="px-4 py-5 border-r border-gray-200 dark:border-gray-700 align-middle text-center font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {priority}
                        </td>

                        <td className="px-4 py-5 border-r border-gray-200 dark:border-gray-700 align-middle text-center font-mono font-bold text-sm">
                          {grade}
                        </td>

                        {isFirst && (
                          <>
                            <td
                              rowSpan={rowSpan}
                              className="px-4 py-5 border-r border-gray-200 dark:border-gray-700 align-middle text-sm leading-6 whitespace-pre-wrap break-words max-w-[400px] text-center text-gray-700 dark:text-gray-300"
                            >
                              <ReadMoreText
                                text={app.reason}
                                isExpanded={rowExpansion.reason}
                                onToggle={(next) => handleRowToggle(app.id, 'reason', next)}
                                syncedClampHeight={
                                  !rowExpansion.reason && rowSync.controller === 'internship'
                                    ? rowSync.height
                                    : undefined
                                }
                                onHeightChange={handleHeightChange(app.id, 'reason')}
                              />
                            </td>
                            <td
                              rowSpan={rowSpan}
                              className="px-4 py-5 border-r border-gray-200 dark:border-gray-700 align-middle text-sm leading-6 whitespace-pre-wrap break-words max-w-[400px] text-center text-gray-700 dark:text-gray-300"
                            >
                              <ReadMoreText
                                text={app.internship}
                                isExpanded={rowExpansion.internship}
                                onToggle={(next) => handleRowToggle(app.id, 'internship', next)}
                                syncedClampHeight={
                                  !rowExpansion.internship && rowSync.controller === 'reason'
                                    ? rowSync.height
                                    : undefined
                                }
                                onHeightChange={handleHeightChange(app.id, 'internship')}
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              )
            })
          ) : (
            <tbody>
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No applications found matching your filters.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  )
}

