'use client'
import React, { useState, useEffect } from 'react'
import {
  X,
  Send,
  ArrowRight,
  ChevronLeft,
  Calendar,
  DollarSign,
  Users,
  Image,
  Facebook,
  CheckCircle,
  Clock,
} from 'lucide-react'
import axios from 'axios'
import { DateRange } from 'react-date-range'
import { format } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const mockPosts = [
  {
    id: 1,
    title: 'Summer Product Launch',
    description: 'Check out our new summer collection.',
  },
  {
    id: 2,
    title: 'Team Achievement',
    description: 'Celebrating our team milestone.',
  },
  {
    id: 3,
    title: 'Q4 Strategy Review',
    description: 'Planning the next big move.',
  },
]

const STEPS = [
  { id: 1, name: 'Select Post', icon: Image },
  { id: 2, name: 'Budget & Schedule', icon: Calendar },
  { id: 3, name: 'Target Audience', icon: Users },
  { id: 4, name: 'Connect & Review', icon: Facebook },
]

const AVAILABLE_STATUSES = ['draft', 'active', 'completed']

const statusIcons = {
  draft: Clock,
  completed: Calendar,
  active: CheckCircle,
}

const FieldError = ({ errorMessage, show }) => {
  return (
    <div className='text-[red] font-semibold text-xs'>
      {show && <p className='error-text'>{errorMessage}</p>}
    </div>
  )
}

const CreateCampaignModal = ({
  showModal,
  onClose,
  onSave,
  campaignToEdit,
  campaignData,
  updateCampaign,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    campaignName: '',
    selectedPost: null,
    budget: 0,
    schedule: '',
    location: '',
    age: '',
    interests: '',
    facebookConnected: false,
    status: 'draft',
    businessProfileId: '',
  })
  const [errors, setErrors] = useState({})
  const [businessProfiles, setBusinessProfiles] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ])
  const [posts, setPosts] = useState([])

  const isEditMode = !!campaignData

  useEffect(() => {
    if (isEditMode && campaignData) {
      // const audienceParts = campaignToEdit.audience.split(", ");

      setFormData({
        campaignName: campaignData.title,
        selectedPost: { id: Date.now(), title: campaignData.postTitle },
        budget: campaignData.budget,
        schedule: campaignData.schedule,
        // location: audienceParts[0] || "",
        // age: audienceParts[1] || "",
        // interests: audienceParts[2] || "",
        facebookConnected: true,
        status: campaignData.status || 'Draft',
      })
      setCurrentStep(1)
    } else {
      setFormData({
        campaignName: '',
        selectedPost: null,
        budget: '0',
        schedule: '',
        location: '',
        age: '25',
        interests: '',
        facebookConnected: false,
        status: 'draft',
        businessProfileId: '',
      })
      setCurrentStep(1)
    }
  }, [campaignToEdit, isEditMode])

  useEffect(() => {
    fetchUserBusinessProfile()
    fetchPosts()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.date-picker-wrapper')) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!showModal) return null

  const fetchUserBusinessProfile = async () => {
    try {
      const userData = localStorage.getItem('userData')
      const parsedUser = userData ? JSON.parse(userData) : null;
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/business_profiles/${parsedUser.id}`
      )
      setBusinessProfiles([response.data.business_profile])
      setFormData((prev) => ({
        ...prev,
        businessProfileId: response.data.business_profile.id,
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`
      )
      if (!response.ok) throw new Error('Failed to get data!')

      const data = await response.json()
      const apiPosts = data.posts || data || []

      const formatted = apiPosts.map((item, index) => {
        return {
          id: item?.id,
          title: item?.title,
          description: item?.caption,
        }
      })

      setPosts(formatted)
    } catch (err) {
      toast.error('Failed to fetch posts')
    } finally {
    }
  }

  const nextStep = () => {
    let errorMessage = {}

    if (currentStep === 1) {
      if (!formData.campaignName) {
        errorMessage.campaignName = 'Campaign name is required'
      } else {
        const name = formData.campaignName.trim()
        const nameRegex = /^[A-Za-z ]+$/

        if (name.length > 50) {
          errorMessage.campaignName =
            'Campaign name must be less than 50 characters'
        } else if (!nameRegex.test(name)) {
          errorMessage.campaignName =
            'Campaign name can contain only alphabets and spaces'
        }
      }
      if (!formData.businessProfileId) {
        errorMessage.businessProfile = 'Please select a buiness profile'
      }
    }

    if (currentStep === 2) {
      if (!formData.schedule) {
        errorMessage.schedule = 'Please select a schedule'
      }
    }

    if (Object.keys(errorMessage).length > 0) {
      setErrors(errorMessage)
      return
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinalSubmit = () => {
    if (!formData.facebookConnected)
      return alert('Please connect your Facebook account.')

    const campaignData = {
      campaignName: formData.campaignName,
      selectedPost: formData.selectedPost,
      budget: formData.budget,
      schedule: formData.schedule,
      location: formData.location,
      age: formData.age,
      interests: formData.interests,
      status: formData.status,
      business_profile_id: formData.businessProfileId,
    }

    if (isEditMode) {
      updateCampaign({
        id: campaignToEdit.id,
        ...campaignData,
        audience: `${campaignData.location}, ${campaignData.age}, ${campaignData.interests}`,
      })
    } else {
      onSave(campaignData)
    }

    onClose()
  }

  const renderStep1 = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          campaign Name <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          placeholder='Campaign Name (e.g., Q4 Product Promotion)'
          value={formData.campaignName}
          onChange={(e) => {
            const value = e.target.value

            let error = ''

            if (value.length > 50) {
              error = 'Campaign name must be less than 50 characters'
            } else if (!/^[A-Za-z ]*$/.test(value)) {
              error = 'Only alphabets and spaces are allowed'
            }
            setFormData({ ...formData, campaignName: value })
            setErrors((prev) => ({
              ...prev,
              campaignName: error,
            }))
          }}
          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500'
        />
        <FieldError
          errorMessage={errors.campaignName}
          show={!!errors.campaignName}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Business Profile <span className='text-red-500'>*</span>
        </label>
        <select
          value={formData.businessProfileId}
          onChange={(e) => {
            let error = ''
            if (!e.target.value) {
              error = 'Please select a buiness profile'
            }

            setErrors((prev) => ({ ...prev, businessProfile: error }))
            setFormData({
              ...formData,
              businessProfileId: e.target.value,
            })
          }}
          className='w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                 focus:ring-2 focus:ring-purple-500 focus:outline-none
                 text-gray-700'
        >
          <option value='' disabled>
            Select Business Profile
          </option>
          {businessProfiles &&
            businessProfiles.map((profile, index) => {
              return (
                <option key={index} value={profile?.id}>
                  {profile?.description}
                </option>
              )
            })}
        </select>
        <FieldError
          errorMessage={errors.businessProfile}
          show={!!errors.businessProfile}
        />
      </div>

      <h3 className='text-md font-semibold text-gray-700 pt-2'>
        Select Post to Promote
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {posts?.length > 0 &&
          posts.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                // let error = ''
                // setErrors((prev)=> ({...prev, selectedPost: ''}))
                setFormData({ ...formData, selectedPost: post })
              }}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.selectedPost?.id === post.id
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-400'
              }`}
            >
              <div className='font-medium text-gray-800 flex items-center gap-2'>
                {formData.selectedPost?.id === post.id && (
                  <CheckCircle className='w-4 h-4 text-purple-600' />
                )}
                {post.title}
              </div>
              <p className='text-sm text-gray-500 mt-1 truncate'>
                {post.description}
              </p>
            </div>
          ))}

        <FieldError
          errorMessage={errors.selectedPost}
          show={!!errors.selectedPost}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className='space-y-6'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Campaign Status <span className='text-red-500'>*</span>
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className='w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                 focus:ring-2 focus:ring-purple-500 focus:outline-none
                 text-gray-700'
        >
          {AVAILABLE_STATUSES.map((s) => {
            const Icon = statusIcons[s]
            return (
              <option key={s} value={s} className='p-2'>
                {s}
              </option>
            )
          })}
        </select>
        <p className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
          {formData.status === 'Draft' && (
            <>
              <Clock className='w-3 h-3 text-gray-400' /> Save your settings
              without running.
            </>
          )}
          {formData.status === 'comleted' && (
            <>
              <Calendar className='w-3 h-3 text-blue-400' /> Will start on the
              scheduled date.
            </>
          )}
          {formData.status === 'active' && (
            <>
              <CheckCircle className='w-3 h-3 text-green-400' /> Start running
              immediately.
            </>
          )}
        </p>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Total Budget ($)
        </label>
        <input
          type='number'
          value={formData?.budget ?? ''}
          onChange={(e) => {
            //  let error = ''
            // if(e.target.value > 0) {
            //   setErrors((prev)=>({...prev , budget: ''}))
            // } else {

            //   setErrors((prev)=>({...prev , budget: 'Budget must be greater than 0'}))
            // }

            setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })
          }}
          placeholder='Minimum $100'
          min='1'
          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500'
        />

        <FieldError errorMessage={errors.budget} show={!!errors.budget} />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Schedule (Start Date - End Date){' '}
          <span className='text-red-500'>*</span>
        </label>
        <div className='relative date-picker-wrapper'>
          <input
            type='text'
            readOnly
            value={formData?.schedule ?? ''}
            onClick={() => setShowDatePicker(true)}
            placeholder='Select date range'
            className='w-full px-4 py-3 border border-gray-200 rounded-lg cursor-pointer focus:ring-2 focus:ring-purple-500'
          />

          {showDatePicker && (
            <div className='absolute top-[-350px] left-0 right-0 z-20'>
              <DateRange
                ranges={dateRange}
                onChange={(item) => {
                  const { startDate, endDate } = item.selection
                  setDateRange([item.selection])

                  setFormData({
                    ...formData,
                    schedule: `${format(
                      item.selection.startDate,
                      'yyyy-MM-dd'
                    )} to ${format(item.selection.endDate, 'yyyy-MM-dd')}`,
                  })

                  setErrors((prev) => ({ ...prev, schedule: '' }))
                  if (endDate && endDate !== dateRange[0].endDate) {
                    setShowDatePicker(false)
                  }
                }}
                moveRangeOnFirstSelection={false}
                minDate={new Date()}
                rangeColors={['#7c3aed']}
              />
            </div>
          )}
        </div>

        <FieldError errorMessage={errors.schedule} show={!!errors.schedule} />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className='space-y-6'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Location
        </label>
        <input
          type='text'
          value={formData.location}
          onChange={(e) => {
            // let error = ''
            // if (e.target.value ) {
            //    setErrors((prev)=>({...prev , location: ''}))
            // } else {
            //       setErrors((prev)=>({...prev , location: 'Location is required'}))
            // }

            setFormData({ ...formData, location: e.target.value })
          }}
          placeholder='e.g., New York, London'
          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500'
        />

        {/* <FieldError errorMessage={errors.location} show={!!errors.location}/> */}
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Age Group
        </label>
        <input
          type='text'
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          placeholder='e.g., 25-45'
          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500'
        />
        {/* <FieldError errorMessage={errors.age} show={!!errors.age}/> */}
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Interests
        </label>
        <input
          type='text'
          value={formData.interests}
          onChange={(e) =>
            setFormData({ ...formData, interests: e.target.value })
          }
          placeholder='e.g., Technology, Fashion, Cooking (comma separated)'
          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500'
        />
        {/* <FieldError errorMessage={errors.interests} show={!!errors.interests}/> */}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className='space-y-6'>
      <div className='p-6 border border-gray-200 rounded-xl shadow-sm'>
        <h3 className='text-lg font-bold mb-3 text-gray-800 flex items-center gap-2'>
          <Facebook className='w-5 h-5 text-blue-600' /> Facebook/Meta
          Connection
        </h3>
        {formData.facebookConnected ? (
          <div className='flex items-center gap-3 text-green-600 font-semibold bg-green-50 p-3 rounded-lg'>
            <CheckCircle className='w-5 h-5' /> Account Connected Successfully!
          </div>
        ) : (
          <button
            onClick={() =>
              setFormData({ ...formData, facebookConnected: true })
            }
            className='w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors'
          >
            Connect Facebook Ad Account (Mock Connect)
          </button>
        )}
      </div>

      <div className='p-6 border border-purple-200 rounded-xl bg-purple-50'>
        <h3 className='text-lg font-bold mb-3 text-gray-800'>
          Campaign Summary
        </h3>
        <div className='grid grid-cols-2 gap-y-2 text-sm'>
          <p className='text-gray-500'>Name:</p>
          <p className='font-medium text-gray-800'>
            {formData.campaignName || 'N/A'}
          </p>

          <p className='text-gray-500'>Post:</p>
          <p className='font-medium text-gray-800'>
            {formData.selectedPost?.title || 'N/A'}
          </p>

          <p className='text-gray-500'>Budget:</p>
          <p className='font-medium text-green-600'>
            ${formData?.budget?.toLocaleString()}
          </p>
          <p className='text-gray-500'>Status:</p>
          <p className='font-medium text-purple-700'>{formData.status}</p>

          <p className='text-gray-500'>Schedule:</p>
          <p className='font-medium text-gray-800'>
            {formData.schedule || 'N/A'}
          </p>

          <p className='text-gray-500'>Audience:</p>
          <p className='font-medium text-gray-800'>
            {formData.location}, {formData.age}, {formData.interests}
          </p>
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return null
    }
  }

  return (
    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300'>
      <div className='bg-white shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl'>
        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10'>
          <h2 className='text-xl font-semibold text-gray-800'>
            {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='w-5 h-5 text-gray-600' />
          </button>
        </div>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex justify-between items-center'>
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const StepIcon = step.icon
              return (
                <React.Fragment key={step.id}>
                  <div className='flex flex-col items-center relative'>
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300 
                                    ${
                                      isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isActive
                                        ? 'bg-[#bbb5ed] text-black shadow-lg'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className='w-5 h-5' />
                      ) : (
                        <StepIcon className='w-5 h-5' />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 text-center max-w-[80px] ${
                        isActive
                          ? 'text-[#9e94f6] font-semibold'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
        <div className='p-6 min-h-[300px]'>{renderStepContent()}</div>
        <div className='sticky bottom-0 bg-white p-6 border-t border-gray-200 flex justify-between rounded-b-xl'>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className='flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50'
          >
            <ChevronLeft className='w-5 h-5' /> Back
          </button>

          {currentStep < STEPS.length ? (
            <button
              onClick={nextStep}
              className='flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all'
              style={{ backgroundColor: '#bbb5ed', color: '#000' }}
            >
              Next Step <ArrowRight className='w-5 h-5' />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={!formData.facebookConnected}
              className='flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all hover:shadow-lg disabled:opacity-50'
              style={{ backgroundColor: isEditMode ? '#10b981' : '#7c3aed' }}
            >
              <Send className='w-5 h-5' />{' '}
              {isEditMode ? 'Update & Relaunch' : 'Launch Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateCampaignModal
