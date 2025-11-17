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



    // Call the Server Action

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

    <div className="max-w-md">

      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Change Password</h3>

      {msg && (

        <div className={`p-3 rounded text-sm mb-4 ${msg.type==='success'?'bg-green-900 text-green-200':'bg-red-900 text-red-200'}`}>

          {msg.text}

        </div>

      )}

      <form onSubmit={handle} className="space-y-4">

        <div>

          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">New Password</label>

          <input 

            type="password" 

            placeholder="Enter new password" 

            required 

            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 

            value={newPass} 

            onChange={e=>setNewPass(e.target.value)} 

          />

        </div>

        <button 

          type="submit" 

          disabled={loading} 

          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"

        >

          {loading ? 'Updating...' : 'Update Password'}

        </button>

      </form>

    </div>

  )

}
