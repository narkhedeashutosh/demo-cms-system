'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdvancedVideoPlayer from '@/components/player/AdvancedVideoPlayer'
import { Asset } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  Globe,
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
  Mic,
  Volume2,
  Languages,
  MessageSquare,
  User,
  Star,
  Brain,
} from 'lucide-react'

interface Subtitle {
  id: string
  language: string
  content: string
  startTime: number
  endTime: number
  confidence: number
  speaker?: string
  translation?: string
}

interface DubbingTrack {
  id: string
  language: string
  voice: string
  gender: 'male' | 'female' | 'neutral'
  accent: string
  status: 'generating' | 'ready' | 'processing'
  progress: number
  url?: string
}

interface LinguaXProject {
  id: string
  name: string
  assetId: string
  subtitles: Subtitle[]
  dubbingTracks: DubbingTrack[]
  languages: string[]
  status: 'transcribing' | 'translating' | 'dubbing' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export default function LinguaXPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [projects, setProjects] = useState<LinguaXProject[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en'])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    autoTranslate: true,
    generateDubbing: false,
    voiceGender: 'neutral' as 'male' | 'female' | 'neutral',
    accent: 'neutral',
    subtitleStyle: 'modern',
    maxLineLength: 42,
    readingSpeed: 'medium'
  })

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ]

  const voiceOptions = [
    { id: 'male-deep', name: 'Deep Male', gender: 'male', accent: 'neutral' },
    { id: 'male-warm', name: 'Warm Male', gender: 'male', accent: 'american' },
    { id: 'female-professional', name: 'Professional Female', gender: 'female', accent: 'neutral' },
    { id: 'female-friendly', name: 'Friendly Female', gender: 'female', accent: 'british' },
    { id: 'neutral-ai', name: 'AI Neutral', gender: 'neutral', accent: 'neutral' }
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

    const mockProjects: LinguaXProject[] = [
      {
        id: '1',
        name: 'Product Demo - Multilingual',
        assetId: '1',
        subtitles: [
          {
            id: '1',
            language: 'en',
            content: 'Welcome to our product demonstration',
            startTime: 5,
            endTime: 8,
            confidence: 0.98,
            speaker: 'Presenter'
          },
          {
            id: '2',
            language: 'en',
            content: 'Today we will show you the key features',
            startTime: 8,
            endTime: 12,
            confidence: 0.96,
            speaker: 'Presenter',
            translation: 'Hoy les mostraremos las características principales'
          }
        ],
        dubbingTracks: [
          {
            id: '1',
            language: 'es',
            voice: 'Professional Female',
            gender: 'female',
            accent: 'neutral',
            status: 'ready',
            progress: 100,
            url: '/linguax/dubbing/product-demo-es.mp4'
          },
          {
            id: '2',
            language: 'fr',
            voice: 'Deep Male',
            gender: 'male',
            accent: 'neutral',
            status: 'processing',
            progress: 65
          }
        ],
        languages: ['en', 'es', 'fr'],
        status: 'dubbing',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 3600000)
      }
    ]

    setTimeout(() => {
      setAssets(mockAssets)
      setSelectedAsset(mockAssets[0])
      setProjects(mockProjects)
      setIsLoading(false)
    }, 1000)
  }, [])

  const createLinguaXProject = async () => {
    if (!selectedAsset || selectedLanguages.length === 0) return

    setIsProcessing(true)
    
    // Mock processing
    setTimeout(() => {
      const newProject: LinguaXProject = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${selectedAsset.originalName} - LinguaX`,
        assetId: selectedAsset.id,
        subtitles: [],
        dubbingTracks: selectedLanguages.filter(lang => lang !== 'en').map(lang => ({
          id: Math.random().toString(36).substr(2, 9),
          language: lang,
          voice: voiceOptions[0].name,
          gender: voiceOptions[0].gender,
          accent: voiceOptions[0].accent,
          status: 'generating' as const,
          progress: 0
        })),
        languages: selectedLanguages,
        status: 'transcribing',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setProjects(prev => [newProject, ...prev])
      setSelectedLanguages(['en'])
      setIsProcessing(false)

      // Simulate progression
      setTimeout(() => {
        setProjects(prev => prev.map(project => 
          project.id === newProject.id ? { ...project, status: 'translating' } : project
        ))
      }, 3000)

      setTimeout(() => {
        setProjects(prev => prev.map(project => 
          project.id === newProject.id ? { ...project, status: 'dubbing' } : project
        ))
      }, 6000)

      setTimeout(() => {
        setProjects(prev => prev.map(project => 
          project.id === newProject.id ? { ...project, status: 'completed' } : project
        ))
      }, 10000)
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
      case 'transcribing':
        return <Mic className="h-4 w-4 text-blue-500" />
      case 'translating':
        return <Languages className="h-4 w-4 text-purple-500" />
      case 'dubbing':
        return <Volume2 className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'transcribing':
        return 'bg-blue-100 text-blue-800'
      case 'translating':
        return 'bg-purple-100 text-purple-800'
      case 'dubbing':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLanguageFlag = (code: string) => {
    const language = availableLanguages.find(lang => lang.code === code)
    return language?.flag || '🌐'
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
          <h1 className="text-2xl font-bold text-gray-900">LinguaX</h1>
          <p className="text-gray-600">AI-driven subtitling & multilingual dubbing for global distribution</p>
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

            {/* Language Selection */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Target Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableLanguages.map((language) => (
                    <label key={language.code} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLanguages(prev => [...prev, language.code])
                          } else {
                            setSelectedLanguages(prev => prev.filter(lang => lang !== language.code))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-lg">{language.flag}</span>
                      <span className="text-sm font-medium text-gray-900">{language.name}</span>
                    </label>
                  ))}
                </div>

                {showSettings && (
                  <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                    <h4 className="font-medium text-gray-900">Advanced Settings</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Voice Gender
                      </label>
                      <select
                        value={settings.voiceGender}
                        onChange={(e) => setSettings(prev => ({ ...prev, voiceGender: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="neutral">Neutral</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.autoTranslate}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoTranslate: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Auto-translate subtitles</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.generateDubbing}
                        onChange={(e) => setSettings(prev => ({ ...prev, generateDubbing: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Generate dubbing tracks</span>
                    </label>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    {showSettings ? 'Hide' : 'Settings'}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={createLinguaXProject}
                    disabled={isProcessing || !selectedAsset || selectedLanguages.length === 0}
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    {isProcessing ? 'Processing...' : 'Create Project'}
                  </Button>
                </div>
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

                {/* LinguaX Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle>LinguaX Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.filter(project => project.assetId === selectedAsset.id).map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{project.name}</h4>
                              <p className="text-sm text-gray-500">
                                {project.languages.map(lang => getLanguageFlag(lang)).join(' ')} • 
                                Created {project.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(project.status)}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </div>
                          </div>

                          {/* Subtitles */}
                          {project.subtitles.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-medium text-gray-900 mb-2">Subtitles</h5>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {project.subtitles.slice(0, 3).map((subtitle) => (
                                  <div key={subtitle.id} className="text-sm p-2 bg-gray-50 rounded">
                                    <div className="flex justify-between items-start">
                                      <span className="font-medium">{subtitle.content}</span>
                                      <span className="text-xs text-gray-500">
                                        {formatDuration(subtitle.startTime)} - {formatDuration(subtitle.endTime)}
                                      </span>
                                    </div>
                                    {subtitle.translation && (
                                      <div className="text-xs text-gray-600 mt-1 italic">
                                        {subtitle.translation}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dubbing Tracks */}
                          {project.dubbingTracks.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Dubbing Tracks</h5>
                              <div className="space-y-2">
                                {project.dubbingTracks.map((track) => (
                                  <div key={track.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center space-x-3">
                                      <span className="text-lg">{getLanguageFlag(track.language)}</span>
                                      <div>
                                        <div className="text-sm font-medium">{track.language.toUpperCase()}</div>
                                        <div className="text-xs text-gray-500">{track.voice}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      {track.status === 'processing' && (
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                          <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${track.progress}%` }}
                                          />
                                        </div>
                                      )}
                                      {track.status === 'ready' && track.url && (
                                        <Button size="sm" variant="ghost">
                                          <Download className="h-4 w-4 mr-1" />
                                          Download
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
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
                        <h4 className="font-medium text-blue-900 mb-2">Global Reach</h4>
                        <p className="text-sm text-blue-700">Expands content reach to global audiences</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Cost Reduction</h4>
                        <p className="text-sm text-green-700">Reduces localization costs significantly</p>
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
                        <Brain className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">NLP and speech recognition technology</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mic className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Advanced speech synthesis</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Automated timing and synchronization</span>
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
