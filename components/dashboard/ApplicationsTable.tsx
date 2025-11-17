'use client'



import { useState, useOptimistic, startTransition } from 'react'

import { toggleSelection } from '@/app/actions/toggleSelection'



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

  if (!subj) return { name: 'Unknown', grade: '-' }

  if (typeof subj === 'string') return { name: subj, grade: '-' }

  const name = subj.name || subj.subject || subj.code || subj.title || JSON.stringify(subj)

  const grade = subj.grade || subj.mark || subj.score || '-'

  return { name, grade }

}



const SUBJECT_MAPPING: Record<string, string[]> = {

  'First Year': ['23CSE111', '23CSE113'],

  'Second Year': ['23CSE211', '23CSE212', '23CSE213', '23CSE214'],

  'Third Year': ['23CSE311', '23CSE312', '23CSE313', '23CSE314'],

  'Third Year Free Electives': ['23CSE475', '23CSE461', '23CSE465', '23CSE363', '23CSE473', '23CSE452', '23CSE334', '23CSE365']

}



export default function ApplicationsTable({ applications, initialSelections = new Set() }: { applications: Application[], initialSelections?: Set<string> }) {

  const [selectedCategory, setSelectedCategory] = useState('All')

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' })

  

  const [optimisticSelections, addOptimisticSelection] = useOptimistic(

    initialSelections,

    (state, id: string) => {

      const newState = new Set(state)

      if (newState.has(id)) newState.delete(id)

      else newState.add(id)

      return newState

    }

  )



  const handleToggle = async (id: string) => {

    startTransition(() => {

      addOptimisticSelection(id)

    })

    await toggleSelection(id)

  }



  const handleCategoryChange = (category: string) => { setSelectedCategory(category); setSelectedSubjects([]) }

  const handleSubjectSelect = (subject: string) => { if (subject && !selectedSubjects.includes(subject)) setSelectedSubjects([...selectedSubjects, subject]) }

  const removeSubject = (subjectToRemove: string) => { setSelectedSubjects(selectedSubjects.filter(s => s !== subjectToRemove)) }



  const availableSubjects = selectedCategory === 'All' ? Object.values(SUBJECT_MAPPING).flat() : SUBJECT_MAPPING[selectedCategory]



  const filteredApplications = applications.filter((app) => {

    let categoryMatch = true

    if (selectedCategory !== 'All') {

      const categoryCodes = SUBJECT_MAPPING[selectedCategory].map(s => s.split(' - ')[0])

      if (!app.selected_subjects || !Array.isArray(app.selected_subjects)) {

        categoryMatch = false

      } else {

        categoryMatch = app.selected_subjects.some(subjObj => {

          const { name } = parseSubject(subjObj)

          return categoryCodes.some(code => String(name).includes(code))

        })

      }

    }



    let subjectMatch = true

    if (selectedSubjects.length > 0) {

      if (!app.selected_subjects || !Array.isArray(app.selected_subjects)) {

        subjectMatch = false

      } else {

        subjectMatch = selectedSubjects.some(filterSubject => {

          const filterCode = filterSubject.split(' - ')[0]

          return app.selected_subjects?.some(subjObj => {

             const { name } = parseSubject(subjObj)

             return String(name).includes(filterCode)

          })

        })

      }

    }

    return categoryMatch && subjectMatch

  })



  const sortedApplications = [...filteredApplications].sort((a, b) => {

    if (sortConfig.key === 'grade') {

      const GRADE_VALUES: Record<string, number> = { 'O': 10, 'A+': 9.5, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'P': 5, 'F': 0, '-': -1 }

      const getGradeScore = (grade: string) => GRADE_VALUES[grade.trim().toUpperCase()] ?? -1

      

      const maxGradeA = Array.isArray(a.selected_subjects) ? Math.max(...a.selected_subjects.map(s => getGradeScore(parseSubject(s).grade))) : -1

      const maxGradeB = Array.isArray(b.selected_subjects) ? Math.max(...b.selected_subjects.map(s => getGradeScore(parseSubject(s).grade))) : -1



      return sortConfig.direction === 'desc' ? maxGradeB - maxGradeA : maxGradeA - maxGradeB

    }

    

    if (sortConfig.key === 'roll_number') {

      return sortConfig.direction === 'asc' ? a.roll_number.localeCompare(b.roll_number) : b.roll_number.localeCompare(a.roll_number)

    }



    return sortConfig.direction === 'asc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

  })



  return (

    <div className="space-y-6">

      {/* --- Controls --- */}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex flex-col xl:flex-row gap-4 justify-between items-start">

        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">

          <div className="w-full md:w-64">

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Filter by Year</label>

            <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500">

              <option value="All">All Years</option>

              {Object.keys(SUBJECT_MAPPING).map((category) => <option key={category} value={category}>{category}</option>)}

            </select>

          </div>

          <div className="w-full md:w-80">

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Add Subject Filter</label>

            <select value="" onChange={(e) => handleSubjectSelect(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500">

              <option value="" disabled>Select subjects...</option>

              {availableSubjects.map((subject) => <option key={subject} value={subject} disabled={selectedSubjects.includes(subject)}>{subject}</option>)}

            </select>

          </div>

        </div>

        <div className="w-full md:w-48">

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sort By</label>

            <select value={`${sortConfig.key}-${sortConfig.direction}`} onChange={(e) => { const [key, direction] = e.target.value.split('-'); setSortConfig({ key, direction }) }} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500">

              <option value="created_at-desc">Newest First</option>

              <option value="created_at-asc">Oldest First</option>

              <option value="grade-desc">Highest Grade First</option>

              <option value="grade-asc">Lowest Grade First</option>

              <option value="roll_number-asc">Roll Number (Asc)</option>

              <option value="roll_number-desc">Roll Number (Desc)</option>

            </select>

        </div>

      </div>



      {selectedSubjects.length > 0 && (

        <div className="flex flex-wrap gap-2">

          {selectedSubjects.map(subject => (

            <span key={subject} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">

              {subject} <button onClick={() => removeSubject(subject)} className="ml-2 hover:text-blue-900 dark:hover:text-blue-100 font-bold">×</button>

            </span>

          ))}

          <button onClick={() => setSelectedSubjects([])} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline">Clear all</button>

        </div>

      )}



      {/* --- Table --- */}

      <div className="overflow-x-auto rounded-lg shadow-md border dark:border-gray-700">

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse min-w-[1200px]">

          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 border-b dark:border-gray-600">

            <tr>

              <th className="px-4 py-3 text-center w-12 align-middle">★</th>

              <th className="px-4 py-3 min-w-[150px] text-center align-middle">Student Name</th>

              <th className="px-4 py-3 min-w-[100px] text-center align-middle">Roll No</th>

              <th className="px-4 py-3 min-w-[200px] text-center align-middle">Email</th>

              <th className="px-4 py-3 min-w-[200px] text-center align-middle">Subject</th>

              <th className="px-4 py-3 w-20 text-center align-middle">Grade</th>

              <th className="px-4 py-3 min-w-[300px] text-center align-middle">Reason</th>

              <th className="px-4 py-3 min-w-[250px] text-center align-middle">Internship</th>

              <th className="px-4 py-3 min-w-[100px] text-center align-middle">Submitted</th>

            </tr>

          </thead>

          <tbody>

            {sortedApplications.length > 0 ? (

              sortedApplications.map((app) => {

                const subjects = Array.isArray(app.selected_subjects) && app.selected_subjects.length > 0 ? app.selected_subjects : [null];

                const rowSpan = subjects.length;

                const isSelected = optimisticSelections.has(app.id)



                return subjects.map((subj, index) => {

                  const { name, grade } = parseSubject(subj);

                  const isFirst = index === 0;

                  const rowClass = "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b dark:border-gray-700 text-sm"



                  return (

                    <tr key={`${app.id}-${index}`} className={rowClass}>

                      {isFirst && (

                        <>

                          <td rowSpan={rowSpan} className="px-4 py-5 text-center border-r dark:border-gray-700 align-middle">

                            <button 

                              onClick={() => handleToggle(app.id)} 

                              className={`text-lg leading-none focus:outline-none transition-transform active:scale-90 mt-0.5 ${isSelected ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300 hover:text-gray-400'}`}

                              title={isSelected ? "Unselect" : "Select"}

                            >

                              ★

                            </button>

                          </td>

                          <th rowSpan={rowSpan} scope="row" className="px-4 py-5 font-semibold text-gray-900 dark:text-white border-r dark:border-gray-700 align-middle whitespace-nowrap text-center">

                            {app.student_name}

                          </th>

                          <td rowSpan={rowSpan} className="px-4 py-5 border-r dark:border-gray-700 align-middle whitespace-nowrap font-mono text-sm text-center">

                            {app.roll_number}

                          </td>

                          <td rowSpan={rowSpan} className="px-4 py-5 border-r dark:border-gray-700 align-middle break-words max-w-[200px] text-center">

                            {app.email}

                          </td>

                        </>

                      )}

                      

                      <td className="px-4 py-5 border-r dark:border-gray-700 align-middle font-medium text-gray-800 dark:text-gray-200 break-words max-w-[200px] text-center">

                        {name}

                      </td>

                      <td className="px-4 py-5 border-r dark:border-gray-700 align-middle text-center font-mono font-bold text-sm">

                        {grade}

                      </td>



                      {isFirst && (

                        <>

                          {/* CENTERED REASON & INTERNSHIP */}

                          <td rowSpan={rowSpan} className="px-4 py-5 border-r dark:border-gray-700 align-middle text-sm leading-6 whitespace-pre-wrap break-words max-w-[300px] text-center text-gray-700 dark:text-gray-300">

                            {app.reason || <span className="text-gray-400 italic">None provided</span>}

                          </td>

                          <td rowSpan={rowSpan} className="px-4 py-5 border-r dark:border-gray-700 align-middle text-sm leading-6 whitespace-pre-wrap break-words max-w-[250px] text-center text-gray-700 dark:text-gray-300">

                            {app.internship || <span className="text-gray-400 italic">None provided</span>}

                          </td>

                          

                          <td rowSpan={rowSpan} className="px-4 py-5 align-middle text-xs whitespace-nowrap text-gray-500 text-center">

                            {new Date(app.created_at).toLocaleDateString()}

                          </td>

                        </>

                      )}

                    </tr>

                  )

                })

              })

            ) : (

              <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No applications found matching your filters.</td></tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  )

}
