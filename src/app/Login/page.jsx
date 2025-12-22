'use client'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null) 

  const router = useRouter()

 const handleSubmit = async () => {
    setError(null) 

    if (!email || !password) {
      alert('Please fill in both email and password.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/sign_in`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user: {
            email: email,
            password: password
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const token = response.headers.get('Authorization')

        if (token) {
          localStorage.setItem('token', token)
          console.log('✅ Token saved:', token)
        }

        localStorage.setItem('userData', JSON.stringify(data.user))
        router.push('/Dashboard')
      } else {
        setError(data.error || 'Login failed. Invalid credentials.')
      }

    } catch (err) {
      console.error('Login error:', err)
      setError('Backend server (3001) se connect nahi ho pa raha.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-8'>
      <div className='w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex'>
        <div
          style={{ backgroundColor: 'rgb(187 181 237)', color: '#1a1a1a' }}
          className='w-2/5 p-12 flex flex-col justify-center items-start relative'
        >
          <h2 className='text-3xl font-bold mb-4'>Smart Marketing</h2>
          <p className='text-sm leading-relaxed mb-8'>
            Apne account mein login karein aur dashboard access karein.
          </p>
        </div>
        
        <div className='w-3/5 p-12 flex flex-col justify-center'>
          <h1 className='text-2xl font-semibold text-gray-700 mb-8'>Welcome</h1>

          {error && (
            <div className='p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg' role='alert'>
              {error}
            </div>
          )}

          <div className='mb-4'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-gray-300 rounded-md py-2.5 px-4'
              placeholder='Email Address'
            />
          </div>

          <div className='relative mb-4'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border border-gray-300 rounded-md py-2.5 px-4 pr-10'
              placeholder='Password'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            >
              {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>

          <div className='flex items-center mb-6'>
            <input
              type='checkbox'
              id='rememberMe'
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className='w-4 h-4 text-blue-600 border-gray-300 rounded'
            />
            <label htmlFor='rememberMe' className='ml-2 text-sm text-gray-600'>
              Remember Me
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ backgroundColor: 'rgb(187 181 237)', color: '#1a1a1a' }}
            className='w-full rounded-full py-2.5 font-medium disabled:opacity-50'
          >
            {isLoading ? (
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto'></div>
            ) : (
              'Login'
            )}
          </button>

          <p className='text-center text-gray-600 text-sm mt-8'>
            Don't have an account?{' '}
            <Link href='/SignUp' className='text-purple-600 font-semibold'>
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}