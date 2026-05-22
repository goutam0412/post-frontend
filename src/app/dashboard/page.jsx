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
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import axios from "axios";
import SideBar from '@/components/SideBar'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CreateCampaignModal from "@/components/CreateCampaignModal";
import CreatePostModal from '@/components/CreatePostModal'
import Link from 'next/link'
import toast from 'react-hot-toast'

const statusMap = {
  completed: { icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-200" },
  active: { icon: Clock, color: "text-violet-700", bg: "bg-violet-50 border border-violet-200" },
  draft: { icon: AlertCircle, color: "text-slate-500", bg: "bg-slate-50 border border-slate-200" },
};

export default function ImpozitionsDashboard() {
  const router = useRouter()
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCampaignslength, setTotalCampaignslength] = useState();
  const [totalPostslength, setTotalPostslength] = useState();
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [recentCampaigns, setRecentCampaigns] = useState([]);
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
      calculateStats(loadedPosts)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleSearch = (query) => setSearchTerm(query.toLowerCase())

  const fetchRecentPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`, {
        headers: { Accept: 'application/json', token: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      const formatted = (data.posts || []).slice(-4).map(post => ({
        id: post.id,
        title: post.caption || 'No Caption',
        description: post.hashtags || 'No Hashtags',
        createdAt: post.created_at,
        campaign_id: post.campaign_id,
        ai_score: post.ai_score ?? 0,
      }))
      setTotalPostslength(data.posts.length)
      setPosts(formatted)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecentPosts() }, [])

  const savePost = async (postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'token': `Bearer ${token}` },
        body: JSON.stringify({ post: postData }),
      });
      if (response.ok) {
        fetchRecentPosts();
        toast.success('Post Created Successfully!');
        setShowPostModal(false);
      } else {
        toast.error('Server Error!');
      }
    } catch (err) {
      toast.error('Network Error!')
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const fetchCampaigns = useCallback(async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns`, {
        method: "GET",
        headers: { token: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const campaignsData = (data?.campaigns || []).filter(c => c.status === "active");
      const campaignsArray = Array.isArray(data?.campaigns) ? data.campaigns : [];
      const recent = campaignsArray
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 2)
        .map(c => ({ id: c.id, title: c.title, budget: c.budget, status: c.status, createdAt: c.created_at }));
      setTotalCampaignslength(campaignsArray.length);
      setCampaigns(campaignsData);
      setFilteredCampaigns(campaignsData);
      setRecentCampaigns(recent);
      setStats(prev => ({ ...prev, activeCampaigns: campaignsData.length }));
    } catch (err) {
      setCampaigns([]); setFilteredCampaigns([]);
    } finally { setLoading(false); }
  }, []);

  const handleSaveCampaign = async (newCampaignData) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns`, {
        campaign: {
          business_profile_id: newCampaignData.business_profile_id,
          title: newCampaignData.campaignName,
          budget: newCampaignData.budget,
          schedule: newCampaignData.schedule,
          status: newCampaignData.status,
          platform: "facebook",
        },
      }, { headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.error("Create campaign error:", error.response?.data || error.message);
    } finally { setShowCampaignModal(false); }
  };

  const calculateStats = (postsData) => {
    const totalPosts = postsData.length
    const totalReach = postsData.reduce((sum, post) => sum + (parseInt(post.views) || Math.floor(Math.random() * 5000) + 500), 0)
    const totalEngagements = postsData.reduce((sum, post) => sum + (parseInt(post.likes) || Math.floor(Math.random() * 200) + 10) + (parseInt(post.comments) || Math.floor(Math.random() * 50) + 5), 0)
    const engagementRate = totalReach > 0 ? ((totalEngagements / totalReach) * 100).toFixed(1) : 0
    setStats(prev => ({ ...prev, totalPosts, totalReach: formatNumber(totalReach), engagementRate: `${engagementRate}%` }));
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        .dash-root * { font-family: 'DM Sans', sans-serif; }
        .dash-root h1, .dash-root h2, .dash-root h3, .dash-root .heading { font-family: 'Syne', sans-serif; }

        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(109, 86, 209, 0.12);
        }

        .stat-card {
          background: white;
          border: 1px solid #ede9fe;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          border-radius: 0 16px 0 80px;
          opacity: 0.06;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(109, 86, 209, 0.14); }

        .post-card {
          background: white;
          border: 1px solid #f0eeff;
          border-radius: 14px;
          padding: 18px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .post-card::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #8b5cf6, #c4b5fd);
          border-radius: 3px 0 0 3px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .post-card:hover { border-color: #ddd6fe; box-shadow: 0 6px 20px rgba(109, 86, 209, 0.1); }
        .post-card:hover::after { opacity: 1; }

        .section-card {
          background: white;
          border: 1px solid #ede9fe;
          border-radius: 18px;
          overflow: hidden;
        }

        .bar-item { transition: height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s; }

        .quick-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.8);
          transition: all 0.2s;
          text-align: left; width: 100%;
          cursor: pointer;
        }
        .quick-btn:hover {
          background: white;
          box-shadow: 0 4px 16px rgba(109, 86, 209, 0.15);
          transform: translateX(4px);
        }

        .activity-pill {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px;
          border-radius: 12px;
          background: #faf9ff;
          border: 1px solid #f0eeff;
          transition: all 0.2s;
        }
        .activity-pill:hover { background: #f5f3ff; border-color: #ddd6fe; }

        .badge-ai {
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
          letter-spacing: 0.03em;
        }

        .create-btn {
          background: linear-gradient(135deg, #7c3aed, #9d5cf6);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          display: flex; align-items: center; gap-8px;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
        }
        .create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        }

        .view-all-link {
          color: #7c3aed;
          font-size: 13px;
          font-weight: 600;
          display: flex; align-items: center; gap: 4px;
          text-decoration: none;
          transition: gap 0.2s;
        }
        .view-all-link:hover { gap: 8px; }
      `}</style>

      <div className='dash-root flex h-screen' style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #faf5ff 100%)' }}>
        <SideBar />
        <div className='flex-1 overflow-auto'>
          
          {/* Header */}
          <div className='flex items-center justify-between px-10 pt-8 pb-2'>
            <Header title='Dashboard' onSearch={handleSearch} />
          </div>

          <div className='px-10 py-6 space-y-6'>

            {/* Stats Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {[
                { title: 'Total Posts', value: totalPostslength ?? '—', change: '+12%', icon: FileText, color: '#7c3aed', lightBg: '#f5f3ff' },
                { title: 'Active Campaigns', value: stats.activeCampaigns, change: '+3', icon: Megaphone, color: '#db2777', lightBg: '#fdf2f8' },
                { title: 'Total Reach', value: stats.totalReach || '0', change: '+18%', icon: Eye, color: '#059669', lightBg: '#f0fdf4' },
                { title: 'Engagement Rate', value: stats.engagementRate || '0%', change: '+0.5%', icon: TrendingUp, color: '#0891b2', lightBg: '#ecfeff' },
              ].map(({ title, value, change, icon: Icon, color, lightBg }) => (
                <div key={title} className='stat-card'>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 90, height: 90, borderRadius: '0 16px 0 90px', background: color, opacity: 0.07 }} />
                  <div style={{ background: lightBg, width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, marginBottom: 4 }}>{title}</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: 30, fontWeight: 800, color: '#1e1b4b', fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>{value}</h3>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981', background: '#ecfdf5', padding: '3px 8px', borderRadius: 20 }}>
                      {change}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 6 }}>vs last week</p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              
              {/* Left Column */}
              <div className='lg:col-span-2 space-y-6'>

                {/* Recent Posts */}
                <div className='section-card'>
                  <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f5f3ff' }}>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Recent Posts</h2>
                      <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, marginTop: 2 }}>{posts.length} posts loaded</p>
                    </div>
                    <button className='create-btn' onClick={() => setShowPostModal(true)}>
                      <Plus size={16} /> New Post
                    </button>
                  </div>

                  <div style={{ padding: '20px 24px' }}>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                        <div style={{ width: 32, height: 32, border: '3px solid #ede9fe', borderTopColor: '#7c3aed', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
                        Loading posts...
                      </div>
                    ) : posts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                        <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p>No recent posts yet</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        {posts.map((post) => (
                          <div key={post.id} className='post-card'>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                              <h3 style={{ fontWeight: 600, color: '#1e1b4b', fontSize: 14, lineHeight: 1.4, margin: 0, flex: 1, paddingRight: 8 }} className='truncate'>
                                {post.title}
                              </h3>
                              <span className='badge-ai'>AI {post.ai_score}</span>
                            </div>
                            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {post.description}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: 11, color: '#c4b5fd', fontWeight: 600, background: '#faf5ff', padding: '3px 8px', borderRadius: 6 }}>
                                Campaign #{post.campaign_id}
                              </span>
                              <span style={{ fontSize: 11, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Calendar size={10} />
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '14px 24px', background: '#faf9ff', borderTop: '1px solid #f5f3ff' }}>
                    <Link href='/posts' className='view-all-link'>
                      View All Posts <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Analytics */}
                <div className='section-card'>
                  <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f5f3ff' }}>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Analytics Overview</h2>
                      <p style={{ fontSize: 13, color: '#94a3b8', margin: '2px 0 0' }}>Last 7 days performance</p>
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: '#f5f3ff', border: '1px solid #ede9fe', color: '#7c3aed', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      <Download size={14} /> Export
                    </button>
                  </div>

                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                      {[
                        { title: 'Impressions', value: stats.totalReach, trend: '+12.5%' },
                        { title: 'Total Posts', value: totalPostslength, trend: '+8.3%' },
                        { title: 'Engagement', value: stats.engagementRate, trend: '+15.2%' },
                        { title: 'Campaigns', value: totalCampaignslength, trend: '+5.6%' },
                      ].map(({ title, value, trend }) => (
                        <div key={title} style={{ background: '#faf9ff', border: '1px solid #f0eeff', borderRadius: 12, padding: 16 }}>
                          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{title}</p>
                          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', fontFamily: 'Syne, sans-serif' }}>{value ?? '—'}</span>
                            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                              <ArrowUpRight size={11} />{trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bar Chart */}
                    <div style={{ background: 'linear-gradient(135deg, #faf5ff, #f0f9ff)', borderRadius: 14, padding: '20px 20px 14px', border: '1px solid #ede9fe' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#4c1d95', margin: 0 }}>Engagement Timeline</h3>
                        <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, background: '#ede9fe', padding: '3px 8px', borderRadius: 20 }}>Weekly</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, gap: 6 }}>
                        {[65, 78, 85, 72, 90, 88, 95].map((h, i) => (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                            <div
                              className='bar-item'
                              style={{
                                width: '100%',
                                height: `${h}%`,
                                background: i === 6 ? 'linear-gradient(180deg, #7c3aed, #a78bfa)' : 'linear-gradient(180deg, #c4b5fd, #ddd6fe)',
                                borderRadius: '6px 6px 0 0',
                                opacity: i === 6 ? 1 : 0.7,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                          <span key={d} style={{ fontSize: 10, color: '#94a3b8', flex: 1, textAlign: 'center' }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-6'>

                {/* Active Campaigns */}
                <div className='section-card'>
                  <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f5f3ff' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Active Campaigns</h2>
                    <Link href='/campaign' style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                      View All <ChevronRight size={13} />
                    </Link>
                  </div>

                  {campaigns.length > 0 ? (
                    <div style={{ padding: '8px 0' }}>
                      {filteredCampaigns.slice(0, 5).map((camp) => {
                        const campStatus = statusMap[camp.status] || statusMap["draft"];
                        const StatusIcon = campStatus.icon;
                        return (
                          <div key={camp.id} style={{ padding: '12px 20px', borderBottom: '1px solid #faf5ff', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#faf9ff'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ fontWeight: 600, color: '#1e1b4b', fontSize: 13, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {camp.title}
                            </div>
                            <span className={`inline-flex items-center ${campStatus.bg} ${campStatus.color}`}
                              style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <StatusIcon size={10} /> {camp.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                      <Megaphone size={36} style={{ color: '#ddd6fe', margin: '0 auto 12px' }} />
                      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>No active campaigns yet</p>
                      <button onClick={() => setShowCampaignModal(true)} className='create-btn' style={{ margin: '0 auto' }}>
                        <Plus size={14} /> Create Campaign
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9d5cf6 50%, #c084fc 100%)', borderRadius: 18, padding: '20px', boxShadow: '0 12px 40px rgba(124, 58, 237, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Sparkles size={16} color='#e9d5ff' />
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0 }}>Quick Actions</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { icon: Plus, label: 'Create New Post', href: '/posts' },
                      { icon: Megaphone, label: 'Start Campaign', href: '/campaign' },
                      { icon: BarChart2, label: 'View Reports', href: '/analytics' },
                      { icon: Calendar, label: 'Schedule Posts', href: '/posts' },
                      { icon: Settings, label: 'Settings', href: '/settings' },
                    ].map(({ icon: Icon, label, href }) => (
                      <Link key={label} href={href} passHref style={{ textDecoration: 'none' }}>
                        <div className='quick-btn'>
                          <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={15} color='white' />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{label}</span>
                          <ChevronRight size={13} color='rgba(255,255,255,0.5)' style={{ marginLeft: 'auto' }} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className='section-card'>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f5f3ff' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Recent Activity</h2>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>Latest updates from your posts and campaigns</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                
                {/* Posts Activity */}
                <div style={{ padding: '20px 24px', borderRight: '1px solid #f5f3ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 28, background: '#f5f3ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={14} color='#7c3aed' />
                    </div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', margin: 0 }}>Posts</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {posts.slice(-2).map(post => (
                      <div key={`post-${post.id}`} className='activity-pill'>
                        <div style={{ width: 36, height: 36, background: '#f5f3ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={15} color='#7c3aed' />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: 13, color: '#1e1b4b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.title}
                          </p>
                          <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {posts.length === 0 && <p style={{ fontSize: 13, color: '#cbd5e1' }}>No recent posts</p>}
                  </div>
                </div>

                {/* Campaign Activity */}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 28, background: '#fdf2f8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Megaphone size={14} color='#db2777' />
                    </div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#db2777', margin: 0 }}>Campaigns</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {recentCampaigns.slice(-2).map(c => (
                      <div key={`camp-${c.id}`} className='activity-pill'>
                        <div style={{ width: 36, height: 36, background: '#fdf2f8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Megaphone size={15} color='#db2777' />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: 13, color: '#1e1b4b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.title}
                          </p>
                          <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
                            Budget ₹{c.budget} • {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}
                          </p>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 20,
                          ...( c.status === 'active' ? { background: '#f0fdf4', color: '#059669' } : { background: '#f8fafc', color: '#94a3b8' })
                        }}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                    {recentCampaigns.length === 0 && <p style={{ fontSize: 13, color: '#cbd5e1' }}>No recent campaigns</p>}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {showCampaignModal && (
          <CreateCampaignModal onClose={() => setShowCampaignModal(false)} onSave={handleSaveCampaign} showModal />
        )}
        <CreatePostModal
          showModal={showPostModal}
          closeModal={() => setShowPostModal(false)}
          onSaveSuccess={fetchRecentPosts}
          savePost={savePost}
        />
      </div>
    </>
  )
}