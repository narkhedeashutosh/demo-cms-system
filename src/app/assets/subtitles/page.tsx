'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Asset, Subtitle } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  Play,
  Pause,
  Plus,
  Pencil,
  Trash2,
  Film,
  Image,
  Music,
  FileText,
  Clock,
  Check,
  X,
} from 'lucide-react'

export default function AssetSubtitlesPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null)
  const [showAddSubtitle, setShowAddSubtitle] = useState(false)
  const [newSubtitle, setNewSubtitle] = useState({
    language: '',
    content: '',
    startTime: 0,
    endTime: 0,
  })

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
        tags: [],
        metadata: {},
        subtitles: [
          {
            id: '1',
            language: 'en',
            content: 'Welcome to our product demonstration',
            startTime: 0,
            endTime: 3,
            assetId: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            language: 'en',
            content: 'Today we will be showing you the key features',
            startTime: 3,
            endTime: 7,
            assetId: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '3',
            language: 'en',
            content: 'Let\'s start with the main dashboard',
            startTime: 7,
            endTime: 11,
            assetId: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        uploadedBy: 'john@example.com',
        uploadedAt: new Date(),
        updatedAt: new Date(),
        downloadUrl: '/api/assets/1/download',
        thumbnailUrl: '/api/assets/1/thumbnail',
        previewUrl: '/api/assets/1/preview',
      },
      {
        id: '2',
        filename: 'tutorial-video.mp4',
        originalName: 'Tutorial Video.mp4',
        fileType: 'video',
        mimeType: 'video/mp4',
        fileSize: 85000000,
        duration: 300,
        width: 1920,
        height: 1080,
        bitrate: 3000,
        codec: 'H.264',
        frameRate: 30,
        status: 'ready',
        tags: [],
        metadata: {},
        subtitles: [
          {
            id: '4',
            language: 'es',
            content: 'Bienvenidos al tutorial de nuestro producto',
            startTime: 0,
            endTime: 4,
            assetId: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '5',
            language: 'es',
            content: 'En este video aprenderemos las funciones principales',
            startTime: 4,
            endTime: 8,
            assetId: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        uploadedBy: 'jane@example.com',
        uploadedAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        downloadUrl: '/api/assets/2/download',
        thumbnailUrl: '/api/assets/2/thumbnail',
        previewUrl: '/api/assets/2/preview',
      },
    ]

    setTimeout(() => {
      setAssets(mockAssets)
      setSelectedAsset(mockAssets[0])
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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleAddSubtitle = () => {
    if (!selectedAsset || !newSubtitle.content.trim() || !newSubtitle.language) return

    const subtitle: Subtitle = {
      id: Math.random().toString(36).substr(2, 9),
      language: newSubtitle.language,
      content: newSubtitle.content,
      startTime: newSubtitle.startTime,
      endTime: newSubtitle.endTime,
      assetId: selectedAsset.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedAsset = {
      ...selectedAsset,
      subtitles: [...selectedAsset.subtitles, subtitle]
    }

    setSelectedAsset(updatedAsset)
    setAssets(prev => prev.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset))
    setNewSubtitle({ language: '', content: '', startTime: 0, endTime: 0 })
    setShowAddSubtitle(false)
  }

  const handleEditSubtitle = (subtitle: Subtitle) => {
    setEditingSubtitle(subtitle)
    setNewSubtitle({
      language: subtitle.language,
      content: subtitle.content,
      startTime: subtitle.startTime,
      endTime: subtitle.endTime,
    })
    setShowAddSubtitle(true)
  }

  const handleUpdateSubtitle = () => {
    if (!selectedAsset || !editingSubtitle || !newSubtitle.content.trim() || !newSubtitle.language) return

    const updatedAsset = {
      ...selectedAsset,
      subtitles: selectedAsset.subtitles.map(sub => 
        sub.id === editingSubtitle.id 
          ? { ...sub, ...newSubtitle, updatedAt: new Date() }
          : sub
      )
    }

    setSelectedAsset(updatedAsset)
    setAssets(prev => prev.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset))
    setEditingSubtitle(null)
    setNewSubtitle({ language: '', content: '', startTime: 0, endTime: 0 })
    setShowAddSubtitle(false)
  }

  const handleDeleteSubtitle = (subtitleId: string) => {
    if (!selectedAsset) return

    const updatedAsset = {
      ...selectedAsset,
      subtitles: selectedAsset.subtitles.filter(sub => sub.id !== subtitleId)
    }

    setSelectedAsset(updatedAsset)
    setAssets(prev => prev.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset))
  }

  const getCurrentSubtitle = () => {
    if (!selectedAsset) return null
    return selectedAsset.subtitles.find(sub => 
      currentTime >= sub.startTime && currentTime <= sub.endTime
    )
  }

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
    }
    return languages[code] || code.toUpperCase()
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
          <h1 className="text-2xl font-bold text-gray-900">Asset Subtitles</h1>
          <p className="text-gray-600">Add and manage subtitles for your media assets</p>
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
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {asset.subtitles.length} subtitle{asset.subtitles.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subtitle Editor */}
          <div className="lg:col-span-2 space-y-6">
            {selectedAsset && (
              <>
                {/* Media Player */}
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                      {selectedAsset.fileType === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">🎬</div>
                            <p className="text-lg">Video Player</p>
                            <p className="text-sm text-gray-300">{selectedAsset.originalName}</p>
                          </div>
                        </div>
                      ) : selectedAsset.fileType === 'audio' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">🎵</div>
                            <p className="text-lg">Audio Player</p>
                            <p className="text-sm text-gray-300">{selectedAsset.originalName}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-lg">Media Player</p>
                            <p className="text-sm text-gray-300">{selectedAsset.originalName}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Play/Pause Button */}
                      {(selectedAsset.fileType === 'video' || selectedAsset.fileType === 'audio') && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={togglePlayPause}
                            className="bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-70 transition-opacity"
                          >
                            {isPlaying ? (
                              <Pause className="h-8 w-8" />
                            ) : (
                              <Play className="h-8 w-8" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Current Subtitle Display */}
                      {getCurrentSubtitle() && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black bg-opacity-75 text-white p-3 rounded-lg text-center">
                            <p className="text-lg">{getCurrentSubtitle()?.content}</p>
                          </div>
                        </div>
                      )}

                      {/* Time Display */}
                      {(selectedAsset.fileType === 'video' || selectedAsset.fileType === 'audio') && (
                        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {formatDuration(currentTime)} / {formatDuration(selectedAsset.duration || 0)}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {(selectedAsset.fileType === 'video' || selectedAsset.fileType === 'audio') && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentTime / (selectedAsset.duration || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Subtitles List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Subtitles</span>
                      <Button
                        size="sm"
                        onClick={() => setShowAddSubtitle(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subtitle
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAsset.subtitles.length > 0 ? (
                      <div className="space-y-3">
                        {selectedAsset.subtitles
                          .sort((a, b) => a.startTime - b.startTime)
                          .map((subtitle) => (
                            <div
                              key={subtitle.id}
                              className={`p-3 border rounded-lg ${
                                getCurrentSubtitle()?.id === subtitle.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900">
                                      {getLanguageName(subtitle.language)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatDuration(subtitle.startTime)} - {formatDuration(subtitle.endTime)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{subtitle.content}</p>
                                </div>
                                <div className="flex items-center space-x-1 ml-4">
                                  <button
                                    onClick={() => handleEditSubtitle(subtitle)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubtitle(subtitle.id)}
                                    className="text-gray-400 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No subtitles for this asset</p>
                    )}
                  </CardContent>
                </Card>

                {/* Add/Edit Subtitle Modal */}
                {showAddSubtitle && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {editingSubtitle ? 'Edit Subtitle' : 'Add New Subtitle'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <select
                            value={newSubtitle.language}
                            onChange={(e) => setNewSubtitle(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select language</option>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="pt">Portuguese</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                          </label>
                          <textarea
                            value={newSubtitle.content}
                            onChange={(e) => setNewSubtitle(prev => ({ ...prev, content: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter subtitle text"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Time (seconds)
                            </label>
                            <input
                              type="number"
                              value={newSubtitle.startTime}
                              onChange={(e) => setNewSubtitle(prev => ({ ...prev, startTime: Number(e.target.value) }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Time (seconds)
                            </label>
                            <input
                              type="number"
                              value={newSubtitle.endTime}
                              onChange={(e) => setNewSubtitle(prev => ({ ...prev, endTime: Number(e.target.value) }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              step="0.1"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setShowAddSubtitle(false)
                              setEditingSubtitle(null)
                              setNewSubtitle({ language: '', content: '', startTime: 0, endTime: 0 })
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={editingSubtitle ? handleUpdateSubtitle : handleAddSubtitle}
                            disabled={!newSubtitle.content.trim() || !newSubtitle.language}
                          >
                            {editingSubtitle ? 'Update' : 'Add'} Subtitle
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
