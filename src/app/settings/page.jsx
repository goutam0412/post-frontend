'use client'
import React, { useState } from 'react'
import SideBar from '@/components/SideBar'
import Header from '@/components/Header'
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Shield,
  CreditCard,
  Smartphone,
  Eye,
  EyeOff,
  Check,
  X,
  Camera,
  Save,
  Trash2,
  LogOut,
  AlertCircle,
} from 'lucide-react'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const sections = [
    { id: 'profile', label: 'Profile', icon: <User className='w-5 h-5' /> },
    { id: 'account', label: 'Account', icon: <Lock className='w-5 h-5' /> },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className='w-5 h-5' />,
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: <Shield className='w-5 h-5' />,
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <CreditCard className='w-5 h-5' />,
    },
  ]

  return (
    <div className='flex h-screen' style={{ background: '#f2f0fe' }}>
      <SideBar />
      
      <div className='flex-1 overflow-auto'>
        <Header title='Settings' />

        <div className='p-8'>
          <div className='flex gap-6'>
            {/* Settings Navigation Sidebar */}
            <div className='w-64 flex-shrink-0'>
              <div className='bg-white rounded-xl shadow-sm p-4'>
                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3'>
                  Settings
                </h3>
                <nav className='space-y-1'>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === section.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {section.icon}
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className='flex-1'>
              {activeSection === 'profile' && (
                <div className='space-y-6'>
                  <div className='bg-white rounded-xl shadow-sm p-6'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>
                      Profile Picture
                    </h2>
                    <div className='flex items-center gap-6'>
                      <div className='relative'>
                        <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold'>
                          JD
                        </div>
                        <button className='absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200'>
                          <Camera className='w-4 h-4 text-gray-600' />
                        </button>
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-800 mb-1'>
                          Upload new photo
                        </h3>
                        <p className='text-sm text-gray-500 mb-3'>
                          JPG, PNG or GIF. Max size 2MB
                        </p>
                        <div className='flex gap-2'>
                          <button
                            className='px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:shadow-lg'
                            style={{ backgroundColor: '#7c3aed' }}
                          >
                            Upload
                          </button>
                          <button className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white rounded-xl shadow-sm p-6'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>
                      Personal Information
                    </h2>
                    <div className='grid grid-cols-2 gap-6'>
                      <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                          First Name
                        </label>
                        <input
                          type='text'
                          defaultValue='John'
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                          Last Name
                        </label>
                        <input
                          type='text'
                          defaultValue='Doe'
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        />
                      </div>
                      <div className='col-span-2'>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                          Email Address
                        </label>
                        <input
                          type='email'
                          defaultValue='john.doe@example.com'
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        />
                      </div>
                      <div className='col-span-2'>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                          Bio
                        </label>
                        <textarea
                          rows={4}
                          defaultValue='Digital marketing professional passionate about creating engaging content and building strong brand presence.'
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none'
                        />
                      </div>
                    </div>
                    <div className='flex justify-end mt-6'>
                      <button
                        className='px-6 py-3 text-white font-medium rounded-lg transition-all hover:shadow-lg flex items-center gap-2'
                        style={{ backgroundColor: '#7c3aed' }}
                      >
                        <Save className='w-4 h-4' />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'account' && (
                <div className='space-y-6'>
                  <div className='bg-white rounded-xl shadow-sm p-6'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>
                      Change Password
                    </h2>
                    <div className='space-y-4'>
                      <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                          Current Password
                        </label>
                        <input
                          type='password'
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                          New Password
                        </label>
                        <div className='relative'>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className='w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                          >
                            {showPassword ? (
                              <EyeOff className='w-5 h-5' />
                            ) : (
                              <Eye className='w-5 h-5' />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-700 mb-2 block'>
                          Confirm New Password
                        </label>
                        <input
                          type='password'
                          className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        />
                      </div>
                    </div>
                    <div className='flex justify-end mt-6'>
                      <button
                        className='px-6 py-3 text-white font-medium rounded-lg transition-all hover:shadow-lg'
                        style={{ backgroundColor: '#7c3aed' }}
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className='bg-white rounded-xl shadow-sm p-6'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>
                      Connected Accounts
                    </h2>
                    <div className='space-y-4'>
                      {[
                        {
                          name: 'Google',
                          connected: true,
                          email: 'john.doe@gmail.com',
                        },
                        {
                          name: 'Facebook',
                          connected: true,
                          email: 'Connected',
                        },
                        { name: 'Twitter', connected: false, email: null },
                        {
                          name: 'LinkedIn',
                          connected: true,
                          email: 'john-doe',
                        },
                      ].map((account, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
                        >
                          <div className='flex items-center gap-4'>
                            <Globe className='w-5 h-5 text-gray-400' />
                            <div>
                              <p className='font-medium text-gray-800'>
                                {account.name}
                              </p>
                              {account.connected && (
                                <p className='text-sm text-gray-500'>
                                  {account.email}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              account.connected
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                          >
                            {account.connected ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className='bg-white rounded-xl shadow-sm p-6'>
                  <h2 className='text-xl font-semibold text-gray-800 mb-6'>
                    Notification Preferences
                  </h2>
                  <div className='space-y-6'>
                    <NotificationToggle
                      title='Email Notifications'
                      description='Receive email updates about your campaigns and posts'
                      enabled={emailNotifications}
                      onChange={setEmailNotifications}
                    />
                    <NotificationToggle
                      title='Push Notifications'
                      description='Get push notifications on your devices'
                      enabled={pushNotifications}
                      onChange={setPushNotifications}
                    />
                    <NotificationToggle
                      title='Marketing Emails'
                      description='Receive emails about new features and updates'
                      enabled={marketingEmails}
                      onChange={setMarketingEmails}
                    />

                    <div className='pt-6 border-t border-gray-200'>
                      <h3 className='font-semibold text-gray-800 mb-4'>
                        Notification Types
                      </h3>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                          <input
                            type='checkbox'
                            defaultChecked
                            className='w-4 h-4 text-indigo-600 rounded'
                          />
                          <div>
                            <p className='text-sm font-medium text-gray-700'>
                              Campaign Updates
                            </p>
                            <p className='text-xs text-gray-500'>
                              Performance alerts and milestones
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <input
                            type='checkbox'
                            defaultChecked
                            className='w-4 h-4 text-indigo-600 rounded'
                          />
                          <div>
                            <p className='text-sm font-medium text-gray-700'>
                              Post Engagement
                            </p>
                            <p className='text-xs text-gray-500'>
                              Likes, comments, and shares
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <input
                            type='checkbox'
                            className='w-4 h-4 text-indigo-600 rounded'
                          />
                          <div>
                            <p className='text-sm font-medium text-gray-700'>
                              Weekly Reports
                            </p>
                            <p className='text-xs text-gray-500'>
                              Summary of your weekly performance
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
                  <Shield className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                    Privacy & Security Settings
                  </h3>
                  <p className='text-gray-600'>
                    Advanced privacy controls coming soon
                  </p>
                </div>
              )}

              {activeSection === 'billing' && (
                <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
                  <CreditCard className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                    Billing & Subscription
                  </h3>
                  <p className='text-gray-600'>
                    Manage your subscription and payment methods
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationToggle({ title, description, enabled, onChange }) {
  return (
    <div className='flex items-start justify-between p-4 border border-gray-200 rounded-lg'>
      <div className='flex-1'>
        <p className='font-medium text-gray-800 mb-1'>{title}</p>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 flex-shrink-0 ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}