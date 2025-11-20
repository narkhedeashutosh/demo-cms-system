'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdvancedVideoPlayer from '@/components/player/AdvancedVideoPlayer'
import { Asset } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  Package,
  Play,
  Pause,
  Settings,
  Film,
  Image,
  Music,
  FileText,
  Monitor,
  Tv,
  Smartphone,
  Globe,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Layers,
  ArrowRight,
  Target,
} from 'lucide-react'

interface DeliveryFormat {
  id: string
  name: string
  platform: 'OTT' | 'Broadcast' | 'FAST'
  resolution: string
  bitrate: string
  codec: string
  status: 'ready' | 'processing' | 'completed' | 'failed'
  progress: number
  url?: string
}

interface DeliveryPackage {
  id: string
  name: string
  formats: DeliveryFormat[]
  createdAt: Date
  status: 'draft' | 'processing' | 'completed'
}

export default function MediaReadyPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [deliveryPackages, setDeliveryPackages] = useState<DeliveryPackage[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const availableFormats = [
    {
      id: 'ott-4k',
      name: 'OTT 4K UHD',
      platform: 'OTT' as const,
      resolution: '3840x2160',
      bitrate: '15-25 Mbps',
      codec: 'H.265/HEVC',
      icon: Monitor
    },
    {
      id: 'ott-1080p',
      name: 'OTT 1080p',
      platform: 'OTT' as const,
      resolution: '1920x1080',
      bitrate: '5-8 Mbps',
      codec: 'H.264',
      icon: Monitor
    },
    {
      id: 'ott-720p',
      name: 'OTT 720p',
      platform: 'OTT' as const,
      resolution: '1280x720',
      bitrate: '2-4 Mbps',
      codec: 'H.264',
      icon: Smartphone
    },
    {
      id: 'broadcast-1080i',
      name: 'Broadcast 1080i',
      platform: 'Broadcast' as const,
      resolution: '1920x1080',
      bitrate: '50 Mbps',
      codec: 'MPEG-2',
      icon: Tv
    },
    {
      id: 'broadcast-720p',
      name: 'Broadcast 720p',
      platform: 'Broadcast' as const,
      resolution: '1280x720',
      bitrate: '25 Mbps',
      codec: 'MPEG-2',
      icon: Tv
    },
    {
      id: 'fast-1080p',
      name: 'FAST 1080p',
      platform: 'FAST' as const,
      resolution: '1920x1080',
      bitrate: '3-5 Mbps',
      codec: 'H.264',
      icon: Globe
    },
    {
      id: 'fast-720p',
      name: 'FAST 720p',
      platform: 'FAST' as const,
      resolution: '1280x720',
      bitrate: '1.5-3 Mbps',
      codec: 'H.264',
      icon: Globe
    }
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
        tags: [],
        metadata: {},
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
        filename: 'company-intro.mp4',
        originalName: 'Company Introduction.mp4',
        fileType: 'video',
        mimeType: 'video/mp4',
        fileSize: 89000000,
        duration: 90,
        width: 1920,
        height: 1080,
        bitrate: 4000,
        codec: 'H.264',
        frameRate: 25,
        status: 'ready',
        tags: [],
        metadata: {},
        subtitles: [],
        uploadedBy: 'jane@example.com',
        uploadedAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        downloadUrl: '/api/assets/2/download',
        thumbnailUrl: '/api/assets/2/thumbnail',
        previewUrl: '/api/assets/2/preview',
      },
    ]

    const mockPackages: DeliveryPackage[] = [
      {
        id: '1',
        name: 'Product Demo - Multi-Platform',
        formats: [
          {
            id: 'ott-4k',
            name: 'OTT 4K UHD',
            platform: 'OTT',
            resolution: '3840x2160',
            bitrate: '15-25 Mbps',
            codec: 'H.265/HEVC',
            status: 'completed',
            progress: 100,
            url: '/delivery/ott-4k/product-demo.mp4'
          },
          {
            id: 'ott-1080p',
            name: 'OTT 1080p',
            platform: 'OTT',
            resolution: '1920x1080',
            bitrate: '5-8 Mbps',
            codec: 'H.264',
            status: 'completed',
            progress: 100,
            url: '/delivery/ott-1080p/product-demo.mp4'
          },
          {
            id: 'broadcast-1080i',
            name: 'Broadcast 1080i',
            platform: 'Broadcast',
            resolution: '1920x1080',
            bitrate: '50 Mbps',
            codec: 'MPEG-2',
            status: 'processing',
            progress: 75
          }
        ],
        createdAt: new Date(Date.now() - 86400000),
        status: 'processing'
      }
    ]

    setTimeout(() => {
      setAssets(mockAssets)
      setSelectedAsset(mockAssets[0])
      setDeliveryPackages(mockPackages)
      setIsLoading(false)
    }, 1000)
  }, [])

  const createDeliveryPackage = async () => {
    if (!selectedAsset || selectedFormats.length === 0) return

    setIsProcessing(true)
    
    // Mock processing
    setTimeout(() => {
      const newPackage: DeliveryPackage = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${selectedAsset.originalName} - Multi-Platform`,
        formats: selectedFormats.map(formatId => {
          const format = availableFormats.find(f => f.id === formatId)
          return {
            id: formatId,
            name: format?.name || '',
            platform: format?.platform || 'OTT',
            resolution: format?.resolution || '',
            bitrate: format?.bitrate || '',
            codec: format?.codec || '',
            status: 'processing' as const,
            progress: 0
          }
        }),
        createdAt: new Date(),
        status: 'processing'
      }

      setDeliveryPackages(prev => [newPackage, ...prev])
      setSelectedFormats([])
      setIsProcessing(false)
    }, 2000)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'OTT':
        return <Monitor className="h-4 w-4" />
      case 'Broadcast':
        return <Tv className="h-4 w-4" />
      case 'FAST':
        return <Globe className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
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
          <h1 className="text-2xl font-bold text-gray-900">MediaReady</h1>
          <p className="text-gray-600">Content Preparation & Transformation - Proxy creation, multi-format packaging for OTT, broadcast, FAST</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Asset</CardTitle>
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
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Format Selection */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Delivery Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableFormats.map((format) => (
                    <label key={format.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(format.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFormats(prev => [...prev, format.id])
                          } else {
                            setSelectedFormats(prev => prev.filter(id => id !== format.id))
                          }
                        }}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <format.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">{format.name}</span>
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getStatusColor(format.platform.toLowerCase())}`}>
                            {format.platform}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                          <div>Resolution: {format.resolution}</div>
                          <div>Bitrate: {format.bitrate}</div>
                          <div>Codec: {format.codec}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={createDeliveryPackage}
                  disabled={isProcessing || !selectedAsset || selectedFormats.length === 0}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Creating Package...' : 'Create Delivery Package'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {selectedAsset && (
              <>
                {/* Video Player */}
                <Card>
                  <CardContent className="p-6">
                    <AdvancedVideoPlayer
                      src={selectedAsset.previewUrl}
                      className="w-full aspect-video"
                    />
                  </CardContent>
                </Card>

                {/* Delivery Packages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Packages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deliveryPackages.map((pkg) => (
                        <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pkg.status)}`}>
                              {pkg.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {pkg.formats.map((format) => (
                              <div key={format.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-3">
                                  {getStatusIcon(format.status)}
                                  <div className="flex items-center space-x-2">
                                    {getPlatformIcon(format.platform)}
                                    <span className="text-sm font-medium">{format.name}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {format.resolution} • {format.bitrate}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {format.status === 'processing' && (
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${format.progress}%` }}
                                      />
                                    </div>
                                  )}
                                  {format.status === 'completed' && format.url && (
                                    <Button size="sm" variant="ghost">
                                      <Download className="h-4 w-4 mr-1" />
                                      Download
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 text-xs text-gray-500">
                            Created: {pkg.createdAt.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Business Value */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Ready-to-Use Content</h4>
                        <p className="text-sm text-blue-700">Delivers optimized content for multiple endpoints</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Multi-Platform Support</h4>
                        <p className="text-sm text-green-700">Automated format packaging for OTT, Broadcast, FAST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Foundation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Foundation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Layers className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Automated format packaging pipeline</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Platform-specific optimization</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Parallel processing for multiple formats</span>
                      </div>
                    </div>
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
