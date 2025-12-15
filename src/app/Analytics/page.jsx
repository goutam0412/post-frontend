'use client'
import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  Eye,
  Heart,
  Users,
  Target,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import SideBar from '@/components/SideBar'
import Header from '@/components/Header'

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7days')

  // 🔍 Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState([])

  const overviewStats = [
    {
      title: 'Total Impressions',
      value: '124.5K',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'bg-blue-500',
    },
    {
      title: 'Engagement Rate',
      value: '5.8%',
      change: '+2.3%',
      trend: 'up',
      icon: Heart,
      color: 'bg-pink-500',
    },
    {
      title: 'Total Reach',
      value: '89.2K',
      change: '-3.2%',
      trend: 'down',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Click Rate',
      value: '3.4%',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'bg-green-500',
    },
  ]

  const engagementData = [
    { date: 'Mon', value: 12400 },
    { date: 'Tue', value: 15600 },
    { date: 'Wed', value: 18200 },
    { date: 'Thu', value: 14800 },
    { date: 'Fri', value: 21500 },
    { date: 'Sat', value: 19800 },
    { date: 'Sun', value: 22100 },
  ]

  const platformData = [
    { name: 'Instagram', posts: 12, engagement: 6.2, color: '#E4405F' },
    { name: 'Facebook', posts: 8, engagement: 4.8, color: '#1877F2' },
    { name: 'Twitter', posts: 15, engagement: 3.5, color: '#1DA1F2' },
    { name: 'LinkedIn', posts: 6, engagement: 5.1, color: '#0A66C2' },
  ]

  const topPosts = [
    {
      id: 1,
      title: 'Summer Campaign',
      platform: 'Instagram',
      impressions: '28.5K',
      engagement: '1.8K',
      rate: '6.5%',
      icon: '📷',
    },
    {
      id: 2,
      title: 'Product Highlight',
      platform: 'LinkedIn',
      impressions: '18.2K',
      engagement: '1.1K',
      rate: '6.2%',
      icon: '💼',
    },
    {
      id: 3,
      title: 'Success Story',
      platform: 'Facebook',
      impressions: '15.8K',
      engagement: '890',
      rate: '5.6%',
      icon: '👤',
    },
  ]

  // Keep filtered posts in sync
  useEffect(() => {
    setFilteredPosts(topPosts)
  }, [])

  // 🔍 Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredPosts(topPosts)
    } else {
      const lower = query.toLowerCase()
      const filtered = topPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(lower) ||
          post.platform.toLowerCase().includes(lower)
      )
      setFilteredPosts(filtered)
    }
  }

  const maxEngagement = Math.max(...engagementData.map((d) => d.value))
  const maxPlatformEngagement = Math.max(
    ...platformData.map((d) => d.engagement)
  )

  return (
    <div className='flex h-screen' style={{ background: '#f2f0fe' }}>
      <SideBar />

      <div className='flex-1 overflow-auto'>
        {/* 🔍 Pass onSearch to Header */}
        <Header title='Analytics' onSearch={handleSearch} />

        <div className='p-8'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <p className='text-gray-600'>
                Track your social media performance
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className='px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500'
              >
                <option value='7days'>Last 7 Days</option>
                <option value='30days'>Last 30 Days</option>
                <option value='90days'>Last 90 Days</option>
              </select>
              <button className='flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium border border-gray-200 transition-colors'>
                <Download className='w-4 h-4' />
                Export
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {overviewStats.map((stat, index) => (
              <div
                key={index}
                className='bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div
                    className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className='w-6 h-6 text-white' />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className='w-4 h-4' />
                    ) : (
                      <ArrowDownRight className='w-4 h-4' />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-1'>
                  {stat.value}
                </h3>
                <p className='text-sm text-gray-600'>{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            {/* Engagement Chart */}
            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6'>
                Engagement Overview
              </h3>
              <div className='h-64 flex items-end justify-between gap-2'>
                {engagementData.map((item, index) => (
                  <div
                    key={index}
                    className='flex-1 flex flex-col items-center gap-2'
                  >
                    <div
                      className='w-full bg-gray-100 rounded-t-lg relative group cursor-pointer hover:bg-gray-200 transition-colors'
                      style={{
                        height: `${(item.value / maxEngagement) * 200}px`,
                      }}
                    >
                      <div className='absolute inset-0 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg'></div>
                      <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                        {item.value.toLocaleString()}
                      </div>
                    </div>
                    <span className='text-xs text-gray-600 font-medium'>
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Performance */}
            <div className='bg-white rounded-xl shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6'>
                Platform Performance
              </h3>
              <div className='space-y-4'>
                {platformData.map((platform, index) => (
                  <div key={index}>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium text-gray-700'>
                        {platform.name}
                      </span>
                      <span className='text-sm font-semibold text-gray-900'>
                        {platform.engagement}%
                      </span>
                    </div>
                    <div className='relative h-8 bg-gray-100 rounded-lg overflow-hidden'>
                      <div
                        className='absolute inset-y-0 left-0 rounded-lg transition-all duration-500'
                        style={{
                          width: `${
                            (platform.engagement / maxPlatformEngagement) * 100
                          }%`,
                          backgroundColor: platform.color,
                        }}
                      ></div>
                      <div className='absolute inset-0 flex items-center px-3'>
                        <span className='text-xs font-medium text-white mix-blend-difference'>
                          {platform.posts} posts
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Posts */}
          <div className='bg-white rounded-xl shadow-sm p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-6'>
              Top Performing Posts
            </h3>
            <div className='space-y-4'>
              {filteredPosts.length === 0 ? (
                <p className='text-gray-500 text-sm'>
                  No posts found for “{searchQuery}”
                </p>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className='flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-2xl'>
                        {post.icon}
                      </div>
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          {post.title}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {post.platform}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-6 text-sm'>
                      <div className='text-center'>
                        <div className='font-semibold text-gray-900'>
                          {post.impressions}
                        </div>
                        <div className='text-xs text-gray-500'>
                          Impressions
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='font-semibold text-gray-900'>
                          {post.engagement}
                        </div>
                        <div className='text-xs text-gray-500'>Engagement</div>
                      </div>
                      <div className='text-center'>
                        <div className='font-semibold text-green-600'>
                          {post.rate}
                        </div>
                        <div className='text-xs text-gray-500'>Rate</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
