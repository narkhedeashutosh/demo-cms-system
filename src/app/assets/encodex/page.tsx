'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdvancedVideoPlayer from '@/components/player/AdvancedVideoPlayer'
import { Asset } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  Zap,
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
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Layers,
  Target,
  Cpu,
  Volume2,
  Star,
} from 'lucide-react'

interface EncodingProfile {
  id: string
  name: string
  description: string
  resolution: string
  bitrate: string
  codec: string
  features: string[]
  quality: 'standard' | 'premium' | 'ultra'
  processingTime: string
  icon: React.ComponentType<any>
}

interface EncodingJob {
  id: string
  assetId: string
  profile: EncodingProfile
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: Date
  completedAt?: Date
  outputUrl?: string
}

export default function EncodeXPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [encodingJobs, setEncodingJobs] = useState<EncodingJob[]>([])
  const [selectedProfile, setSelectedProfile] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const encodingProfiles: EncodingProfile[] = [
    {
      id: 'abr-4k',
      name: 'ABR 4K UHD',
      description: 'Adaptive Bitrate for 4K streaming',
      resolution: '3840x2160',
      bitrate: '15-50 Mbps',
      codec: 'H.265/HEVC',
      features: ['ABR', 'HDR10', 'Dolby Vision'],
      quality: 'ultra',
      processingTime: '45-60 min',
      icon: Monitor
    },
    {
      id: 'abr-1080p',
      name: 'ABR 1080p',
      description: 'Adaptive Bitrate for HD streaming',
      resolution: '1920x1080',
      bitrate: '3-15 Mbps',
      codec: 'H.264/H.265',
      features: ['ABR', 'HDR10'],
      quality: 'premium',
      processingTime: '20-30 min',
      icon: Monitor
    },
    {
      id: 'broadcast-uhd',
      name: 'Broadcast UHD',
      description: 'Broadcast quality UHD encoding',
      resolution: '3840x2160',
      bitrate: '100 Mbps',
      codec: 'H.265/HEVC',
      features: ['Broadcast', 'HDR10', 'Dolby Vision'],
      quality: 'ultra',
      processingTime: '60-90 min',
      icon: Tv
    },
    {
      id: 'mobile-optimized',
      name: 'Mobile Optimized',
      description: 'Optimized for mobile devices',
      resolution: '1280x720',
      bitrate: '1-3 Mbps',
      codec: 'H.264',
      features: ['Mobile', 'Low Latency'],
      quality: 'standard',
      processingTime: '10-15 min',
      icon: Smartphone
    },
    {
      id: 'av1-nextgen',
      name: 'AV1 Next-Gen',
      description: 'Next-generation AV1 codec',
      resolution: '1920x1080',
      bitrate: '2-8 Mbps',
      codec: 'AV1',
      features: ['AV1', 'HDR10', 'Future-Proof'],
      quality: 'premium',
      processingTime: '90-120 min',
      icon: Cpu
    },
    {
      id: 'dolby-atmos',
      name: 'Dolby Atmos Audio',
      description: 'Premium spatial audio encoding',
      resolution: 'Audio Only',
      bitrate: '768 kbps',
      codec: 'Dolby Atmos',
      features: ['Dolby Atmos', 'Spatial Audio', 'DDplus'],
      quality: 'ultra',
      processingTime: '15-25 min',
      icon: Volume2
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

    const mockJobs: EncodingJob[] = [
      {
        id: '1',
        assetId: '1',
        profile: encodingProfiles[0],
        status: 'completed',
        progress: 100,
        createdAt: new Date(Date.now() - 7200000),
        completedAt: new Date(Date.now() - 3600000),
        outputUrl: '/encodex/outputs/product-demo-4k.mp4'
      },
      {
        id: '2',
        assetId: '1',
        profile: encodingProfiles[4],
        status: 'processing',
        progress: 65,
        createdAt: new Date(Date.now() - 1800000)
      }
    ]

    setTimeout(() => {
      setAssets(mockAssets)
      setSelectedAsset(mockAssets[0])
      setEncodingJobs(mockJobs)
      setIsLoading(false)
    }, 1000)
  }, [])

  const startEncoding = async () => {
    if (!selectedAsset || !selectedProfile) return

    const profile = encodingProfiles.find(p => p.id === selectedProfile)
    if (!profile) return

    setIsProcessing(true)
    
    // Mock encoding process
    setTimeout(() => {
      const newJob: EncodingJob = {
        id: Math.random().toString(36).substr(2, 9),
        assetId: selectedAsset.id,
        profile,
        status: 'queued',
        progress: 0,
        createdAt: new Date()
      }

      setEncodingJobs(prev => [newJob, ...prev])
      setSelectedProfile('')
      setIsProcessing(false)

      // Simulate job progression
      setTimeout(() => {
        setEncodingJobs(prev => prev.map(job => 
          job.id === newJob.id ? { ...job, status: 'processing', progress: 25 } : job
        ))
      }, 2000)

      setTimeout(() => {
        setEncodingJobs(prev => prev.map(job => 
          job.id === newJob.id ? { ...job, progress: 75 } : job
        ))
      }, 5000)

      setTimeout(() => {
        setEncodingJobs(prev => prev.map(job => 
          job.id === newJob.id ? { 
            ...job, 
            status: 'completed', 
            progress: 100, 
            completedAt: new Date(),
            outputUrl: `/encodex/outputs/${selectedAsset.filename.replace('.mp4', `-${profile.id}.mp4`)}`
          } : job
        ))
      }, 8000)
    }, 1000)
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
        return <Activity className="h-4 w-4 text-blue-500" />
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />
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
      case 'queued':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'ultra':
        return 'bg-purple-100 text-purple-800'
      case 'premium':
        return 'bg-blue-100 text-blue-800'
      case 'standard':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-2xl font-bold text-gray-900">EncodeX Service</h1>
          <p className="text-gray-600">Transcoding-as-a-Service - High-performance transcoding (ABR, HDR, UHD, Dolby Vision, Dolby Atmos, DDplus, AV1, HEVC)</p>
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

            {/* Encoding Profiles */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Encoding Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {encodingProfiles.map((profile) => (
                    <label key={profile.id} className="block">
                      <div className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedProfile === profile.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="profile"
                            value={profile.id}
                            checked={selectedProfile === profile.id}
                            onChange={(e) => setSelectedProfile(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <profile.icon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">{profile.name}</span>
                              <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getQualityColor(profile.quality)}`}>
                                {profile.quality}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{profile.description}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>Resolution: {profile.resolution}</div>
                              <div>Bitrate: {profile.bitrate}</div>
                              <div>Codec: {profile.codec}</div>
                              <div>Features: {profile.features.join(', ')}</div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{profile.processingTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={startEncoding}
                  disabled={isProcessing || !selectedAsset || !selectedProfile}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Starting Encoding...' : 'Start Encoding'}
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

                {/* Encoding Jobs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Encoding Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {encodingJobs.filter(job => job.assetId === selectedAsset.id).map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(job.status)}
                              <div>
                                <h4 className="font-medium text-gray-900">{job.profile.name}</h4>
                                <p className="text-sm text-gray-500">{job.profile.description}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          
                          {job.status === 'processing' && (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{job.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${job.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                            <div>
                              <div>Resolution: {job.profile.resolution}</div>
                              <div>Bitrate: {job.profile.bitrate}</div>
                            </div>
                            <div>
                              <div>Codec: {job.profile.codec}</div>
                              <div>Started: {job.createdAt.toLocaleString()}</div>
                            </div>
                          </div>

                          {job.status === 'completed' && job.outputUrl && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4 mr-1" />
                                Download Output
                              </Button>
                            </div>
                          )}
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
                        <h4 className="font-medium text-blue-900 mb-2">Optimized Delivery</h4>
                        <p className="text-sm text-blue-700">Optimized delivery formats for maximum compatibility</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Premium Quality</h4>
                        <p className="text-sm text-purple-700">Premium audio/video quality with next-gen codecs</p>
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
                        <Zap className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Accelerated encoding with GPU acceleration</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Next-generation codecs (AV1, HEVC, H.264)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Layers className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Advanced features (HDR, Dolby Vision, Dolby Atmos)</span>
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
