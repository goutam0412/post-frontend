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

    
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
      if (email === 'test@example.com' && password === 'password') {
        const fakeToken = 'static_dummy_auth_token_1234567890'
        const fakeData = { user: { id: 1, email: email } }

        console.log('Login successful (Static Simulation):', fakeData)
        
        // Token store karna (jo Posts component mein zaroori hai)
        localStorage.setItem('token', fakeToken)
        console.log('✅ Static Token saved:', fakeToken)
        
        // User ko Dashboard par bhej do
        router.push('/Dashboard')

      } else {
        // Failed Login Simulation
        const errorMessage = 'Invalid static credentials. Try test@example.com / password.'
        setError(errorMessage)
        alert(errorMessage)
      }

    } catch (error) {
      console.error('Login error (Static):', error)
      setError('Login failed (Static Error). Please check console.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-8'>
      <div className='w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex'>
        <div
          style={{
            backgroundColor: 'rgb(187 181 237)',
            color: '#1a1a1a',
          }}
          className='w-2/5 p-12 flex flex-col justify-center items-start relative'
        >
          <h2 className='text-3xl font-bold mb-4'>Smart Marketing (Static Mode)</h2>
          <p className='text-sm leading-relaxed mb-8'>
            **Note:** This page is running in static mode. Use **test@example.com** and **password** to login.
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
              placeholder='Email (e.g., test@example.com)'
            />
          </div>

          <div className='relative mb-4'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border border-gray-300 rounded-md py-2.5 px-4 pr-10'
              placeholder='Password (e.g., password)'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
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

          <div className='flex gap-3'>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                backgroundColor: 'rgb(187 181 237)',
                color: '#1a1a1a',
                cursor: 'pointer',
              }}
              className='flex-1 rounded-full py-2.5 font-medium transition-colors duration-200 disabled:opacity-50'
            >
              {isLoading ? (
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto'></div>
              ) : (
                'Login (Static)'
              )}
            </button>
          </div>

          <p className='text-center text-gray-600 text-sm mt-8'>
            Don't have an account?{' '}
            <Link
              href='/SignUp'
              className='text-purple-400 hover:text-purple-300 font-semibold transition-colors'
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 