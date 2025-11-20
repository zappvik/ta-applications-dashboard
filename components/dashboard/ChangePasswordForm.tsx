'use client'



import { useState } from 'react'

import { updatePassword } from '@/app/actions/updatePassword'



export default function ChangePasswordForm() {

  const [newPass, setNewPass] = useState('')

  const [msg, setMsg] = useState<{text:string, type:'success'|'error'} | null>(null)

  const [loading, setLoading] = useState(false)



  const handle = async (e:React.FormEvent) => {

    e.preventDefault()

    setLoading(true)

    setMsg(null)



    if (newPass.length < 6) {

      setMsg({ text: 'Password must be at least 6 characters', type: 'error' })

      setLoading(false)

      return

    }



    const result = await updatePassword(newPass)



    if (result.error) {

      setMsg({ text: result.error, type: 'error' })

    } else {

      setMsg({ text: 'Password updated successfully!', type: 'success' })

      setNewPass('')

    }

    

    setLoading(false)

  }



  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Change Password
      </h2>

      {msg && (
        <div className={`p-3 rounded text-sm mb-4 ${msg.type==='success'?'bg-green-900 text-green-200':'bg-red-900 text-red-200'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handle} className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <input 
              type="password" 
              placeholder="Enter new password" 
              required 
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              style={{
                WebkitTextSecurity: 'disc',
              }}
              value={newPass} 
              onChange={e=>setNewPass(e.target.value)} 
            />
          </div>
        </div>

        <div className="mt-auto">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )

}
