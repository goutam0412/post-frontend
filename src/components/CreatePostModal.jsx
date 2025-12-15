import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  ImagePlus,
  Wand2,
  Copy,
  X,
  CheckCircle,
  Loader2,
  Save,
  RefreshCw,
} from 'lucide-react'

const CreatePostModal = ({
  showModal,
  closeModal,
  postToEdit,
  onSaveSuccess,
  savePost, 
  updatePost, 
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)

  const [campaignId, setCampaignId] = useState(1) 
  const [aiScore, setAiScore] = useState(4)       

  const [generatedCaptions, setGeneratedCaptions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCaption, setSelectedCaption] = useState('')
  const [saveStatus, setSaveStatus] = useState(null)
  const [status, setStatus] = useState('Draft')

  const isEditMode = !!postToEdit

  useEffect(() => {
    if (isEditMode) {
      // setTitle(postonSaveSuccessToEdit.title || '')
      setDescription(postToEdit.description || '')
      setUploadedImage(postToEdit.image || null)
      setSelectedCaption(postToEdit.title || '') 
      setGeneratedCaptions([postToEdit.title || ''])
      
      setCampaignId(postToEdit.campaign_id ? Number(postToEdit.campaign_id) : 1)
      setAiScore(postToEdit.ai_score ? Number(postToEdit.ai_score) : 4)

      const initialStatus = postToEdit.status
        ? postToEdit.status.charAt(0).toUpperCase() + postToEdit.status.slice(1)
        : 'Draft'
      setStatus(initialStatus)
    } else {
      setTitle('')
      setDescription('')
      setUploadedImage(null)
      setSelectedCaption('')
      setGeneratedCaptions([])
      
      setCampaignId(1)
      setAiScore(4)

      setStatus('Draft')
    }
    setSaveStatus(null)
  }, [postToEdit, isEditMode, showModal])

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => {
        setSaveStatus(null)
        if (saveStatus === 'success' && onSaveSuccess) {
          onSaveSuccess() 
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus, onSaveSuccess])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateCaptions = () => {
    if (!title || !description) {
      alert('Please enter both title and description')
      return
    }

    setIsGenerating(true)
    setTimeout(() => {
      const captions = [
        `🚀 ${title}! ${description} Join us on this exciting journey. #Innovation #Growth #${
          title.split(' ')[0]
        }`,
        `✨ Exciting news: ${title}. ${description} Let's make it happen together! #Success #Community #Inspiration`,
        `💡 ${title} - ${description} Discover what's possible when creativity meets technology. #Digital #Future #${
          title.split(' ')[0]
        }`,
        `🎯 ${title}: ${description} Your success story starts here! #Goals #Achievement #Motivation`,
      ]
      setGeneratedCaptions(captions)
      setIsGenerating(false)
      if (isEditMode) setSelectedCaption('')
    }, 2000)
  }
  
  const handleSave = async () => {
    if (!title || !description || !selectedCaption) {
      alert('Please fill all fields and select a caption')
      return
    }
    if (!campaignId || !aiScore || isNaN(Number(campaignId)) || isNaN(Number(aiScore))) {
        alert('Campaign ID and AI Score must be valid numbers.')
        return
    }
  
    const finalStatus = status.charAt(0).toUpperCase() + status.slice(1)
  
    const postData = {
      caption: selectedCaption,
      hashtags: description || '',
      image_url: uploadedImage,
      status: finalStatus,
      platform: 'Drafting',
      title: title || '',
      campaign_id: Number(campaignId), 
      ai_score: Number(aiScore),       
    }
  
    try {
      if (isEditMode) {
        updatePost(postToEdit.id, postData)
      } else {
        savePost(postData)   
      }
  
      setSaveStatus('success')
    } catch (error) {
      console.error('Error saving post locally:', error)
      setSaveStatus('error') 
      alert('Failed to save post locally.')
    }
  }
  
  const copyCaption = (caption) => {
    navigator.clipboard.writeText(caption)
    alert('Caption copied to clipboard!')
  }

  if (!showModal) return null

  return (
    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300'>
      <div className='bg-white shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10'>
          <div className='flex items-center gap-2'>
            <Wand2 className='w-6 h-6' style={{ color: '#7c3aed' }} />
            <h2 className='text-xl font-semibold text-gray-800'>
              {isEditMode ? 'Edit Post' : 'Create New Post'}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='w-5 h-5 text-gray-600' />
          </button>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Post Title *
                  </label>
                  <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter your post title...'
                    className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Describe your post in detail...'
                    className='w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400'
                  />
                </div>
                
                <div className='flex space-x-4'>
                    <div className='w-1/2'>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>Campaign ID *</label>
                        <input
                            type='number'
                            value={campaignId}
                            onChange={(e) => setCampaignId(e.target.value)}
                            placeholder='e.g., 1'
                            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400'
                            min='1'
                        />
                    </div>
                    <div className='w-1/2'>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>AI Score *</label>
                        <input
                            type='number'
                            value={aiScore}
                            onChange={(e) => setAiScore(e.target.value)}
                            placeholder='e.g., 4'
                            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400'
                            min='0'
                            max='10'
                        />
                    </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Post Status *
                  </label>
                  <div className='relative'>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className='appearance-none w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
                    >
                      <option value='Active'>Active</option>
                      <option value='Pending'>Pending</option>
                      <option value='Draft'>Draft</option>
                    </select>
                    <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <path d='M19 9l-7 7-7-7' />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Upload Image (Optional)
                  </label>
                  <div className='relative'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='hidden'
                      id='image-upload-modal'
                    />
                    <label
                      htmlFor='image-upload-modal'
                      className='flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer group'
                    >
                      {uploadedImage ? (
                        <div className='relative w-full'>
                          <img
                            src={uploadedImage}
                            alt='Upload Preview'
                            className='w-full h-48 object-cover rounded-lg'
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setUploadedImage(null)
                            }}
                            className='absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors z-20'
                            title='Remove image'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImagePlus className='w-12 h-12 text-gray-400 group-hover:text-purple-600 mb-3' />
                          <span className='text-sm text-gray-600 group-hover:text-purple-600 font-medium'>
                            Click to upload image
                          </span>
                          <span className='text-xs text-gray-400 mt-1'>
                            PNG, JPG up to 10MB
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  onClick={generateCaptions}
                  disabled={isGenerating || !title || !description}
                  className='w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                  style={{ backgroundColor: '#7c3aed' }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      Generating Captions...
                    </>
                  ) : (
                    <>
                      <Sparkles className='w-5 h-5' />
                      {isEditMode && generatedCaptions.length > 0
                        ? 'Regenerate AI Captions'
                        : 'Generate AI Captions'}
                    </>
                  )}
                </button>
              </div>
              {generatedCaptions.length > 0 && (
                <div className='bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-purple-200'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                      <Sparkles className='w-5 h-5 text-purple-600' />
                      <h3 className='text-lg font-semibold text-gray-800'>
                        AI Generated Captions
                      </h3>
                    </div>
                    <button
                      onClick={generateCaptions}
                      className='flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-purple-100 rounded-lg text-sm text-purple-600 transition-colors'
                    >
                      <RefreshCw className='w-4 h-4' />
                      Regenerate
                    </button>
                  </div>
                  <div className='space-y-3'>
                    {generatedCaptions.map((caption, index) => (
                      <div
                        key={index}
                        className={`bg-white p-4 rounded-lg hover:shadow-md transition-all cursor-pointer border-2 ${
                          selectedCaption === caption
                            ? 'border-purple-500'
                            : 'border-transparent'
                        }`}
                        onClick={() => setSelectedCaption(caption)}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <p className='text-sm text-gray-700 flex-1'>
                            {caption}
                          </p>
                          <div className='flex gap-2'>
                            {selectedCaption === caption && (
                              <CheckCircle className='w-5 h-5 text-purple-600' />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyCaption(caption)
                              }}
                              className='p-1 hover:bg-gray-100 rounded transition-colors'
                              title='Copy caption'
                            >
                              <Copy className='w-4 h-4 text-gray-600' />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className='space-y-6'>
              <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Preview
                </h3>
                <div className='space-y-3'>
                  <div>
                    <span className='text-xs font-medium text-gray-500'>
                      Status
                    </span>
                    <p className='text-sm text-gray-800 mt-1 font-semibold'>
                      {status}
                    </p>
                  </div>
                  <div>
                    <span className='text-xs font-medium text-gray-500'>
                      Title
                    </span>
                    <p className='text-sm text-gray-800 mt-1'>
                      {title || 'No title yet'}
                    </p>
                  </div>
                  <div>
                    <span className='text-xs font-medium text-gray-500'>
                      Description
                    </span>
                    <p className='text-sm text-gray-800 mt-1'>
                      {description || 'No description yet'}
                    </p>
                  </div>
                  <div>
                    <span className='text-xs font-medium text-gray-500'>
                      Campaign/AI Score
                    </span>
                    <p className='text-sm text-gray-800 mt-1'>
                      {campaignId} / {aiScore}
                    </p>
                  </div>
                  {selectedCaption && (
                    <div>
                      <span className='text-xs font-medium text-gray-500'>
                        Selected Caption
                      </span>
                      <p className='text-sm text-gray-800 mt-1'>
                        {selectedCaption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div
                className='rounded-xl shadow-sm p-6'
                style={{ backgroundColor: 'rgb(187, 181, 237)' }}
              >
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  💡 Quick Tips
                </h3>
                <ul className='space-y-2 text-sm text-gray-700'>
                  <li className='flex items-start gap-2'>
                    <span className='text-purple-700 mt-1'>•</span>
                    <span>
                      Be specific in your title and description for better AI
                      captions
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-purple-700 mt-1'>•</span>
                    <span>Images boost engagement by 2.3x</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-purple-700 mt-1'>•</span>
                    <span>
                      **Required:** Ensure Campaign ID & AI Score are set.
                    </span>
                  </li>
                </ul>
              </div>
              <div className='space-y-3'>
                {selectedCaption && (
                  <button
                    onClick={handleSave}
                    className='w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg disabled:opacity-50'
                    style={{
                      backgroundColor: isEditMode ? '#10b981' : '#7c3aed',
                    }}
                  >
                    <Save className='w-5 h-5' />
                    {isEditMode ? 'Update Post (Static)' : 'Save Post (Static)'}
                  </button>
                )}

                {saveStatus === 'success' && (
                  <div className='flex items-center justify-center gap-2 text-sm text-green-600 p-2 bg-green-50 rounded-lg'>
                    <CheckCircle className='w-4 h-4' />
                    {isEditMode
                      ? 'Post Updated Successfully! (Local State Updated)'
                      : 'Post Saved Successfully! (Local State Updated)'}
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className='flex items-center justify-center gap-2 text-sm text-red-600 p-2 bg-red-50 rounded-lg'>
                    <X className='w-4 h-4' />
                    {isEditMode
                      ? 'Update Failed. Check console.'
                      : 'Save Failed. Check console.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePostModal