'use client'
import React, { useState, useEffect } from 'react'
import {
  List, Copy, Trash2, Calendar, Plus, Eye, Edit3, Clock, CheckCircle, AlertCircle,
} from 'lucide-react'
import SideBar from '@/components/SideBar'
import Header from '@/components/Header'
import CreatePostModal from '@/components/CreatePostModal'
import PostPreviewModal from '@/components/PostPreviewModal'

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
    ai_score: post.ai_score ? Number(post.ai_score).toFixed(1) : '0.0',
    status: 'Active',
    platform: 'Custom Platform',
  })

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/v1/posts')
      if (!response.ok) throw new Error('Failed to get data!')
      
      const data = await response.json()
      const apiPosts = data.posts || data || []
      const formatted = apiPosts.map(formatPostData)
      
      setPosts(formatted)
      setFilteredPosts(formatted)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const savePost = async (postData) => {
    try {
      const token = localStorage.getItem('token'); 
  
      const response = await fetch('http://localhost:3001/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ post: postData }),
      });
  
      if (response.ok) {
        alert('Post Created Successfully!');
        fetchPosts();
        setShowCreateModal(false);
      } else {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        alert('Error: ' + (errorData.error || 'Check console'));  
      }
    } catch (err) {
      console.error('Network Error:', err);
    }
  };  

  const updatePost = async (id, postData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ post: postData }),
      })
      if (response.ok) {
        fetchPosts()
        setShowCreateModal(false)
      }
    } catch (err) {
      console.error("Update Error:", err)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Search logic
  useEffect(() => {
    const lower = searchQuery.toLowerCase()
    const filtered = posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower)
    )
    setFilteredPosts(filtered)
  }, [posts, searchQuery])

  // DELETE API Call
 const deletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/posts/${id}`, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json' }
        })
        if (response.ok) {
          alert('Deleted successfully!')
          fetchPosts()
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const editPost = (post) => {
    setPostToEdit(post)
    setShowCreateModal(true)
  }

  if (loading) return <div className='flex items-center justify-center h-screen font-bold'>Loading API Data...</div>

  return (
    <div className='flex h-screen' style={{ background: '#f2f0fe' }}>
      <SideBar />
      <div className='flex-1 overflow-auto'>
        <Header title='My Posts' onSearch={(q) => setSearchQuery(q)} />
        <div className='p-8'>
          <div className='bg-white shadow-lg'>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold text-gray-800'>Posts</h2>
                <p className='text-sm text-gray-500'>Showing data from Local API</p>
              </div>
              <button
                onClick={() => { setPostToEdit(null); setShowCreateModal(true); }}
                className='flex items-center gap-2 px-4 py-2.5 bg-[#bbb5ed] text-black font-semibold hover:shadow-lg transition-all'
              >
                <Plus className='w-5 h-5' /> Create New Post
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Title / Description</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Campaign ID</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>AI Score</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Created</th>
                    <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-100'>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className='hover:bg-purple-50 transition-colors'>
                      <td className='px-6 py-4 max-w-sm'>
                        <div className='text-sm font-semibold text-gray-900 truncate'>{post.title}</div>
                        <div className='text-xs text-gray-500 truncate'>{post.description}</div>
                      </td>
                      <td className='px-6 py-4 text-sm'>{post.campaign_id}</td>
                      <td className='px-6 py-4 text-sm font-bold text-purple-600'>{post.ai_score}</td>
                      <td className='px-6 py-4 text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-3 h-3' />
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '—'}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex justify-center space-x-2'>
                          <button onClick={() => {setPreviewPostData(post); setShowPreviewModal(true);}} className='p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full'><Eye className='w-4 h-4' /></button>
                          <button onClick={() => editPost(post)} className='p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full'><Edit3 className='w-4 h-4' /></button>
                          <button onClick={() => deletePost(post.id)} className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full'><Trash2 className='w-4 h-4' /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        showModal={showCreateModal}
        closeModal={() => {setShowCreateModal(false); setPostToEdit(null);}}
        onSaveSuccess={fetchPosts}
        postToEdit={postToEdit}
        savePost={savePost} 
        updatePost={updatePost} 
      />

      <PostPreviewModal
        showModal={showPreviewModal}
        closeModal={() => setShowPreviewModal(false)}
        post={previewPostData}
      />
    </div>
  )
}