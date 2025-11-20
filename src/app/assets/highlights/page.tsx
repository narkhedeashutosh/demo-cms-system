'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdvancedVideoPlayer from '@/components/player/AdvancedVideoPlayer'
import { Asset } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  Sparkles,
  Play,
  Pause,
  Settings,
  Film,
  Image,
  Music,
  FileText,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Zap,
  Target,
  Scissors,
  Eye,
  Star,
  Heart,
} from 'lucide-react'

interface Highlight {
  id: string
  name: string
  description: string
  startTime: number
  endTime: number
  duration: number
  confidence: number
  type: 'action' | 'emotion' | 'speech' | 'music' | 'custom'
  thumbnailUrl: string
  tags: string[]
  generatedAt: Date
}

interface HighlightReel {
  id: string
  name: string
  description: string
  highlights: Highlight[]
  duration: number
  status: 'generating' | 'ready' | 'processing'
  createdAt: Date
  thumbnailUrl: string
}

export default function QuickHighlightsPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [highlightReels, setHighlightReels] = useState<HighlightReel[]>([])
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [generationSettings, setGenerationSettings] = useState({
    duration: 30,
    type: 'action' as 'action' | 'emotion' | 'mixed',
    includeAudio: true,
    maxHighlights: 10,
    minConfidence: 0.7
  })

  const highlightTypes = [
    { id: 'action', name: 'Action Scenes', icon: Zap, description: 'High-energy moments and action sequences' },
    { id: 'emotion', name: 'Emotional Moments', icon: Heart, description: 'Sentimental and impactful scenes' },
    { id: 'speech', name: 'Key Speeches', icon: Target, description: 'Important dialogue and monologues' },
    { id: 'music', name: 'Musical Highlights', icon: Music, description: 'Musical performances and crescendos' },
    { id: 'custom', name: 'Custom Selection', icon: Scissors, description: 'Manually selected highlights' }
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

    const mockHighlights: HighlightReel[] = [
      {
        id: '1',
        name: 'Product Demo Highlights',
        description: 'Auto-generated highlights from product demonstration',
        highlights: [
          {
            id: '1',
            name: 'Product Reveal',
            description: 'The moment when the product is first shown',
            startTime: 15,
            endTime: 25,
            duration: 10,
            confidence: 0.95,
            type: 'action',
            thumbnailUrl: '/thumbnails/highlight-1.jpg',
            tags: ['reveal', 'product', 'key-moment'],
            generatedAt: new Date()
          },
          {
            id: '2',
            name: 'Feature Demo',
            description: 'Demonstration of key product features',
            startTime: 45,
            endTime: 65,
            duration: 20,
            confidence: 0.88,
            type: 'speech',
            thumbnailUrl: '/thumbnails/highlight-2.jpg',
            tags: ['features', 'demo', 'explanation'],
            generatedAt: new Date()
          },
          {
            id: '3',
            name: 'Customer Testimonial',
            description: 'Customer sharing their experience',
            startTime: 85,
            endTime: 105,
            duration: 20,
            confidence: 0.92,
            type: 'emotion',
            thumbnailUrl: '/thumbnails/highlight-3.jpg',
            tags: ['testimonial', 'customer', 'satisfaction'],
            generatedAt: new Date()
          }
        ],
        duration: 50,
        status: 'ready',
        createdAt: new Date(Date.now() - 86400000),
        thumbnailUrl: '/thumbnails/reel-1.jpg'
      }
    ]

    setTimeout(() => {
      setAssets(mockAssets)
      setSelectedAsset(mockAssets[0])
      setHighlightReels(mockHighlights)
      setIsLoading(false)
    }, 1000)
  }, [])

  const generateHighlightReel = async () => {
    if (!selectedAsset) return

    setIsGenerating(true)
    
    // Mock generation process
    setTimeout(() => {
      const newReel: HighlightReel = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${selectedAsset.originalName} - Highlights`,
        description: `AI-generated highlights (${generationSettings.duration}s reel)`,
        highlights: [],
        duration: generationSettings.duration,
        status: 'generating',
        createdAt: new Date(),
        thumbnailUrl: '/thumbnails/generating.jpg'
      }

      setHighlightReels(prev => [newReel, ...prev])
      setIsGenerating(false)

      // Simulate generation completion
      setTimeout(() => {
        const mockHighlights: Highlight[] = [
          {
            id: '1',
            name: 'Opening Hook',
            description: 'Compelling opening sequence',
            startTime: 5,
            endTime: 12,
            duration: 7,
            confidence: 0.94,
            type: 'action',
            thumbnailUrl: '/thumbnails/opening.jpg',
            tags: ['opening', 'hook', 'attention'],
            generatedAt: new Date()
          },
          {
            id: '2',
            name: 'Key Message',
            description: 'Core value proposition',
            startTime: 25,
            endTime: 35,
            duration: 10,
            confidence: 0.87,
            type: 'speech',
            thumbnailUrl: '/thumbnails/message.jpg',
            tags: ['message', 'value', 'proposition'],
            generatedAt: new Date()
          },
          {
            id: '3',
            name: 'Call to Action',
            description: 'Final call to action',
            startTime: 110,
            endTime: 120,
            duration: 10,
            confidence: 0.91,
            type: 'action',
            thumbnailUrl: '/thumbnails/cta.jpg',
            tags: ['cta', 'action', 'conclusion'],
            generatedAt: new Date()
          }
        ]

        setHighlightReels(prev => prev.map(reel => 
          reel.id === newReel.id ? {
            ...reel,
            highlights: mockHighlights,
            status: 'ready' as const,
            thumbnailUrl: '/thumbnails/completed.jpg'
          } : reel
        ))
      }, 5000)
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

  const getHighlightTypeIcon = (type: string) => {
    const highlightType = highlightTypes.find(t => t.id === type)
    return highlightType ? <highlightType.icon className="h-4 w-4" /> : <Star className="h-4 w-4" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'generating':
        return <Activity className="h-4 w-4 text-blue-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'generating':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.8) return 'text-blue-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
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
          <h1 className="text-2xl font-bold text-gray-900">QuickHighlights</h1>
          <p className="text-gray-600">AI-based creation of highlight reels, summaries, and promo edits</p>
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

            {/* Generation Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reel Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="120"
                      value={generationSettings.duration}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Highlight Type
                    </label>
                    <select
                      value={generationSettings.type}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="action">Action & Energy</option>
                      <option value="emotion">Emotional Moments</option>
                      <option value="mixed">Mixed Highlights</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Highlights
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="20"
                      value={generationSettings.maxHighlights}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, maxHighlights: parseInt(e.target.value) || 10 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Confidence
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.1"
                      value={generationSettings.minConfidence}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, minConfidence: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(generationSettings.minConfidence * 100)}%
                    </div>
                  </div>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={generationSettings.includeAudio}
                      onChange={(e) => setGenerationSettings(prev => ({ ...prev, includeAudio: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include audio analysis</span>
                  </label>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={generateHighlightReel}
                  disabled={isGenerating || !selectedAsset}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating Highlights...' : 'Generate Highlight Reel'}
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

                {/* Highlight Reels */}
                <Card>
                  <CardHeader>
                    <CardTitle>Highlight Reels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {highlightReels.filter(reel => reel.highlights.some(h => selectedAsset.id === '1')).map((reel) => (
                        <div key={reel.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{reel.name}</h4>
                              <p className="text-sm text-gray-500">{reel.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(reel.status)}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reel.status)}`}>
                                {reel.status}
                              </span>
                            </div>
                          </div>

                          {reel.status === 'ready' && (
                            <div className="space-y-3">
                              {reel.highlights.map((highlight) => (
                                <div key={highlight.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                                    {getHighlightTypeIcon(highlight.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-medium text-gray-900">{highlight.name}</h5>
                                      <span className={`text-xs font-medium ${getConfidenceColor(highlight.confidence)}`}>
                                        {Math.round(highlight.confidence * 100)}%
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{highlight.description}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                      <span>{formatDuration(highlight.startTime)} - {formatDuration(highlight.endTime)}</span>
                                      <span>Duration: {formatDuration(highlight.duration)}</span>
                                      <span>Type: {highlight.type}</span>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="ghost">
                                    <Play className="h-4 w-4 mr-1" />
                                    Preview
                                  </Button>
                                </div>
                              ))}
                              
                              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                  Total duration: {formatDuration(reel.duration)} • {reel.highlights.length} highlights
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                  <Button size="sm">
                                    <Scissors className="h-4 w-4 mr-1" />
                                    Edit Reel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {reel.status === 'generating' && (
                            <div className="text-center py-8">
                              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-pulse" />
                              <p className="text-sm text-gray-500">Analyzing content and generating highlights...</p>
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
                        <h4 className="font-medium text-blue-900 mb-2">Instant Promotional Content</h4>
                        <p className="text-sm text-blue-700">Automatically creates engaging promotional content</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Increased Engagement</h4>
                        <p className="text-sm text-green-700">Highlights increase viewer engagement and retention</p>
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
                        <Eye className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">ML-based scene detection and analysis</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Automated editing algorithms</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Content-aware highlight selection</span>
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
