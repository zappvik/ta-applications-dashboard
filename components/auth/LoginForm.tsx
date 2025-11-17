'use client'



import { useState } from 'react'

import { signIn } from 'next-auth/react'

import { useRouter } from 'next/navigation'



export default function LoginForm() {

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const router = useRouter()



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault()

    setError('')



    try {

      const result = await signIn('credentials', {

        redirect: false,

        username,

        password,

      })



      if (result?.error) {

        setError('Invalid username or password.')

        console.error(result.error)

      } else if (result?.ok) {

        router.push('/dashboard')

      }

    } catch (error) {

      console.error('Login failed:', error)

      setError('An unexpected error occurred. Please try again.')

    }

  }



  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">

      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">

        <h1 className="text-2xl font-bold text-center">

          Winter TA applications dashboard

        </h1>



        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (

            <div className="p-3 bg-red-800 text-white rounded-md text-center text-sm">

              {error}

            </div>

          )}



          <div>

            <label htmlFor="username" className="block text-sm font-medium text-gray-300">

              Username

            </label>

            <input

              type="text"

              id="username"

              name="username"

              required

              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"

              value={username}

              onChange={(e) => setUsername(e.target.value)}

            />

          </div>



          <div>

            <label htmlFor="password" className="block text-sm font-medium text-gray-300">

              Password

            </label>

            <input

              type="password"

              id="password"

              name="password"

              required

              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"

              value={password}

              onChange={(e) => setPassword(e.target.value)}

            />

          </div>



          <button

            type="submit"

            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"

          >

            Login

          </button>

        </form>

      </div>

    </div>

  )

}
