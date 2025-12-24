'use client'
import React, { useState, useEffect } from 'react'
import {
   Trash2, Calendar, Plus, Eye, Edit3
} from 'lucide-react'
import SideBar from '@/components/SideBar'
import Header from '@/components/Header'
import CreatePostModal from '@/components/CreatePostModal'
import PostPreviewModal from '@/components/PostPreviewModal'
import toast from 'react-hot-toast'

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
  const [currentPage, setCurrentPage] = useState(1)

  const postsPerPage = 10
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentItems = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`)
      if (!response.ok) throw new Error('Failed to get data!')
      
      const data = await response.json()
      const apiPosts = data.posts || data || []
      const formatted = apiPosts.map(formatPostData)
      
      setPosts(formatted)
      setFilteredPosts(formatted)
      setError(null)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const savePost = async (postData) => {
    console.log('savePost called');

    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'token': `Bearer ${token}` 
        },
        body: JSON.stringify({ post: postData }),
      });
      console.log("token", token)
  
      if (response.ok) {
        fetchPosts();
        toast.success('Post Created Successfully!');
        setShowCreateModal(false);
      } else {
        const errorText = await response.text();
        console.error('Full Server Error:', errorText);
        toast.error('Server Error!');
      }
    } catch (err) {
      console.error('Network Error:', err);
      toast.error('Network Error! Could not save the post.')

    }
  };

  const updatePost = async (id, postData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ post: postData }),
      })
      if (response.ok) {
        toast.success('Post updated successfully!')
        fetchPosts()
        setShowCreateModal(false)
      }
    } catch (err) {
      console.error("Update Error:", err)
      toast.error('Failed to update the post!')

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
    setCurrentPage(1)
  }, [posts, searchQuery])

  // DELETE API Call
 const deletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts/${id}`, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json' }
        })
        if (response.ok) {
          toast.success('Deleted successfully!')
          fetchPosts()
        } else {
          toast.error('Failed to delete the post.')
          toast.error('Error deleting post!')


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
                <h2 className='text-2xl font-bold text-gray-800'>POSTS</h2>
                {/* <p className='text-sm text-gray-500'>Showing data from Local API</p> */}
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
                  {currentItems.map((post) => (
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
          <div className='p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50'>
              <div className='text-sm text-gray-600'>
                Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} entries
              </div>
              
              <div className='flex gap-2'>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>

                <div className='flex items-center px-4 text-sm font-semibold text-purple-700'>
                  Page {currentPage} of {totalPages || 1}
                </div>

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
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