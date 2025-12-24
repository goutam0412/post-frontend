import React from 'react'
import { X, Calendar, Edit3, Image, Tag, FileText, Eye, Clock } from 'lucide-react'

const PostPreviewModal = ({ showModal, closeModal, post }) => {
  if (!showModal || !post) return null

  const formatDate = (id) => {
    if (typeof id === 'number') {
      return new Date(id).toLocaleString()
    }
    return post.createdAt || 'N/A'
  }

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300'>
      <div className='bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10'>
          <div className='flex items-center gap-2'>
            <Eye className='w-6 h-6 text-purple-600' />
            <h2 className='text-xl font-semibold text-gray-800 truncate'>
              Preview
            </h2>
          </div>
          <button
            onClick={closeModal}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='w-5 h-5 text-gray-600' />
          </button>
        </div>
        <div className='p-6 space-y-6'>
          {post.image ? (
            <div className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
              <h3 className='text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1'>
                <Image className='w-4 h-4' /> Image Preview
              </h3>
              <img
                src={post.image}
                alt={post.title || 'Post Image'}
                className='w-full max-h-96 object-contain rounded-md shadow-md'
              />
            </div>
          ) : (
            <div className='p-4 text-center bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700'>
              <p className='text-sm font-medium'>
                No image uploaded for this post.
              </p>
            </div>
          )}
          <div className='grid grid-cols-2 gap-4'>
            <DetailItem icon={Edit3} label='Post Title' value={post.title} />
            <DetailItem
              icon={Calendar}
              label='Created At'
              value={formatDate(post.id)}
            />
            <DetailItem
              icon={Clock}
              label='Status'
              value={post.status || 'Draft'}
              color={
                post.status === 'Active'
                  ? 'text-green-600'
                  : post.status === 'Pending'
                  ? 'text-yellow-600'
                  : 'text-gray-600'
              }
            />
            <DetailItem
              icon={Tag}
              label='Platform'
              value={post.platform || 'Drafting'}
            />
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1'>
              <FileText className='w-4 h-4' /> Description
            </h3>
            <div className='p-3 bg-gray-50 border border-gray-200 rounded-lg'>
              <p className='text-sm text-gray-800 whitespace-pre-wrap'>
                {post.description || 'No description provided.'}
              </p>
            </div>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1'>
              <Tag className='w-4 h-4' /> Selected Caption
            </h3>
            <div className='p-3 bg-purple-50 border border-purple-200 rounded-lg'>
              <p className='text-sm text-gray-800 whitespace-pre-wrap font-medium'>
                {post.caption || 'No caption selected.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const DetailItem = ({ icon: Icon, label, value, color }) => (
  <div className='space-y-1 p-2 bg-gray-50 border border-gray-200 rounded-lg'>
    <p className='text-xs font-medium text-gray-500 flex items-center gap-1'>
      <Icon className={`w-3 h-3 ${color || 'text-gray-500'}`} /> {label}
    </p>
    <p className={`text-sm font-semibold text-gray-800 truncate ${color}`}>
      {value}
    </p>
  </div>
)

export default PostPreviewModal
