'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  FileText,
  BarChart2,
  Settings,
  Megaphone,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  ChevronRight,
  Download,
  Clock,
  AlertCircle,
  Plus,
  MoreVertical,
} from 'lucide-react'
import axios from "axios";
import SideBar from '@/components/SideBar'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CreateCampaignModal from "@/components/CreateCampaignModal";
import Link from 'next/link'

// ---------------------
const statusMap = {
  completed: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
  active: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  draft: { icon: AlertCircle, color: "text-gray-600", bg: "bg-gray-100" },
};
// -----------------

export default function ImpozitionsDashboard() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState([])
  const [totalCampaignslength,setTotalCampaignslength]=useState();
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalPosts: 0,
    activeCampaigns: 0,
    totalReach: 0,
    engagementRate: 0,
  })

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = () => {
    try {
      const postsJson = localStorage.getItem('social_posts_data')
      const campaignsJson = localStorage.getItem('social_campaigns_data')

      const loadedPosts = postsJson ? JSON.parse(postsJson) : []
      const loadedCampaigns = campaignsJson ? JSON.parse(campaignsJson) : []

      setPosts(loadedPosts)
      setCampaigns(loadedCampaigns)
      calculateStats(loadedPosts)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleSearch = (query) => {
    setSearchTerm(query.toLowerCase())
  }

  //  ----------------
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = useCallback(async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns`, {
        method: "GET",
        headers: {
          token: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // const campaignsData = data?.campaigns || [];
      const campaignsData =
        (data?.campaigns || []).filter(
          (campaign) => campaign.status === "active"
        );

        const totalCampaigns = data.campaigns.length;
        // console.log("length of campaign.....", totalCampaigns)
        setTotalCampaignslength(totalCampaigns);
      setCampaigns(campaignsData);
      setFilteredCampaigns(campaignsData);
      setStats(prev => ({
        ...prev,
        activeCampaigns: campaignsData.length,
      }));

      console.log("Fetched campaigns:", campaignsData);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setCampaigns([]);
      setFilteredCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  //  ----------------
  const handleSaveCampaign = async (newCampaignData) => {
    const newCampaign = {
      name: newCampaignData.campaignName,
      postTitle: newCampaignData.selectedPost?.title || "",
      budget: newCampaignData.budget,
      schedule: newCampaignData.schedule,
      audience: `${newCampaignData.location}, ${newCampaignData.age}, ${newCampaignData.interests}`,
      status: newCampaignData.status || "draft",
      platform: "Facebook/Instagram",
      createdAt: new Date().toLocaleDateString(),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns`,
        {
          campaign: {
            business_profile_id: newCampaignData.business_profile_id,
            title: newCampaignData.campaignName,
            budget: newCampaignData.budget,
            schedule: newCampaignData.schedule,
            status: newCampaignData.status,
            platform: "facebook",
            // audience: {
            //   location: newCampaignData.location,
            //   age: newCampaignData.age,
            //   interests: newCampaignData.interests,
            // },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // fetchCampaigns()
      console.log("Campaign created:", response.data);
    } catch (error) {
      console.error(
        "Create campaign error:",
        error.response?.data || error.message
      );
    } finally {
      setShowCreateModal(false);
    }

  };

  const getRecentPosts = () => {
    const filtered = posts.filter((p) =>
      p.title?.toLowerCase().includes(searchTerm) ||
      p.platform?.toLowerCase().includes(searchTerm)
    )
    return filtered.sort((a, b) => b.id - a.id).slice(0, 2)
  }
  const calculateStats = (postsData, campaignsData) => {
    const totalPosts = postsData.length

    const totalReach = postsData.reduce((sum, post) => {
      const views = parseInt(post.views) || Math.floor(Math.random() * 5000) + 500
      return sum + views
    }, 0)

    const totalEngagements = postsData.reduce((sum, post) => {
      const likes = parseInt(post.likes) || Math.floor(Math.random() * 200) + 10
      const comments = parseInt(post.comments) || Math.floor(Math.random() * 50) + 5
      return sum + likes + comments
    }, 0)

    const engagementRate = totalReach > 0
      ? ((totalEngagements / totalReach) * 100).toFixed(1)
      : 0

    setStats((prev) => ({
    ...prev, 
    totalPosts,
    totalReach: formatNumber(totalReach),
    engagementRate: `${engagementRate}%`,
  }));
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      router.push('/Login')
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout error");
    }
  };

  // const getRecentPosts = () => posts.sort((a, b) => b.id - a.id).slice(0, 2)

  return (
    <div className='flex h-screen' style={{ background: '#f2f0fe' }}>
      <SideBar />
      <div className='flex-1 overflow-auto'>
        <div className='flex items-center justify-between px-12 pt-8'>
          <Header title='Dashboard' onSearch={handleSearch} />
          <button
            onClick={handleLogout}
            className='text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-colors'
          >
            Logout
          </button>
        </div>

        <div className='px-12 py-8'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <StatsCard
              title='Total Posts'
              value={stats.totalPosts}
              change='+12%'
              icon={<FileText className='w-6 h-6 text-indigo-600' />}
              bgColor='bg-indigo-50'
            />
            <StatsCard
              title='Active Campaigns'
              value={stats.activeCampaigns}
              change='+3'
              icon={<Megaphone className='w-6 h-6 text-pink-600' />}
              bgColor='bg-pink-50'
            />
            <StatsCard
              title='Total Reach'
              value={stats.totalReach}
              change='+18%'
              icon={<Eye className='w-6 h-6 text-green-600' />}
              bgColor='bg-green-50'
            />
            <StatsCard
              title='Engagement Rate'
              value={stats.engagementRate}
              change='+0.5%'
              icon={<TrendingUp className='w-6 h-6 text-blue-600' />}
              bgColor='bg-blue-50'
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              {/* Recent Posts */}
              <div className='bg-white shadow-sm'>
                <div className='p-6 flex items-center justify-between'>
                  <h2 className='text-xl font-semibold text-gray-800'>Recent Posts</h2>
                  <Link href='/Posts'>
                    <button
                      className='px-4 py-2 hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm'
                      style={{ backgroundColor: '#bbb5ed', color: 'black' }}
                    >
                      <Plus className='w-4 h-4' />
                      New Post
                    </button>
                  </Link>
                </div>
                <div className='divide-y'>
                  {getRecentPosts().length > 0 ? (
                    getRecentPosts().map((post) => (
                      <PostItem
                        key={post.id}
                        title={post.title}
                        platform={post.platform || 'Draft'}
                        date={post.createdAt || 'Recently'}
                        views={post.views || Math.floor(Math.random() * 5000) + 500}
                        likes={post.likes || Math.floor(Math.random() * 200) + 10}
                        comments={post.comments || Math.floor(Math.random() * 50) + 5}
                        status={post.status || 'Draft'}
                      />
                    ))
                  ) : (
                    <div className='p-8 text-center text-gray-500'>
                      <p>No posts yet. Create your first post!</p>
                    </div>
                  )}
                </div>
                <div className='p-4 bg-gray-50 rounded-b-xl'>
                  <Link href='/Posts'>
                    <button className='text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1'>
                      View All Posts
                      <ChevronRight className='w-4 h-4' />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Analytics Overview */}
              <div className='bg-white shadow-sm'>
                <div className='p-6 flex items-center justify-between'>
                  <h2 className='text-xl font-semibold text-gray-800'>Analytics Overview</h2>
                  <div className='flex items-center gap-2'>
                    <button className='px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50 transition-colors'>
                      Last 7 days
                    </button>
                    <button className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'>
                      <Download className='w-4 h-4 text-gray-600' />
                    </button>
                  </div>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-2 gap-6 mb-6'>
                    <MetricCard title='Total Impressions' value={stats.totalReach} trend='+12.5%' />
                    <MetricCard title='Total Posts' value={stats.totalPosts} trend='+8.3%' />
                    <MetricCard title='Engagement' value={stats.engagementRate} trend='+15.2%' />
                    <MetricCard title='Campaigns' value={totalCampaignslength} trend='+5.6%' />
                  </div>
                  <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-4'>Engagement Timeline</h3>
                    <div className='flex items-end justify-between h-32 gap-2'>
                      {[65, 78, 85, 72, 90, 88, 95].map((height, i) => (
                        <div
                          key={i}
                          className='flex-1 rounded-t-lg hover:bg-indigo-600 transition-colors cursor-pointer'
                          style={{ height: `${height}%`, backgroundColor: '#bbb5ed' }}
                        />
                      ))}
                    </div>
                    <div className='flex justify-between mt-2 text-xs text-gray-500'>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              {/* Active Campaigns */}
              <div className='bg-white shadow-sm'>
                <div className='p-6 flex items-center justify-between'>
                  <h2 className='text-lg font-semibold text-gray-800'>Active Campaigns</h2>
                  <Link href='/campaign'>
                    <button className='text-sm hover:text-indigo-700' style={{ color: '#bbb5ed', fontWeight: 600 }}>
                      View All
                    </button>
                  </Link>
                </div>
                {/* <div className='p-4 space-y-4'>
                  {campaigns.length < 0 ? (
                    campaigns.slice(0, 3).map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        name={campaign.name}
                        posts={campaign.postTitle || 'N/A'}
                        reach={campaign.budget || '0'}
                        status={campaign.status.toLowerCase()}
                        progress={
                          campaign.status === 'Running' ? 75 :
                            campaign.status === 'Scheduled' ? 30 : 0
                        }
                      />
                    ))
                  ) : (
                    <div className='p-4 text-center text-gray-500'>
                      <p className='text-sm'>No campaigns yet. Create your first campaign!</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg"
                        style={{ backgroundColor: "#7c3aed" }}
                      >
                        Create Campaign
                      </button>
                    </div>
                  )}
                </div> */}

                {/* {(campaigns.length > 0 && campaigns.status=== "active") ? ( */}
                {(campaigns.length > 0) ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Campaign / Post
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredCampaigns.slice(0, 5).map((camp) => {
                          const campStatus =
                            statusMap[camp.status] || statusMap["draft"];
                          const StatusIcon = campStatus.icon;
                          return (
                            <tr
                              key={camp.id}
                              className="hover:bg-purple-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap max-w-sm">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {camp.title}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  Post: {camp.postTitle}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${campStatus.bg} ${campStatus.color}`}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1.5" />
                                  {camp.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='p-4 text-center text-gray-500'>
                    <p className='text-sm'>No campaigns yet. Create your first campaign!</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg"
                      style={{ backgroundColor: "#7c3aed" }}
                    >
                      Create Campaign
                    </button>
                  </div>
                )}


                {/* <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campaign / Post
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredCampaigns.map((camp) => {
                        const campStatus =
                          statusMap[camp.status] || statusMap["draft"];
                        const StatusIcon = campStatus.icon;
                        return (
                          <tr
                            key={camp.id}
                            className="hover:bg-purple-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap max-w-sm">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {camp.title}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                Post: {camp.postTitle}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${campStatus.bg} ${campStatus.color}`}
                              >
                                <StatusIcon className="w-3 h-3 mr-1.5" />
                                {camp.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div> */}




              </div>

              {/* Quick Actions */}
              <div className='shadow-sm' style={{ backgroundColor: '#bbb5ed' }}>
                <div className='p-6'>
                  <h2 className='text-lg font-semibold text-gray-800'>Quick Actions</h2>
                </div>
                <div className='p-4 space-y-2'>
                  <QuickActionButton icon={<Plus className='w-5 h-5' />} label='Create New Post' href='/Posts' />
                  <QuickActionButton icon={<Megaphone className='w-5 h-5' />} label='Start Campaign' href='/Campaign' />
                  <QuickActionButton icon={<BarChart2 className='w-5 h-5' />} label='View Reports' href='/Analytics' />
                  <QuickActionButton icon={<Calendar className='w-5 h-5' />} label='Schedule Posts' href='/Posts' />
                  <QuickActionButton icon={<Settings className='w-5 h-5' />} label='Settings' href='/Settings' />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white shadow-sm mt-6'>
            <div className='p-6'>
              <h2 className='text-xl font-semibold text-gray-800'>Recent Activity</h2>
            </div>
            <div className='divide-y'>
              {[
                ...posts.slice(0, 2).map((post) => ({
                  action: `Post ${post.status || 'created'}`,
                  description: `${post.title} on ${post.platform || 'platform'}`,
                  time: post.createdAt || 'Recently',
                  icon: <FileText className='w-5 h-5 text-indigo-600' />,
                  key: `post-${post.id}`
                })),
                ...campaigns.slice(0, 1).map((campaign) => ({
                  action: `Campaign ${campaign.status}`,
                  description: `${campaign.name} with budget ${campaign.budget}`,
                  time: campaign.createdAt || 'Recently',
                  icon: <Megaphone className='w-5 h-5 text-pink-600' />,
                  key: `campaign-${campaign.id}`
                }))
              ].map((activity) => (
                <ActivityItem
                  key={activity.key}
                  action={activity.action}
                  description={activity.description}
                  time={activity.time}
                  icon={activity.icon}
                />
              ))}
              {posts.length === 0 && campaigns.length === 0 && (
                <div className='p-8 text-center text-gray-500'>
                  <p>No recent activity. Start creating posts and campaigns!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveCampaign}
          // campaignData={campaignToEdit}
          showModal
        />
      )}
    </div>
  )
}

function StatsCard({ title, value, change, icon, bgColor }) {
  const isPositive = change.startsWith('+')
  return (
    <div className='bg-white shadow-sm p-6 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm text-gray-500 mb-1'>{title}</p>
          <h3 className='text-3xl font-bold text-gray-800 mb-2'>{value}</h3>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last week
          </span>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  )
}

function PostItem({ title, platform, date, views, likes, comments, status }) {
  return (
    <div className='p-4 hover:bg-gray-50 transition-colors'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <h3 className='font-semibold text-gray-800'>{title}</h3>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${status === 'Active' || status === 'published'
                ? 'bg-green-100 text-green-700'
                : status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
                }`}
            >
              {status}
            </span>
          </div>
          <p className='text-sm text-gray-500'>{platform} • {date}</p>
          <div className='flex items-center gap-4 mt-2 text-sm text-gray-600'>
            <span className='flex items-center gap-1'>
              <Eye className='w-4 h-4' /> {views}
            </span>
            <span className='flex items-center gap-1'>
              <Heart className='w-4 h-4' /> {likes}
            </span>
            <span className='flex items-center gap-1'>
              <MessageCircle className='w-4 h-4' /> {comments}
            </span>
          </div>
        </div>
        <button className='p-2 hover:bg-gray-100 rounded-lg'>
          <MoreVertical className='w-4 h-4 text-gray-600' />
        </button>
      </div>
    </div>
  )
}

function MetricCard({ title, value, trend }) {
  return (
    <div className='bg-gray-50 rounded-lg p-4'>
      <p className='text-sm text-gray-600 mb-1'>{title}</p>
      <div className='flex items-end justify-between'>
        <h4 className='text-2xl font-bold text-gray-800'>{value}</h4>
        <span className='text-sm font-medium text-green-600'>{trend}</span>
      </div>
    </div>
  )
}

function CampaignCard({ name, posts, reach, status, progress }) {
  return (
    <div className='rounded-lg p-4 hover:shadow-sm transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <div>
          <h3 className='font-semibold text-gray-800'>{name}</h3>
          <p className='text-sm text-gray-500'>{posts} • ${reach}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${status === 'running' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}
        >
          {status}
        </span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className='h-2 rounded-full'
          style={{ width: `${progress}%`, backgroundColor: '#bbb5ed' }}
        />
      </div>
      <p className='text-xs text-gray-500 mt-1'>{progress}% complete</p>
    </div>
  )
}

function QuickActionButton({ icon, label, href }) {
  return (
    <Link href={href || '#'} passHref>
      <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left'>
        <div className='text-indigo-600'>{icon}</div>
        <span className='text-sm font-medium text-gray-700'>{label}</span>
      </button>
    </Link>
  )
}

function ActivityItem({ action, description, time, icon }) {
  return (
    <div className='p-4 hover:bg-gray-50 transition-colors'>
      <div className='flex items-start gap-3'>
        <div className='bg-gray-100 p-2 rounded-lg'>{icon}</div>
        <div className='flex-1'>
          <h4 className='font-medium text-gray-800'>{action}</h4>
          <p className='text-sm text-gray-600'>{description}</p>
          <p className='text-xs text-gray-400 mt-1'>{time}</p>
        </div>
      </div>
    </div>
  )
}