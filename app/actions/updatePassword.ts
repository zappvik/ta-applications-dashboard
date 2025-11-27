'use server'



import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { createClient } from '@supabase/supabase-js'



// Password validation
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' }
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' }
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' }
  }
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  if (!hasLetter || !hasNumber) {
    return { valid: false, error: 'Password must contain at least one letter and one number' }
  }
  
  // Prevent common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123']
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    return { valid: false, error: 'Password is too common. Please choose a stronger password.' }
  }
  
  return { valid: true }
}

export async function updatePassword(password: string) {

  const session = await getServerSession(authOptions)

  

  if (!session || !session.user || !(session.user as any).id) {

    return { error: 'You must be logged in to change your password.' }

  }

  // Validate password
  const validation = validatePassword(password)
  if (!validation.valid) {
    return { error: validation.error || 'Invalid password' }
  }



  const userId = (session.user as any).id



  const supabaseAdmin = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    { auth: { persistSession: false } }

  )



  const { error } = await supabaseAdmin.auth.admin.updateUserById(

    userId,

    { password: password }

  )



  if (error) {

    return { error: error.message }

  }



  return { success: true }

}

