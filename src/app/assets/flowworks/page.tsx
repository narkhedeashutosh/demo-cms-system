'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AdvancedVideoPlayer from '@/components/player/AdvancedVideoPlayer'
import { Asset } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'
import {
  Workflow,
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
  ArrowRight,
  RotateCcw,
  Eye,
  Cpu,
  Database,
  Globe,
} from 'lucide-react'

interface WorkflowStep {
  id: string
  name: string
  description: string
  type: 'ingest' | 'qc' | 'transcode' | 'delivery' | 'review' | 'approval'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  duration?: number
  startedAt?: Date
  completedAt?: Date
  output?: string
  dependencies: string[]
  icon: React.ComponentType<any>
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  estimatedDuration: number
  category: 'broadcast' | 'ott' | 'social' | 'custom'
}

interface ActiveWorkflow {
  id: string
  name: string
  assetId: string
  templateId: string
  steps: WorkflowStep[]
  status: 'running' | 'completed' | 'failed' | 'paused'
  progress: number
  startedAt: Date
  estimatedCompletion?: Date
  currentStep?: string
}

export default function FlowWorksPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [activeWorkflows, setActiveWorkflows] = useState<ActiveWorkflow[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [isStarting, setIsStarting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'broadcast-standard',
      name: 'Broadcast Standard',
      description: 'Complete broadcast workflow from ingest to delivery',
      estimatedDuration: 45,
      category: 'broadcast',
      steps: [
        {
          id: 'ingest',
          name: 'Ingest',
          description: 'Upload and validate media files',
          type: 'ingest',
          status: 'pending',
          dependencies: [],
          icon: Database
        },
        {
          id: 'qc',
          name: 'Quality Check',
          description: 'Automated quality assurance',
          type: 'qc',
          status: 'pending',
          dependencies: ['ingest'],
          icon: Eye
        },
        {
          id: 'transcode',
          name: 'Transcode',
          description: 'Convert to broadcast formats',
          type: 'transcode',
          status: 'pending',
          dependencies: ['qc'],
          icon: Cpu
        },
        {
          id: 'review',
          name: 'Review',
          description: 'Manual review and approval',
          type: 'review',
          status: 'pending',
          dependencies: ['transcode'],
          icon: Play
        },
        {
          id: 'delivery',
          name: 'Delivery',
          description: 'Package for broadcast delivery',
          type: 'delivery',
          status: 'pending',
          dependencies: ['review'],
          icon: Globe
        }
      ]
    },
    {
      id: 'ott-optimized',
      name: 'OTT Optimized',
      description: 'Streaming-optimized workflow with multiple formats',
      estimatedDuration: 35,
      category: 'ott',
      steps: [
        {
          id: 'ingest',
          name: 'Ingest',
          description: 'Upload and validate media files',
          type: 'ingest',
          status: 'pending',
          dependencies: [],
          icon: Database
        },
        {
          id: 'transcode',
          name: 'Multi-format Transcode',
          description: 'Create ABR streaming formats',
          type: 'transcode',
          status: 'pending',
          dependencies: ['ingest'],
          icon: Cpu
        },
        {
          id: 'delivery',
          name: 'CDN Delivery',
          description: 'Deploy to content delivery network',
          type: 'delivery',
          status: 'pending',
          dependencies: ['transcode'],
          icon: Globe
        }
      ]
    },
    {
      id: 'social-media',
      name: 'Social Media',
      description: 'Quick workflow for social media content',
      estimatedDuration: 15,
      category: 'social',
      steps: [
        {
          id: 'ingest',
          name: 'Ingest',
          description: 'Upload and validate media files',
          type: 'ingest',
          status: 'pending',
          dependencies: [],
          icon: Database
        },
        {
          id: 'transcode',
          name: 'Social Formats',
          description: 'Create platform-specific formats',
          type: 'transcode',
          status: 'pending',
          dependencies: ['ingest'],
          icon: Cpu
        },
        {
          id: 'delivery',
          name: 'Social Publishing',
          description: 'Deploy to social platforms',
          type: 'delivery',
          status: 'pending',
          dependencies: ['transcode'],
          icon: Globe
        }
      ]
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

    const mockActiveWorkflows: ActiveWorkflow[] = [
      {
        id: '1',
        name: 'Product Demo - Broadcast Standard',
        assetId: '1',
        templateId: 'broadcast-standard',
        steps: [
          {
            id: 'ingest',
            name: 'Ingest',
            description: 'Upload and validate media files',
            type: 'ingest',
            status: 'completed',
            duration: 120,
            startedAt: new Date(Date.now() - 3600000),
            completedAt: new Date(Date.now() - 3480000),
            dependencies: [],
            icon: Database
          },
          {
            id: 'qc',
            name: 'Quality Check',
            description: 'Automated quality assurance',
            type: 'qc',
            status: 'running',
            startedAt: new Date(Date.now() - 3480000),
            dependencies: ['ingest'],
            icon: Eye
          },
          {
            id: 'transcode',
            name: 'Transcode',
            description: 'Convert to broadcast formats',
            type: 'transcode',
            status: 'pending',
            dependencies: ['qc'],
            icon: Cpu
          },
          {
            id: 'review',
            name: 'Review',
            description: 'Manual review and approval',
            type: 'review',
            status: 'pending',
            dependencies: ['transcode'],
            icon: Play
          },
          {
            id: 'delivery',
            name: 'Delivery',
            description: 'Package for broadcast delivery',
            type: 'delivery',
            status: 'pending',
            dependencies: ['review'],
            icon: Globe
          }
        ],
        status: 'running',
        progress: 35,
        startedAt: new Date(Date.now() - 3600000),
        estimatedCompletion: new Date(Date.now() + 1800000),
        currentStep: 'qc'
      }
    ]

    setTimeout(() => {
      setAssets(mockAssets)
      setSelectedAsset(mockAssets[0])
      setTemplates(workflowTemplates)
      setActiveWorkflows(mockActiveWorkflows)
      setIsLoading(false)
    }, 1000)
  }, [])

  const startWorkflow = async () => {
    if (!selectedAsset || !selectedTemplate) return

    const template = templates.find(t => t.id === selectedTemplate)
    if (!template) return

    setIsStarting(true)
    
    // Mock workflow start
    setTimeout(() => {
      const newWorkflow: ActiveWorkflow = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${selectedAsset.originalName} - ${template.name}`,
        assetId: selectedAsset.id,
        templateId: template.id,
        steps: template.steps.map(step => ({ ...step, status: 'pending' as const })),
        status: 'running',
        progress: 0,
        startedAt: new Date(),
        estimatedCompletion: new Date(Date.now() + template.estimatedDuration * 60000),
        currentStep: template.steps[0].id
      }

      setActiveWorkflows(prev => [newWorkflow, ...prev])
      setSelectedTemplate('')
      setIsStarting(false)

      // Simulate workflow progression
      setTimeout(() => {
        setActiveWorkflows(prev => prev.map(workflow => 
          workflow.id === newWorkflow.id ? {
            ...workflow,
            steps: workflow.steps.map(step => 
              step.id === template.steps[0].id ? { ...step, status: 'running' } : step
            ),
            progress: 10,
            currentStep: template.steps[0].id
          } : workflow
        ))
      }, 2000)

      // Continue simulation...
      template.steps.forEach((step, index) => {
        setTimeout(() => {
          setActiveWorkflows(prev => prev.map(workflow => 
            workflow.id === newWorkflow.id ? {
              ...workflow,
              steps: workflow.steps.map(s => 
                s.id === step.id ? { 
                  ...s, 
                  status: 'completed',
                  startedAt: new Date(Date.now() - (template.steps.length - index) * 60000),
                  completedAt: new Date()
                } : 
                s.id === template.steps[index + 1]?.id ? { ...s, status: 'running' } : s
              ),
              progress: ((index + 1) / template.steps.length) * 100,
              currentStep: template.steps[index + 1]?.id
            } : workflow
          ))
        }, (index + 1) * 5000)
      })
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

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'skipped':
        return <RotateCcw className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'broadcast':
        return 'bg-red-100 text-red-800'
      case 'ott':
        return 'bg-blue-100 text-blue-800'
      case 'social':
        return 'bg-green-100 text-green-800'
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
          <h1 className="text-2xl font-bold text-gray-900">FlowWorks</h1>
          <p className="text-gray-600">Workflow Orchestration - Automated media workflows (ingest → QC → transcode → publish)</p>
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
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getWorkflowStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workflow Templates */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <label key={template.id} className="block">
                      <div className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="template"
                            value={template.id}
                            checked={selectedTemplate === template.id}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{template.name}</span>
                              <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getCategoryColor(template.category)}`}>
                                {template.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>Steps: {template.steps.length}</div>
                              <div>Estimated Duration: {template.estimatedDuration} min</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={startWorkflow}
                  disabled={isStarting || !selectedAsset || !selectedTemplate}
                >
                  <Workflow className="h-4 w-4 mr-2" />
                  {isStarting ? 'Starting Workflow...' : 'Start Workflow'}
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
                    {selectedAsset.previewUrl ? (
                      <AdvancedVideoPlayer
                        src={selectedAsset.previewUrl}
                        className="w-full aspect-video"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No preview available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Active Workflows */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Workflows</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeWorkflows.filter(workflow => workflow.assetId === selectedAsset.id).map((workflow) => (
                        <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                              <p className="text-sm text-gray-500">
                                Started {workflow.startedAt.toLocaleString()}
                                {workflow.estimatedCompletion && (
                                  <> • ETA: {workflow.estimatedCompletion.toLocaleString()}</>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWorkflowStatusColor(workflow.status)}`}>
                                {workflow.status}
                              </span>
                              <span className="text-sm text-gray-500">{Math.round(workflow.progress)}%</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{Math.round(workflow.progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${workflow.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Workflow Steps */}
                          <div className="space-y-2">
                            {workflow.steps.map((step, index) => (
                              <div key={step.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                {getStepStatusIcon(step.status)}
                                <step.icon className="h-4 w-4 text-gray-500" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">{step.name}</div>
                                  <div className="text-xs text-gray-500">{step.description}</div>
                                </div>
                                {step.status === 'running' && (
                                  <div className="text-xs text-blue-600 font-medium">Running...</div>
                                )}
                                {step.status === 'completed' && step.duration && (
                                  <div className="text-xs text-gray-500">
                                    {Math.round(step.duration / 60)}m
                                  </div>
                                )}
                                {index < workflow.steps.length - 1 && (
                                  <ArrowRight className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                            ))}
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
                        <h4 className="font-medium text-blue-900 mb-2">Eliminates Manual Handoffs</h4>
                        <p className="text-sm text-blue-700">Automates the entire media processing pipeline</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Consistent Processing</h4>
                        <p className="text-sm text-green-700">Ensures standardized, reliable processing workflows</p>
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
                        <span className="text-sm">Event-driven automation engine</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">API orchestration and integration</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Workflow className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Visual workflow designer</span>
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
