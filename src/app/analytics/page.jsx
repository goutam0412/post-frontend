'use client'
import React, { useState, useEffect } from 'react'
import {
  Eye,
  Share2,
  Target,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShoppingCart,
} from 'lucide-react'
import SideBar from '@/components/SideBar'
import Header from '@/components/Header'
import axios from 'axios'

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7days')

  // 🔍 Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState([])
  const [topPost, setTopPost] = useState(null);

  // ✅ Correct overviewStats icons
  // const overviewStats = [
  //   {
  //     title: 'Views',
  //     value: '124.5K',
  //     change: '+12.5%',
  //     trend: 'up',
  //     icon: Eye,
  //     color: 'bg-blue-500',
  //   },
  //   {
  //     title: 'Orders',
  //     value: '5.8%',
  //     change: '+2.3%',
  //     trend: 'up',
  //     icon: ShoppingCart,
  //     color: 'bg-pink-500',
  //   },
  //   {
  //     title: 'Shares',
  //     value: '89.2K',
  //     change: '-3.2%',
  //     trend: 'down',
  //     icon: Share2,
  //     color: 'bg-purple-500',
  //   },
  //   {
  //     title: 'Clicks',
  //     value: '3.4%',
  //     change: '+0.8%',
  //     trend: 'up',
  //     icon: Target,
  //     color: 'bg-green-500',
  //   },
  // ]

  const [overviewStats, setOverviewStats] = useState([
    { title: 'Views', value: 0, change: '0%', trend: 'up', icon: Eye, color: 'bg-blue-500' },
    { title: 'Orders', value: 0, change: '0%', trend: 'up', icon: ShoppingCart, color: 'bg-pink-500' },
    { title: 'Shares', value: 0, change: '0%', trend: 'up', icon: Share2, color: 'bg-purple-500' },
    { title: 'Clicks', value: 0, change: '0%', trend: 'up', icon: Target, color: 'bg-green-500' },
  ]);


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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/analytics');
        const data = res.data.analytics;

        // Sum values across all posts for each metric
        const totalViews = data.reduce((sum, item) => sum + (item.views || 0), 0);
        const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);
        const totalShares = data.reduce((sum, item) => sum + (item.shares || 0), 0);
        const totalClicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);

        setOverviewStats([
          { title: 'Views', value: totalViews, change: '+0%', trend: 'up', icon: Eye, color: 'bg-blue-500' },
          { title: 'Orders', value: totalOrders, change: '+0%', trend: 'up', icon: ShoppingCart, color: 'bg-pink-500' },
          { title: 'Shares', value: totalShares, change: '+0%', trend: 'up', icon: Share2, color: 'bg-purple-500' },
          { title: 'Clicks', value: totalClicks, change: '+0%', trend: 'up', icon: Target, color: 'bg-green-500' },
        ]);

      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };

    fetchAnalytics();
  }, []);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/posts');
        if (res.data.posts.length > 0) {
          setTopPost(res.data.posts[0]) // FIRST POST ONLY
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredPosts(topPost ? [topPost] : [])
    } else {
      const lower = query.toLowerCase()
      const filtered = topPost
        ? [topPost].filter(
          (post) =>
            post.caption.toLowerCase().includes(lower) ||
            post.hashtags.toLowerCase().includes(lower)
        )
        : []
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
            {/* {overviewStats.map((stat, index) => (
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
                    className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
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
            ))} */}
            {overviewStats.map((stat, index) => (
              <div key={index} className='bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow'>
                <div className='flex items-start justify-between mb-4'>
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <stat.icon className='w-6 h-6 text-white' />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className='w-4 h-4' /> : <ArrowDownRight className='w-4 h-4' />}
                    {stat.change}
                  </div>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-1'>{stat.value}</h3>
                <p className='text-sm text-gray-600'>{stat.title}</p>
              </div>
            ))}


          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            {/* Engagement overview */}
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
                          width: `${(platform.engagement / maxPlatformEngagement) * 100
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
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Posts</h3>

            {topPost ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{topPost.caption}</p>
                  <p className="text-sm text-gray-500">campaign_id {topPost.campaign_id}</p>
                  <p className="text-sm text-gray-500">
                    #{topPost.hashtags}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    AI Score: {topPost.ai_score}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(topPost.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No posts available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
