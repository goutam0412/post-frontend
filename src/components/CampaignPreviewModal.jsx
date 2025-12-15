'use client'
import React from 'react'
import {
  X,
  Calendar,
  Eye,
  BarChart,
  Users,
  Edit3,
  FileText,
  Clock,
  Tag, 
} from 'lucide-react'

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

const CampaignPreviewModal = ({ showModal, closeModal, campaign }) => {
  if (!showModal || !campaign) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Published':
        return 'text-green-600'
      case 'Pending':
      case 'Scheduled':
        return 'text-yellow-600'
      case 'Draft':
      case 'Paused':
      default:
        return 'text-gray-600'
    }
  }

  const formattedCreatedAt = campaign.createdAt || new Date().toLocaleDateString()

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300'>
      <div className='bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10'>
          <div className='flex items-center gap-2'>
            <Eye className='w-6 h-6 text-purple-600' />
            <h2 className='text-xl font-semibold text-gray-800 truncate'>
              Preview: {campaign.name || 'Untitled Campaign'}
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
          <div className='grid grid-cols-2 gap-4'>
            <DetailItem 
              icon={Edit3} 
              label='Campaign Name' 
              value={campaign.name} 
            />
            <DetailItem 
              icon={BarChart} 
              label='Budget' 
              value={
                campaign.budget
                  ? `$${parseFloat(campaign.budget).toLocaleString()}`
                  : 'N/A'
              } 
            />
            <DetailItem 
              icon={Clock} 
              label='Status' 
              value={campaign.status || 'Draft'}
              color={getStatusColor(campaign.status)}
            />
            <DetailItem 
              icon={Tag} 
              label='Platform' 
              value={campaign.platform || 'Multi-platform'} 
            />
            <DetailItem 
              icon={Calendar} 
              label='Created At' 
              value={formattedCreatedAt} 
            />
            <DetailItem 
              icon={Calendar} 
              label='Schedule' 
              value={campaign.schedule || 'Immediate'} 
            />
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1'>
              <Users className='w-4 h-4' /> Target Audience
            </h3>
            <div className='p-3 bg-gray-50 border border-gray-200 rounded-lg'>
              <p className='text-sm text-gray-800 whitespace-pre-wrap'>
                {campaign.audience || 'Worldwide (Default)'}
              </p>
            </div>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1'>
              <FileText className='w-4 h-4' /> Post Content Title
            </h3>
            <div className='p-3 bg-purple-50 border border-purple-200 rounded-lg'>
              <p className='text-sm text-gray-800 whitespace-pre-wrap font-medium'>
                {campaign.postTitle || 'No associated post title.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CampaignPreviewModal