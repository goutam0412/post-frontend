'use client'
import React from 'react'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  FileText,
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const links = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'My Posts', icon: LayoutDashboard, href: '/posts' },
  { label: 'My Campaigns', icon: Users, href: '/campaign' },
  { label: 'Analytics Dashboard', icon: UserPlus, href: '/analytics' },
  { label: 'Account Settings', icon: Settings, href: '/settings' },
]

export default function SideBar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className='w-72 bg-white shadow-sm flex flex-col'>
      <div className='p-6'>
        <div className='flex items-center gap-2'>
          <FileText style={{ color: '#988df4' }} className='w-5 h-5' />
          <span className='text-lg font-semibold text-gray-700'>Posts</span>
        </div>
      </div>

      <nav className='flex-1 px-4'>
        <div
          className='space-y-2'
          style={{ display: 'grid', gap: '10px', marginTop: '12px' }}
        >
          {links.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href

            return (
              <div
                key={label}
                onClick={() => router.push(href)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer rounded-r transition-all duration-200
                  ${
                    isActive
                      ? 'border-r-4 text-black bg-transparent'
                      : 'border-r-4 border-transparent text-gray-400 hover:text-black'
                  }`}
                style={{
                  borderRightColor: isActive ? '#988df4' : 'transparent',
                }}
              >
                <div className='flex items-center gap-3'>
                  <Icon
                    className='w-5 h-5'
                    style={{ color: isActive ? '#988df4' : undefined }}
                  />
                  <span className='font-semibold'>{label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
