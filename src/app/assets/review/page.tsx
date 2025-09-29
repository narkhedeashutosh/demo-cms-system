'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Asset } from '@/types'
import { formatFileSize, formatDuration, formatDate } from '@/lib/utils'
import {
  Play,
  Pause,
  Volume2,
  Eye,
  Download,
  Tag,
  Clock,
  Film,
  Image,
  Music,
  FileText,
  Info,
} from 'lucide-react'

export default function AssetReviewPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app, this would fetch from an API
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
          { id: '1', name: 'Marketing', color: 'blue', category: 'Department', createdAt: new Date() },
          { id: '2', name: 'Product', color: 'green', category: 'Type', createdAt: new Date() }
        ],
        metadata: {
          camera: 'Canon EOS R5',
          lens: 'RF 24-70mm f/2.8L IS USM',
          iso: 800,
          aperture: 'f/2.8',
          shutterSpeed: '1/60s',
          whiteBalance: 'Auto',
          location: 'Studio A',
          director: 'John Smith',
          producer: 'Jane Doe'
        },
        subtitles: [],
        uploadedBy: 'john@example.com',
        uploadedAt: new Date(),
        updatedAt: new Date(),
        downloadUrl: '/api/assets/1/download',
        thumbnailUrl: '/api/assets/1/thumbnail',
        previewUrl: '/api/assets/1/preview',
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
          { id: '3', name: 'Branding', color: 'purple', category: 'Type', createdAt: new Date() }
        ],
        metadata: {
          colorSpace: 'sRGB',
          colorDepth: '8-bit',
          compression: 'PNG',
          software: 'Adobe Illustrator 2024',
          created: '2024-01-15T10:30:00Z'
        },
        subtitles: [],
        uploadedBy: 'jane@example.com',
        uploadedAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        downloadUrl: '/api/assets/2/download',
        thumbnailUrl: '/api/assets/2/thumbnail',
      },
      {
        id: '3',
        filename: 'podcast-episode-1.mp3',
        originalName: 'Podcast Episode 1.mp3',
        fileType: 'audio',
        mimeType: 'audio/mpeg',
        fileSize: 45000000,
        duration: 1800,
        bitrate: 128,
        codec: 'MP3',
        sampleRate: 44100,
        channels: 2,
        status: 'ready',
        tags: [
          { id: '4', name: 'Podcast', color: 'orange', category: 'Content', createdAt: new Date() }
        ],
        metadata: {
          artist: 'Tech Talk Podcast',
          album: 'Episode 1',
          genre: 'Technology',
          year: 2024,
          recording: 'Studio B',
          engineer: 'Bob Wilson'
        },
        subtitles: [],
        uploadedBy: 'bob@example.com',
        uploadedAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000),
        downloadUrl: '/api/assets/3/download',
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
          <h1 className="text-2xl font-bold text-gray-900">Asset Review</h1>
          <p className="text-gray-600">Review and analyze media assets with technical metadata</p>
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
                            {formatFileSize(asset.fileSize)} • {formatDate(asset.uploadedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Preview and Details */}
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
                            <p className="text-lg">Video Preview</p>
                            <p className="text-sm text-gray-300">{selectedAsset.originalName}</p>
                          </div>
                        </div>
                      ) : selectedAsset.fileType === 'image' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">🖼️</div>
                            <p className="text-lg">Image Preview</p>
                            <p className="text-sm text-gray-300">{selectedAsset.originalName}</p>
                          </div>
                        </div>
                      ) : selectedAsset.fileType === 'audio' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">🎵</div>
                            <p className="text-lg">Audio Preview</p>
                            <p className="text-sm text-gray-300">{selectedAsset.originalName}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-lg">Document Preview</p>
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
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>{formatDuration(currentTime)}</span>
                          <span>{formatDuration(selectedAsset.duration || 0)}</span>
                        </div>
                      </div>
                    )}

                    {/* Controls */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedAsset.fileType === 'video' && selectedAsset.width && selectedAsset.height && (
                          <span>{selectedAsset.width}×{selectedAsset.height}</span>
                        )}
                        {selectedAsset.fileType === 'audio' && selectedAsset.sampleRate && (
                          <span>{selectedAsset.sampleRate}Hz</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Technical Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-500">Filename:</dt>
                            <dd className="text-sm text-gray-900">{selectedAsset.filename}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-500">File Size:</dt>
                            <dd className="text-sm text-gray-900">{formatFileSize(selectedAsset.fileSize)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-500">MIME Type:</dt>
                            <dd className="text-sm text-gray-900">{selectedAsset.mimeType}</dd>
                          </div>
                          {selectedAsset.duration && (
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Duration:</dt>
                              <dd className="text-sm text-gray-900">{formatDuration(selectedAsset.duration)}</dd>
                            </div>
                          )}
                          {selectedAsset.width && selectedAsset.height && (
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Dimensions:</dt>
                              <dd className="text-sm text-gray-900">{selectedAsset.width}×{selectedAsset.height}</dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      {/* Technical Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Technical Details</h4>
                        <dl className="space-y-2">
                          {selectedAsset.codec && (
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Codec:</dt>
                              <dd className="text-sm text-gray-900">{selectedAsset.codec}</dd>
                            </div>
                          )}
                          {selectedAsset.bitrate && (
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Bitrate:</dt>
                              <dd className="text-sm text-gray-900">{selectedAsset.bitrate} kbps</dd>
                            </div>
                          )}
                          {selectedAsset.frameRate && (
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Frame Rate:</dt>
                              <dd className="text-sm text-gray-900">{selectedAsset.frameRate} fps</dd>
                            </div>
                          )}
                          {selectedAsset.sampleRate && (
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Sample Rate:</dt>
                              <dd className="text-sm text-gray-900">{selectedAsset.sampleRate} Hz</dd>
                            </div>
                          )}
                          {selectedAsset.channels && (
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Channels:</dt>
                              <dd className="text-sm text-gray-900">{selectedAsset.channels}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>

                    {/* Custom Metadata */}
                    {Object.keys(selectedAsset.metadata).length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">Custom Metadata</h4>
                        <dl className="space-y-2">
                          {Object.entries(selectedAsset.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <dt className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                              <dd className="text-sm text-gray-900">{String(value)}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}

                    {/* Tags */}
                    {selectedAsset.tags.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAsset.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
