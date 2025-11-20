'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdvancedVideoPlayer from '@/components/player/AdvancedVideoPlayer'
import { Asset } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Film,
  Image,
  Music,
  FileText,
  Zap,
  Eye,
  Download,
  Clock,
  BarChart3,
  Shield,
  Target,
  Activity,
} from 'lucide-react'

interface QCResult {
  id: string
  name: string
  status: 'passed' | 'warning' | 'failed'
  description: string
  details: string
  timestamp: number
}

interface QCReport {
  assetId: string
  overallStatus: 'passed' | 'warning' | 'failed'
  results: QCResult[]
  generatedAt: Date
  duration: number
}

export default function AssureQCPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [qcReport, setQcReport] = useState<QCReport | null>(null)
  const [isRunningQC, setIsRunningQC] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedQCChecks, setSelectedQCChecks] = useState({
    loudness: true,
    blackFrames: true,
    pixelation: true,
    macroblocks: true,
    captions: true,
    compliance: true
  })

  const qcChecks = [
    {
      id: 'loudness',
      name: 'Loudness Analysis',
      description: 'EBU R128, ITU-R BS.1770 compliance',
      icon: Volume2
    },
    {
      id: 'blackFrames',
      name: 'Black Frame Detection',
      description: 'Detects silent/black content',
      icon: Eye
    },
    {
      id: 'pixelation',
      name: 'Pixelation Detection',
      description: 'Identifies compression artifacts',
      icon: Target
    },
    {
      id: 'macroblocks',
      name: 'Macroblock Detection',
      description: 'Detects encoding blocks',
      icon: BarChart3
    },
    {
      id: 'captions',
      name: 'Caption Compliance',
      description: 'Accessibility standards check',
      icon: FileText
    },
    {
      id: 'compliance',
      name: 'Broadcast Compliance',
      description: 'Technical specification validation',
      icon: Shield
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
        status: 'processing',
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

    setTimeout(() => {
      setAssets(mockAssets)
      setSelectedAsset(mockAssets[0])
      setIsLoading(false)
    }, 1000)
  }, [])

  const runQualityCheck = async () => {
    if (!selectedAsset) return

    setIsRunningQC(true)
    
    // Mock QC process
    setTimeout(() => {
      const mockResults: QCResult[] = [
        {
          id: '1',
          name: 'Loudness Analysis',
          status: 'passed',
          description: 'Audio levels within acceptable range',
          details: 'Integrated loudness: -23.1 LUFS (Target: -23.0 ± 0.5 LUFS)',
          timestamp: Date.now()
        },
        {
          id: '2',
          name: 'Black Frame Detection',
          status: 'warning',
          description: 'Minor black frames detected',
          details: '3 black frames found at 0:15, 0:45, 1:20 (within tolerance)',
          timestamp: Date.now()
        },
        {
          id: '3',
          name: 'Pixelation Detection',
          status: 'passed',
          description: 'No significant pixelation detected',
          details: 'Compression quality: 95% (Threshold: 90%)',
          timestamp: Date.now()
        },
        {
          id: '4',
          name: 'Macroblock Detection',
          status: 'passed',
          description: 'No macroblocks detected',
          details: 'Encoding quality: Excellent',
          timestamp: Date.now()
        },
        {
          id: '5',
          name: 'Caption Compliance',
          status: 'failed',
          description: 'Missing required captions',
          details: 'No closed captions found (Required for accessibility)',
          timestamp: Date.now()
        },
        {
          id: '6',
          name: 'Broadcast Compliance',
          status: 'passed',
          description: 'Meets broadcast standards',
          details: 'Resolution: 1920x1080, Frame Rate: 30fps, Codec: H.264',
          timestamp: Date.now()
        }
      ]

      const overallStatus = mockResults.some(r => r.status === 'failed') ? 'failed' : 
                           mockResults.some(r => r.status === 'warning') ? 'warning' : 'passed'

      setQcReport({
        assetId: selectedAsset.id,
        overallStatus,
        results: mockResults,
        generatedAt: new Date(),
        duration: selectedAsset.duration || 0
      })
      setIsRunningQC(false)
    }, 3000)
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
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
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
          <h1 className="text-2xl font-bold text-gray-900">AssureQC</h1>
          <p className="text-gray-600">File-based quality check for loudness, black frames, pixelation, macroblocks, captions, compliance</p>
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

            {/* QC Configuration */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>QC Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qcChecks.map((check) => (
                    <label key={check.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedQCChecks[check.id as keyof typeof selectedQCChecks]}
                        onChange={(e) => setSelectedQCChecks(prev => ({
                          ...prev,
                          [check.id]: e.target.checked
                        }))}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <check.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">{check.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{check.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={runQualityCheck}
                  disabled={isRunningQC || !selectedAsset}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isRunningQC ? 'Running QC...' : 'Run Quality Check'}
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

                {/* QC Results */}
                {qcReport && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Quality Check Results</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(qcReport.overallStatus)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(qcReport.overallStatus)}`}>
                            {qcReport.overallStatus.toUpperCase()}
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {qcReport.results.map((result) => (
                          <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                {getStatusIcon(result.status)}
                                <div>
                                  <h4 className="font-medium text-gray-900">{result.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                                  <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-50 p-2 rounded">
                                    {result.details}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                                {result.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Report generated: {qcReport.generatedAt.toLocaleString()}</span>
                          <span>Duration: {formatDuration(qcReport.duration)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Business Value */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Regulatory Compliance</h4>
                        <p className="text-sm text-blue-700">Ensures content meets broadcast and accessibility standards</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Reduces Rework</h4>
                        <p className="text-sm text-green-700">Catches quality issues early in the workflow</p>
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
                        <Activity className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">ML-based error detection algorithms</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Industry QC templates and standards</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Automated compliance validation</span>
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
