'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Asset, Tag } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  Play,
  Pause,
  Tag as TagIcon,
  Plus,
  X,
  Film,
  Image,
  Music,
  FileText,
  Clock,
  Check,
} from 'lucide-react'
import AdvancedVideoPlayer from '@/components/player/AdvancedVideoPlayer'

export default function AssetTaggingPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [newTagName, setNewTagName] = useState('')
  const [newTagCategory, setNewTagCategory] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6')
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [showAddTag, setShowAddTag] = useState(false)

  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#F97316', // orange
    '#06B6D4', // cyan
    '#84CC16', // lime
  ]

  const categories = [
    'Department',
    'Type',
    'Content',
    'Status',
    'Priority',
    'Location',
    'Project',
    'Custom'
  ]

  useEffect(() => {
    // Mock data
    const mockAssets: Asset[] = [
      {
        id: '1',
        filename: 'product-demo.mp4',
        originalName: 'Product Demo Video.mp4',
        fileType: 'video',
        mimeType: 'video/mp4',
        fileSize: 125000000,
        duration: 120,
        width: 1920,
        height: 1080,
        bitrate: 5000,
        codec: 'H.264',
        frameRate: 30,
        status: 'ready',
        tags: [
          { id: '1', name: 'Marketing', color: '#3B82F6', category: 'Department', createdAt: new Date() },
          { id: '2', name: 'Product', color: '#10B981', category: 'Type', createdAt: new Date() }
        ],
        metadata: {},
        subtitles: [],
        uploadedBy: 'john@example.com',
        uploadedAt: new Date(),
        updatedAt: new Date(),
        downloadUrl: '/api/assets/1/download',
        thumbnailUrl: '/api/assets/1/thumbnail',
        previewUrl: 'https://www.youtube.com/watch?v=E-ZrSefNsJI&list=RDE-ZrSefNsJI&start_radio=1',
      },
      {
        id: '2',
        filename: 'company-logo.png',
        originalName: 'Company Logo.png',
        fileType: 'image',
        mimeType: 'image/png',
        fileSize: 2500000,
        width: 512,
        height: 512,
        status: 'ready',
        tags: [
          { id: '3', name: 'Branding', color: '#8B5CF6', category: 'Type', createdAt: new Date() }
        ],
        metadata: {},
        subtitles: [],
        uploadedBy: 'jane@example.com',
        uploadedAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        downloadUrl: '/api/assets/2/download',
        thumbnailUrl: '/api/assets/2/thumbnail',
      },
    ]

    const mockTags: Tag[] = [
      { id: '1', name: 'Marketing', color: '#3B82F6', category: 'Department', createdAt: new Date() },
      { id: '2', name: 'Product', color: '#10B981', category: 'Type', createdAt: new Date() },
      { id: '3', name: 'Branding', color: '#8B5CF6', category: 'Type', createdAt: new Date() },
      { id: '4', name: 'High Priority', color: '#EF4444', category: 'Priority', createdAt: new Date() },
      { id: '5', name: 'Draft', color: '#F59E0B', category: 'Status', createdAt: new Date() },
      { id: '6', name: 'Final', color: '#10B981', category: 'Status', createdAt: new Date() },
    ]

    setTimeout(() => {
      setAssets(mockAssets)
      setSelectedAsset(mockAssets[0])
      setAvailableTags(mockTags)
      setIsLoading(false)
    }, 1000)
  }, [])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const addTagToAsset = (tag: Tag) => {
    if (!selectedAsset) return

    const updatedAsset = {
      ...selectedAsset,
      tags: [...selectedAsset.tags, tag]
    }

    setSelectedAsset(updatedAsset)
    setAssets(prev => prev.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset))
  }

  const removeTagFromAsset = (tagId: string) => {
    if (!selectedAsset) return

    const updatedAsset = {
      ...selectedAsset,
      tags: selectedAsset.tags.filter(tag => tag.id !== tagId)
    }

    setSelectedAsset(updatedAsset)
    setAssets(prev => prev.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset))
  }

  const createNewTag = () => {
    if (!newTagName.trim()) return

    const newTag: Tag = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTagName,
      color: newTagColor,
      category: newTagCategory || 'Custom',
      createdAt: new Date()
    }

    setAvailableTags(prev => [...prev, newTag])
    addTagToAsset(newTag)
    setNewTagName('')
    setNewTagCategory('')
    setNewTagColor('#3B82F6')
    setShowAddTag(false)
  }

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

  const isTagApplied = (tagId: string) => {
    return selectedAsset?.tags.some(tag => tag.id === tagId) || false
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Tagging</h1>
          <p className="text-gray-600">Add and manage metadata tags for your media assets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedAsset?.id === asset.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getFileTypeIcon(asset.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {asset.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(asset.fileSize)}
                            {asset.duration && ` • ${formatDuration(asset.duration)}`}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {asset.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                                style={{ backgroundColor: tag.color + '20', color: tag.color }}
                              >
                                {tag.name}
                              </span>
                            ))}
                            {asset.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{asset.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tagging Interface */}
          <div className="lg:col-span-2 space-y-6">
            {selectedAsset && (
              <>
                {/* Media Player */}
                <Card>
                  <CardContent className="p-6">
                    <AdvancedVideoPlayer
                      src={selectedAsset.previewUrl}
                      onTimeUpdate={(time) => setCurrentTime(time)}
                      className="w-full aspect-video"
                    />
                  </CardContent>
                </Card>

                {/* Current Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Current Tags</span>
                      <Button
                        size="sm"
                        onClick={() => setShowAddTag(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tag
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAsset.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedAsset.tags.map((tag) => (
                          <div
                            key={tag.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          >
                            <TagIcon className="h-4 w-4 mr-1" />
                            {tag.name}
                            <button
                              onClick={() => removeTagFromAsset(tag.id)}
                              className="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No tags applied to this asset</p>
                    )}
                  </CardContent>
                </Card>

                {/* Available Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.map((category) => {
                        const categoryTags = availableTags.filter(tag => tag.category === category)
                        if (categoryTags.length === 0) return null

                        return (
                          <div key={category}>
                            <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                            <div className="flex flex-wrap gap-2">
                              {categoryTags.map((tag) => (
                                <button
                                  key={tag.id}
                                  onClick={() => isTagApplied(tag.id) ? removeTagFromAsset(tag.id) : addTagToAsset(tag)}
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    isTagApplied(tag.id)
                                      ? 'ring-2 ring-blue-500'
                                      : 'hover:bg-gray-100'
                                  }`}
                                  style={{ 
                                    backgroundColor: isTagApplied(tag.id) ? tag.color + '20' : 'transparent',
                                    color: isTagApplied(tag.id) ? tag.color : '#374151'
                                  }}
                                >
                                  <TagIcon className="h-4 w-4 mr-1" />
                                  {tag.name}
                                  {isTagApplied(tag.id) && (
                                    <Check className="h-3 w-3 ml-1" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Add New Tag Modal */}
                {showAddTag && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Tag</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tag Name
                          </label>
                          <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter tag name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={newTagCategory}
                            onChange={(e) => setNewTagCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <div className="flex space-x-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => setNewTagColor(color)}
                                className={`w-8 h-8 rounded-full border-2 ${
                                  newTagColor === color ? 'border-gray-900' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            onClick={() => setShowAddTag(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={createNewTag}
                            disabled={!newTagName.trim()}
                          >
                            Create Tag
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
