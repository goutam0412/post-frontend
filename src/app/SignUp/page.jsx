'use client'
import { useState } from 'react'
import { Eye, EyeOff, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async () => {
    if (!agreeTerms) {
      alert('You must agree to the terms and conditions.')
      return
    }
  
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.')
      return
    }
  
    setIsLoading(true)
  
    try {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
          },
        }),
      })
  
      const data = await res.json()
  
        if (res.ok) {
      const token = res.headers.get('Authorization') || data.token
      localStorage.setItem('authToken', token)
      
      router.push('/Dashboard')
    }
  
      console.log('User created:', data)
  
      router.push('/Dashboard')
    } catch (error) {
      console.error('Signup error:', error)
      alert('Something went wrong. Please try again.')
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
          <h2 className='text-3xl font-bold mb-4'>Smart Marketing</h2>
          <p className='text-sm leading-relaxed mb-8'>
            Neque porro quisquam est qui dolorem
            <br />
            ipsum quia dolor sit amet, consectetur,
            <br />              
            adipisci velit...
          </p>
        </div>

        <div className='w-3/5 p-12 flex flex-col justify-center'>
          <h1 className='text-2xl font-semibold text-gray-700 mb-8'>
            Create Account
          </h1>

          <div className='mb-4'>
            <input
              type='text'
              name='fullName'
              value={formData.fullName}
              style={{borderColor: '#bbb5ed'}}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Full Name'
            />
          </div>

          <div className='mb-4'>
            <input
              type='email'
              name='email'
              value={formData.email}
              style={{borderColor: '#bbb5ed'}}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Email'
            />
          </div>

          <div className='relative mb-4'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={formData.password}
              onChange={handleChange}
              style={{borderColor: '#bbb5ed'}}
              className='w-full border border-gray-300 rounded-md py-2.5 px-4 pr-10 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Password'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              {showPassword ? (
                <EyeOff className='w-5 h-5' />
              ) : (
                <Eye className='w-5 h-5' />
              )}
            </button>
          </div>

          <div className='relative mb-4'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{borderColor: '#bbb5ed'}}
              className='w-full border border-gray-300 rounded-md py-2.5 px-4 pr-10 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Confirm Password'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              {showConfirmPassword ? (
                <EyeOff className='w-5 h-5' />
              ) : (
                <Eye className='w-5 h-5' />
              )}
            </button>
          </div>

          <div className='flex items-center mb-6'>
            <input
              type='checkbox'
              id='agreeTerms'
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <label htmlFor='agreeTerms' className='ml-2 text-sm text-gray-600'>
              I agree to Terms & Conditions
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
              className='flex-1 text-white rounded-full py-2.5 font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto'></div>
              ) : (
                'Sign up'
              )}
            </button>

            {/* <button
              onClick={() => router.push('/Login')}
              style={{ borderColor: 'black', color: 'black' }}
              className='flex-1 bg-white border-2 rounded-full py-2.5 font-medium hover:bg-blue-50 transition-colors duration-200'
            >
              Login
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
