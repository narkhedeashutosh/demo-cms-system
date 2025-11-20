'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Film,
  Upload,
  RotateCcw,
  Play,
  Tag,
  Subtitles,
  Users,
  Search,
  Menu,
  X,
  CheckCircle,
  Package,
  Zap,
  Sparkles,
  Globe,
  Workflow,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'AssetLib', href: '/assets/library', icon: Film },
  { name: 'Ingest', href: '/assets/ingest', icon: Upload },
  { name: 'OnboardReady', href: '/assets/onboard', icon: Play },
  { name: 'AssureQC', href: '/assets/qc', icon: CheckCircle },
  { name: 'MediaReady', href: '/assets/delivery', icon: Package },
  { name: 'EncodeX', href: '/assets/encodex', icon: Zap },
  { name: 'QuickHighlights', href: '/assets/highlights', icon: Sparkles },
  { name: 'LinguaX', href: '/assets/linguax', icon: Globe },
  { name: 'FlowWorks', href: '/assets/flowworks', icon: Workflow },
  { name: 'Restore', href: '/assets/restore', icon: RotateCcw },
  { name: 'Review', href: '/assets/review', icon: Play },
  { name: 'Tagging', href: '/assets/tagging', icon: Tag },
  { name: 'Subtitles', href: '/assets/subtitles', icon: Subtitles },
  { name: 'Permissions', href: '/admin/permissions', icon: Users },
]

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout, hasPermission } = useAuth()
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/assets/library?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const filteredNavigation = navigation.filter(item => {
    if (item.href.includes('/admin/')) {
      return hasPermission('users', 'read')
    }
    return true
  })

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">Media Assets</h1>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Media Assets</h1>
          </div>
          
          {/* Search */}
          <div className="px-4 py-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </form>
          </div>

          <nav className="flex-1 space-y-1 px-2 pb-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          {user && (
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Media Assets</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>
      </div>
    </>
  )
}
