'use client'



import { useMemo } from 'react'



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

type SelectionData = {
  subject: string
  created_at: string
}



const parseSubject = (subj: any) => {

  if (!subj) return 'Unknown'

  if (typeof subj === 'string') return subj

  return subj.name || subj.subject || subj.code || subj.title || JSON.stringify(subj)

}



const formatSubjects = (subjects: any[] | null): string => {

  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) return 'None'

  return subjects.map(parseSubject).join(', ')

}



const generateCSV = (
  applications: Application[],
  selections?: Set<string>,
  selectionData?: Record<string, SelectionData>
): string => {
  const includeShortlistedSubjects = selections !== undefined && selectionData !== undefined

  const headers = includeShortlistedSubjects
    ? ['Student Name', 'Roll Number', 'Email', 'Shortlisted Subject(s)', 'Subjects', 'Reason', 'Internship', 'Submitted Date']
    : ['Student Name', 'Roll Number', 'Email', 'Subjects', 'Reason', 'Internship', 'Submitted Date']

  const rows = applications.map(app => {
    let shortlistedSubjects = ''
    if (includeShortlistedSubjects && selections && selectionData) {
      const appSelections = Array.from(selections)
        .filter(s => s.startsWith(`${app.id}::`))
        .map(s => {
          const data = selectionData[s]
          return data ? data.subject : s.split('::')[1]
        })
      shortlistedSubjects = appSelections.length > 0 ? appSelections.join(', ') : 'Not shortlisted'
    }

    const baseRow = [
      app.student_name || '',
      app.roll_number || '',
      app.email || '',
    ]

    if (includeShortlistedSubjects) {
      baseRow.push(shortlistedSubjects)
    }

    baseRow.push(
      formatSubjects(app.selected_subjects),
      (app.reason || '').replace(/"/g, '""'),
      (app.internship || '').replace(/"/g, '""'),
      new Date(app.created_at).toLocaleDateString()
    )

    return baseRow
  })

  const csvRows = [

    headers.map(h => `"${h}"`).join(','),

    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))

  ]

  return csvRows.join('\n')

}



export default function DownloadCSVButton({ 

  applications, 

  filename = 'applications_list.csv',
  selections,
  selectionData

}: { 

  applications: Application[], 

  filename?: string,
  selections?: Set<string>,
  selectionData?: Record<string, SelectionData>

}) {

  const csvContent = useMemo(() => generateCSV(applications, selections, selectionData), [applications, selections, selectionData])



  const handleDownload = () => {

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    const link = document.createElement('a')

    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)

    link.setAttribute('download', filename)

    link.style.visibility = 'hidden'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

  }



  return (

    <button

      onClick={handleDownload}

      disabled={applications.length === 0}

      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

    >

      Download CSV ({applications.length})

    </button>

  )

}

