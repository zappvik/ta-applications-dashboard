'use client'

import { useState } from 'react'



type Professor = { id: string; username: string | null; role: string; created_at: string }



export default function UsersTable({ users }: { users: Professor[] }) {

  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' })

  

  const sortedUsers = [...users].sort((a, b) => {

    if (sortConfig.key === 'username') return sortConfig.direction === 'asc' ? (a.username||'').localeCompare(b.username||'') : (b.username||'').localeCompare(a.username||'')

    if (sortConfig.key === 'role') return sortConfig.direction === 'asc' ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role)

    return sortConfig.direction === 'asc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

  })



  return (

    <div className="space-y-4">

      <div className="flex justify-end"><div className="w-48"><label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sort By</label><select value={`${sortConfig.key}-${sortConfig.direction}`} onChange={(e) => { const [key, direction] = e.target.value.split('-'); setSortConfig({ key, direction }) }} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="created_at-desc">Newest First</option><option value="created_at-asc">Oldest First</option><option value="username-asc">Username (A-Z)</option><option value="role-asc">Role (Admin/Prof)</option></select></div></div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-800">

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th className="px-6 py-3">Username</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">User ID</th><th className="px-6 py-3">Joined</th></tr></thead>

          <tbody>{sortedUsers.map((prof) => (<tr key={prof.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{prof.username || 'N/A'}</th><td className="px-6 py-4">{prof.role === 'admin' ? <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Admin</span> : <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Professor</span>}</td><td className="px-6 py-4 font-mono text-xs">{prof.id}</td><td className="px-6 py-4">{new Date(prof.created_at).toLocaleDateString()}</td></tr>))}</tbody>

        </table>

      </div>

    </div>

  )

}
