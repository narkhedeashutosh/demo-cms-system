'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Asset } from '@/types'
import { formatFileSize, formatDate } from '@/lib/utils'
import {
  RotateCcw,
  Trash2,
  Film,
  Image,
  Music,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'

export default function AssetRestorePage() {
  const [deletedAssets, setDeletedAssets] = useState<Asset[]>([])
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRestoring, setIsRestoring] = useState(false)

  useEffect(() => {
    // Mock data - in a real app, this would fetch deleted assets from an API
    const mockDeletedAssets: Asset[] = [
      {
        id: '1',
        filename: 'old-presentation.mp4',
        originalName: 'Old Presentation Video.mp4',
        fileType: 'video',
        mimeType: 'video/mp4',
        fileSize: 85000000,
        duration: 300,
        width: 1920,
        height: 1080,
        bitrate: 3000,
        codec: 'H.264',
        frameRate: 30,
        status: 'deleted',
        tags: [
          { id: '1', name: 'Old', color: 'gray', category: 'Status', createdAt: new Date() }
        ],
        metadata: {},
        subtitles: [],
        uploadedBy: 'john@example.com',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        downloadUrl: '/api/assets/1/download',
        thumbnailUrl: '/api/assets/1/thumbnail',
        previewUrl: '/api/assets/1/preview',
      },
      {
        id: '2',
        filename: 'temp-image.png',
        originalName: 'Temporary Image.png',
        fileType: 'image',
        mimeType: 'image/png',
        fileSize: 1200000,
        width: 800,
        height: 600,
        status: 'deleted',
        tags: [],
        metadata: {},
        subtitles: [],
        uploadedBy: 'jane@example.com',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deletedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        downloadUrl: '/api/assets/2/download',
        thumbnailUrl: '/api/assets/2/thumbnail',
      },
      {
        id: '3',
        filename: 'test-audio.mp3',
        originalName: 'Test Audio File.mp3',
        fileType: 'audio',
        mimeType: 'audio/mpeg',
        fileSize: 15000000,
        duration: 180,
        bitrate: 128,
        codec: 'MP3',
        sampleRate: 44100,
        channels: 2,
        status: 'deleted',
        tags: [
          { id: '2', name: 'Test', color: 'yellow', category: 'Type', createdAt: new Date() }
        ],
        metadata: {},
        subtitles: [],
        uploadedBy: 'bob@example.com',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        deletedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        downloadUrl: '/api/assets/3/download',
      },
    ]

    setTimeout(() => {
      setDeletedAssets(mockDeletedAssets)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'video':
        return <Film className="h-5 w-5 text-blue-500" />
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />
      case 'audio':
        return <Music className="h-5 w-5 text-purple-500" />
      case 'document':
        return <FileText className="h-5 w-5 text-gray-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    )
  }

  const handleSelectAll = () => {
    setSelectedAssets(
      selectedAssets.length === deletedAssets.length
        ? []
        : deletedAssets.map(asset => asset.id)
    )
  }

  const handleRestoreSelected = async () => {
    if (selectedAssets.length === 0) return

    setIsRestoring(true)
    
    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Remove restored assets from deleted list
    setDeletedAssets(prev => prev.filter(asset => !selectedAssets.includes(asset.id)))
    setSelectedAssets([])
    setIsRestoring(false)
  }

  const handlePermanentDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to permanently delete this asset? This action cannot be undone.')) {
      return
    }

    // Simulate permanent deletion
    setDeletedAssets(prev => prev.filter(asset => asset.id !== assetId))
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Restore</h1>
          <p className="text-gray-600">Restore or permanently delete assets from the trash</p>
        </div>

        {/* Actions */}
        {deletedAssets.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    onClick={handleSelectAll}
                  >
                    {selectedAssets.length === deletedAssets.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  {selectedAssets.length > 0 && (
                    <Button
                      onClick={handleRestoreSelected}
                      loading={isRestoring}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore Selected ({selectedAssets.length})
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {deletedAssets.length} deleted asset{deletedAssets.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deleted Assets List */}
        {deletedAssets.length > 0 ? (
          <div className="space-y-4">
            {deletedAssets.map((asset) => (
              <Card key={asset.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => handleSelectAsset(asset.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div className="flex-shrink-0">
                      {getFileTypeIcon(asset.fileType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {asset.originalName}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Deleted
                        </span>
                      </div>
                      
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(asset.fileSize)}</span>
                        {asset.duration && (
                          <span>{Math.floor(asset.duration / 60)}:{(asset.duration % 60).toString().padStart(2, '0')}</span>
                        )}
                        <span>Uploaded by {asset.uploadedBy}</span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Deleted {getTimeAgo(asset.deletedAt!)}
                        </div>
                        <div className="flex items-center">
                          <span>Uploaded {formatDate(asset.uploadedAt)}</span>
                        </div>
                      </div>

                      {asset.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {asset.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectAsset(asset.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handlePermanentDelete(asset.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Forever
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted assets</h3>
              <p className="text-gray-500">
                There are no assets in the trash. Deleted assets will appear here and can be restored within 30 days.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Deleted assets are kept in the trash for 30 days before being permanently removed</p>
              <p>• Restored assets will be available in your asset library immediately</p>
              <p>• Permanently deleted assets cannot be recovered</p>
              <p>• Storage space is not freed until assets are permanently deleted</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
