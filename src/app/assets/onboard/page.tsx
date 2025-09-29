'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Asset } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Clock,
  Film,
  Image,
  Music,
  FileText,
  RotateCcw,
  Eye,
} from 'lucide-react'

interface ProcessingJob {
  id: string
  assetId: string
  asset: Asset
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  steps: {
    name: string
    status: 'pending' | 'processing' | 'completed' | 'error'
  }[]
  startedAt?: Date
  completedAt?: Date
  error?: string
}

export default function AssetOnboardPage() {
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app, this would fetch processing jobs from an API
    const mockJobs: ProcessingJob[] = [
      {
        id: '1',
        assetId: '1',
        asset: {
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
          status: 'processing',
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
        status: 'processing',
        progress: 65,
        steps: [
          { name: 'File Validation', status: 'completed' },
          { name: 'Thumbnail Generation', status: 'completed' },
          { name: 'Metadata Extraction', status: 'processing' },
          { name: 'Transcoding', status: 'pending' },
          { name: 'Quality Check', status: 'pending' },
        ],
        startedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        id: '2',
        assetId: '2',
        asset: {
          id: '2',
          filename: 'company-logo.png',
          originalName: 'Company Logo.png',
          fileType: 'image',
          mimeType: 'image/png',
          fileSize: 2500000,
          width: 512,
          height: 512,
          status: 'processing',
          tags: [],
          metadata: {},
          subtitles: [],
          uploadedBy: 'jane@example.com',
          uploadedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          updatedAt: new Date(Date.now() - 5 * 60 * 1000),
          downloadUrl: '/api/assets/2/download',
          thumbnailUrl: '/api/assets/2/thumbnail',
        },
        status: 'completed',
        progress: 100,
        steps: [
          { name: 'File Validation', status: 'completed' },
          { name: 'Thumbnail Generation', status: 'completed' },
          { name: 'Metadata Extraction', status: 'completed' },
          { name: 'Image Optimization', status: 'completed' },
          { name: 'Quality Check', status: 'completed' },
        ],
        startedAt: new Date(Date.now() - 5 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      },
      {
        id: '3',
        assetId: '3',
        asset: {
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
          status: 'error',
          tags: [],
          metadata: {},
          subtitles: [],
          uploadedBy: 'bob@example.com',
          uploadedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          updatedAt: new Date(Date.now() - 10 * 60 * 1000),
          downloadUrl: '/api/assets/3/download',
        },
        status: 'error',
        progress: 30,
        steps: [
          { name: 'File Validation', status: 'completed' },
          { name: 'Thumbnail Generation', status: 'error' },
          { name: 'Metadata Extraction', status: 'pending' },
          { name: 'Audio Processing', status: 'pending' },
          { name: 'Quality Check', status: 'pending' },
        ],
        startedAt: new Date(Date.now() - 10 * 60 * 1000),
        error: 'Failed to generate thumbnail: Unsupported audio format',
      },
    ]

    setTimeout(() => {
      setProcessingJobs(mockJobs)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRetryJob = (jobId: string) => {
    setProcessingJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'processing', progress: 0, error: undefined }
        : job
    ))
  }

  const getTimeElapsed = (startedAt: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - startedAt.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000)
    
    if (diffInMinutes > 0) {
      return `${diffInMinutes}m ${diffInSeconds}s`
    } else {
      return `${diffInSeconds}s`
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Asset Onboard</h1>
          <p className="text-gray-600">Monitor and manage asset processing jobs</p>
        </div>

        {/* Processing Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {processingJobs.filter(job => job.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <RotateCcw className="h-8 w-8 text-yellow-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Processing</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {processingJobs.filter(job => job.status === 'processing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {processingJobs.filter(job => job.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Errors</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {processingJobs.filter(job => job.status === 'error').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Processing Jobs */}
        <div className="space-y-4">
          {processingJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getFileTypeIcon(job.asset.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {job.asset.originalName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="ml-1 capitalize">{job.status}</span>
                        </span>
                        {job.status === 'error' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRetryJob(job.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(job.asset.fileSize)}</span>
                      {job.asset.duration && (
                        <span>{formatDuration(job.asset.duration)}</span>
                      )}
                      <span>Uploaded by {job.asset.uploadedBy}</span>
                      {job.startedAt && (
                        <span>Started {getTimeElapsed(job.startedAt)} ago</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            job.status === 'error' 
                              ? 'bg-red-500' 
                              : job.status === 'completed' 
                              ? 'bg-green-500' 
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Processing Steps */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Processing Steps</h4>
                      <div className="space-y-2">
                        {job.steps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {step.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {step.status === 'processing' && (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            )}
                            {step.status === 'error' && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            {step.status === 'pending' && (
                              <Clock className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={`text-sm ${
                              step.status === 'completed' 
                                ? 'text-green-700' 
                                : step.status === 'processing' 
                                ? 'text-blue-700' 
                                : step.status === 'error' 
                                ? 'text-red-700' 
                                : 'text-gray-500'
                            }`}>
                              {step.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Error Message */}
                    {job.error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Processing Error</h3>
                            <p className="mt-1 text-sm text-red-700">{job.error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {processingJobs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No processing jobs</h3>
              <p className="text-gray-500">
                Upload new assets to see them appear in the processing queue.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
