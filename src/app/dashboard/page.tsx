'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DashboardStats } from '@/types'
import { formatFileSize, formatDate } from '@/lib/utils'
import {
  Film,
  Upload,
  Clock,
  Database,
  BarChart3,
  AlertTriangle,
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentAssets, setRecentAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app, this would fetch from an API
    const mockStats: DashboardStats = {
      totalAssets: 1247,
      totalSize: 2.5 * 1024 * 1024 * 1024 * 1024, // 2.5 TB
      recentUploads: 23,
      processingQueue: 5,
      storageUsed: 1.8 * 1024 * 1024 * 1024 * 1024, // 1.8 TB
      storageLimit: 5 * 1024 * 1024 * 1024 * 1024, // 5 TB
    }

    const mockRecentAssets = [
      { id: '1', name: 'Product Demo Video.mp4', type: 'video', size: 125000000, uploadedAt: new Date() },
      { id: '2', name: 'Company Logo.png', type: 'image', size: 2500000, uploadedAt: new Date(Date.now() - 3600000) },
      { id: '3', name: 'Podcast Episode 1.mp3', type: 'audio', size: 45000000, uploadedAt: new Date(Date.now() - 7200000) },
    ]

    setTimeout(() => {
      setStats(mockStats)
      setRecentAssets(mockRecentAssets)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  const storagePercentage = stats ? (stats.storageUsed / stats.storageLimit) * 100 : 0

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your media assets and system status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Film className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Assets</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalAssets.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Recent Uploads</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.recentUploads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Processing Queue</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.processingQueue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Database className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Storage Used</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatFileSize(stats?.storageUsed || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Used: {formatFileSize(stats?.storageUsed || 0)}</span>
                <span>Total: {formatFileSize(stats?.storageLimit || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    storagePercentage > 80 ? 'bg-red-500' : storagePercentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${storagePercentage}%` }}
                ></div>
              </div>
              {storagePercentage > 80 && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Storage is running low
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssets.map((asset: any) => (
                <div key={asset.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {asset.type === 'video' && <Film className="h-5 w-5 text-blue-500" />}
                      {asset.type === 'image' && <BarChart3 className="h-5 w-5 text-green-500" />}
                      {asset.type === 'audio' && <Upload className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(asset.uploadedAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
