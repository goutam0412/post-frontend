'use client'
import React, { useState, useEffect } from 'react'
import {
  List,
  Copy,
  Trash2,
  Calendar,
  Plus,
  Eye,
  Edit3,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import SideBar from '@/components/SideBar'
import Header from '@/components/Header'
import CreatePostModal from '@/components/CreatePostModal'
import PostPreviewModal from '@/components/PostPreviewModal'

const STATIC_POSTS = [
  {
    id: 101,
    caption: 'Is saal ka sabse bada launch! Taiyar ho jao!',
    hashtags: '#Innovation #TechLaunch #FutureIsNow',
    image_url: 'https://via.placeholder.com/600/92c952',
    created_at: '2025-12-01T10:00:00Z',
    campaign_id: 5,
    ai_score: 9.2,
  },
  {
    id: 102,
    caption: 'Nayi features ke saath, aapka kaam hoga aur bhi aasaan.',
    hashtags: '#Productivity #NewUpdate #Efficiency',
    image_url: 'https://via.placeholder.com/600/771796',
    created_at: '2025-11-28T14:30:00Z',
    campaign_id: 2,
    ai_score: 7.8,
  },
  {
    id: 103,
    caption: 'Apni journey ko agle level par le jao.',
    hashtags: '#Motivation #Success #Goals',
    image_url: 'https://via.placeholder.com/600/24f355',
    created_at: '2025-11-20T08:15:00Z',
    campaign_id: 8,
    ai_score: 8.5,
  },
]

const statusMap = {
  Active: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  Pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  Draft: { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100' },
}

export default function PostsContent() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [postToEdit, setPostToEdit] = useState(null)
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [previewPostData, setPreviewPostData] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) 

  const formatPostData = (post) => ({
    ...post,
    id: post.id,
    title: post.caption || 'No Caption',
    description: post.hashtags || 'No Hashtags',
    image: post.image_url,
    createdAt: post.created_at,
    campaign_id: post.campaign_id,
    ai_score: Number(post.ai_score) || 0,
    status: 'Active', 
    platform: 'Custom Platform', 
  })

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    const loadStaticPosts = setTimeout(() => {
      const formatted = STATIC_POSTS.map(formatPostData)
      setPosts(formatted)
      setFilteredPosts(formatted)
      setLoading(false)
    }, 500) 

    return () => clearTimeout(loadStaticPosts)
  }, [])

  useEffect(() => {
    handleSearch(searchQuery)
  }, [posts, searchQuery])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredPosts(posts)
    } else {
      const lower = query.toLowerCase()
      const filtered = posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower) ||
          p.platform?.toLowerCase().includes(lower)
      )
      setFilteredPosts(filtered)
      }
    }

    const closeModal = () => {
      setShowCreateModal(false)
      setPostToEdit(null)
  }

  const createPost = async (postData) => {
    try {
      if (!postData.caption || !postData.hashtags || !postData.campaign_id) {
        alert('Please provide caption, hashtags, and campaign_id.')
        return
      }
      
      const newId = Math.max(...posts.map(p => p.id), 0) + 1;
      
      const newPost = {
        id: newId,
        caption: postData.caption,
        hashtags: postData.hashtags,
        image_url: postData.image_url || null,
        created_at: new Date().toISOString(),
        campaign_id: postData.campaign_id,
        ai_score: postData.ai_score,
      }
  
      const formattedNewPost = formatPostData(newPost)

      // Local state update
      setPosts((prev) => [formattedNewPost, ...prev])
      setFilteredPosts((prev) => [formattedNewPost, ...prev])
  
      alert('✅ Post created successfully (Static)!')
      closeModal()
    } catch (err) {
      console.error('Error creating post locally:', err)
      alert(`❌ Failed to create post locally: ${err.message}`)
    }
  }
  
  const updatePost = (id, postData) => {
    console.log(`Updating post ID ${id} locally...`)
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? formatPostData({
              ...post,
              caption: postData.caption,
              hashtags: postData.hashtags,
              image_url: postData.image_url,
              campaign_id: postData.campaign_id,
              ai_score: postData.ai_score,
            })
          : post
      )
    )
    alert('Post updated locally!')
  }

  const deletePost = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      console.log(`Deleting post ID ${id} locally...`)
      setPosts((prev) => prev.filter((post) => post.id !== id))
      alert('Post deleted locally!')
    }
  }

  const editPost = (id) => {
    const post = posts.find((p) => p.id === id)
    if (post) {
      setPostToEdit(post)
      setShowCreateModal(true)
    }
  }

  const previewPost = (post) => {
    setPreviewPostData(post)
    setShowPreviewModal(true)
  }

  const copyCaption = (caption) => {
    navigator.clipboard.writeText(caption)
    alert('Caption copied to clipboard!')
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-600'>Loading static posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
          <p className='font-bold'>Error!</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-screen' style={{ background: '#f2f0fe' }}>
      <SideBar />
      <div className='flex-1 overflow-auto'>
        <Header title='My Posts' onSearch={handleSearch} />
        <div className='p-8'>
          <div className='bg-white shadow-lg'>
            <div className='p-6 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-800'>Posts</h2>
                  <p className='text-sm text-gray-500 mt-1'>
                    Manage all your scheduled, published, and draft posts. (Static Data Mode)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPostToEdit(null)
                    setShowCreateModal(true)
                  }}
                  className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold transition-all hover:shadow-xl'
                  style={{
                    backgroundColor: '#bbb5ed',
                    color: '#000',
                    borderRadius: 0,
                  }}
                >
                  <Plus className='w-5 h-5' />
                  Create New Post
                </button>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className='p-12 text-center'>
                <List className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                  No Posts Found
                </h3>
                <p className='text-gray-600 mb-6'>
                  Create your first post to get started.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className='px-6 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg'
                  style={{ backgroundColor: '#7c3aed' }}
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Title / Description
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Campaign ID
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        AI Score
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Created
                      </th>
                      <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-100'>
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className='hover:bg-purple-50 transition-colors'>
                        <td className='px-6 py-4 whitespace-nowrap max-w-sm'>
                          <div>
                            <div className='text-sm font-semibold text-gray-900 truncate'>
                              {post.title}
                            </div>
                            <div className='text-xs text-gray-500 truncate'>
                              {post.description}
                            </div>
                          </div>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {post.campaign_id}
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                          {post.ai_score}
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <div className='flex items-center gap-1'>
                            <Calendar className='w-3 h-3' />
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString()
                              : '—'}
                          </div>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex items-center justify-center space-x-2'>
                            <button
                              onClick={() => previewPost(post)}
                              className='p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full transition-all'
                              title='Preview Post'
                            >
                              <Eye className='w-4 h-4' />
                            </button> 
                            <button
                              onClick={() => editPost(post.id)}
                              className='p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all'
                              title='Edit Post'
                            >
                              <Edit3 className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => copyCaption(post.caption)}
                              className='p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-all'
                              title='Copy Caption'
                            >
                              <Copy className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => deletePost(post.id)}
                              className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-all'
                              title='Delete Post'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreatePostModal
        showModal={showCreateModal}
        closeModal={closeModal}
        savePost={createPost} // Static function
        postToEdit={postToEdit}
        updatePost={updatePost} // Static function
      />

      <PostPreviewModal
        showModal={showPreviewModal}
        closeModal={() => setShowPreviewModal(false)}
        post={previewPostData}
      />
    </div>
  )
}