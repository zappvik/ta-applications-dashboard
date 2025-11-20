'use client'

import { useMemo } from 'react'

type Application = {
  id: string
  student_name: string
  roll_number: string
  email: string
}

type SelectionData = {
  subject: string
  created_at: string
}

const generateShortlistedCSV = (
  applications: Application[],
  selections: Set<string>,
  selectionData: Record<string, SelectionData>
): string => {
  const headers = ['Name', 'Roll Number', 'Email', 'Subjects']

  const rows: string[][] = []

  applications.forEach(app => {
    const appSelections = Array.from(selections)
      .filter(s => s.startsWith(`${app.id}::`))
      .map(s => {
        const data = selectionData[s]
        return data ? data.subject : s.split('::')[1]
      })

    if (appSelections.length > 0) {
      const subjectsList = appSelections.join(', ')
      rows.push([
        app.student_name || '',
        app.roll_number || '',
        app.email || '',
        subjectsList
      ])
    }
  })

  const csvRows = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ]

  return csvRows.join('\n')
}

export default function DownloadShortlistedCSVButton({ 
  applications, 
  selections,
  selectionData,
  filename = 'shortlisted_students.csv'
}: { 
  applications: Application[]
  selections: Set<string>
  selectionData: Record<string, SelectionData>
  filename?: string 
}) {
  const csvContent = useMemo(() => {
    if (!selections || !selectionData) return ''
    return generateShortlistedCSV(applications, selections, selectionData)
  }, [applications, selections, selectionData])

  const handleDownload = () => {
    if (csvContent === '') return

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

  const totalEntries = useMemo(() => {
    if (!selections) return 0
    const studentIds = new Set(
      Array.from(selections)
        .filter(s => {
          const appId = s.split('::')[0]
          return applications.some(app => app.id === appId)
        })
        .map(s => s.split('::')[0])
    )
    return studentIds.size
  }, [applications, selections])

  return (
    <button
      onClick={handleDownload}
      disabled={totalEntries === 0}
      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Download CSV ({totalEntries})
    </button>
  )
}

