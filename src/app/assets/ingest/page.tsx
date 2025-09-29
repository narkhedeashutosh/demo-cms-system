'use client'

import React, { useState, useCallback } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { UploadProgress } from '@/types'
import { formatFileSize } from '@/lib/utils'
import {
  Upload,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Film,
  Image,
  Music,
} from 'lucide-react'

export default function AssetIngestPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const newUploads: UploadProgress[] = files.map(file => ({
      fileId: Math.random().toString(36).substr(2, 9),
      filename: file.name,
      progress: 0,
      status: 'uploading',
    }))

    setUploads(prev => [...prev, ...newUploads])
    setIsUploading(true)

    // Simulate upload progress
    newUploads.forEach((upload, index) => {
      simulateUpload(upload.fileId, index * 1000)
    })
  }

  const simulateUpload = (fileId: string, delay: number) => {
    setTimeout(() => {
      setUploads(prev => prev.map(upload => 
        upload.fileId === fileId 
          ? { ...upload, progress: 25, status: 'uploading' as const }
          : upload
      ))
    }, delay + 500)

    setTimeout(() => {
      setUploads(prev => prev.map(upload => 
        upload.fileId === fileId 
          ? { ...upload, progress: 50, status: 'uploading' as const }
          : upload
      ))
    }, delay + 1000)

    setTimeout(() => {
      setUploads(prev => prev.map(upload => 
        upload.fileId === fileId 
          ? { ...upload, progress: 75, status: 'uploading' as const }
          : upload
      ))
    }, delay + 1500)

    setTimeout(() => {
      setUploads(prev => prev.map(upload => 
        upload.fileId === fileId 
          ? { ...upload, progress: 100, status: 'completed' as const }
          : upload
      ))
      
      // Check if all uploads are complete
      setTimeout(() => {
        setUploads(prev => {
          const allComplete = prev.every(upload => upload.status === 'completed' || upload.status === 'error')
          if (allComplete) {
            setIsUploading(false)
          }
          return prev
        })
      }, 100)
    }, delay + 2000)
  }

  const removeUpload = (fileId: string) => {
    setUploads(prev => prev.filter(upload => upload.fileId !== fileId))
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase()
    
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension || '')) {
      return <Film className="h-8 w-8 text-blue-500" />
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return <Image className="h-8 w-8 text-green-500" />
    } else if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension || '')) {
      return <Music className="h-8 w-8 text-purple-500" />
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Ingest</h1>
          <p className="text-gray-600">Upload and process new media assets</p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardContent className="p-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="video/*,audio/*,image/*,.pdf,.doc,.docx"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {isUploading ? 'Uploading...' : 'Upload files'}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop files here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supports video, audio, image, and document files
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploads.map((upload) => (
                  <div key={upload.fileId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getFileIcon(upload.filename)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {upload.filename}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>{upload.progress}%</span>
                          <span className="capitalize">{upload.status}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              upload.status === 'error' 
                                ? 'bg-red-500' 
                                : upload.status === 'completed' 
                                ? 'bg-green-500' 
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${upload.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusIcon(upload.status)}
                      <button
                        onClick={() => removeUpload(upload.fileId)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!isUploading && uploads.some(upload => upload.status === 'completed') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => setUploads([])}
                    variant="secondary"
                  >
                    Clear Completed
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upload Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Supported Formats</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><strong>Video:</strong> MP4, AVI, MOV, WMV, FLV, WebM</li>
                  <li><strong>Audio:</strong> MP3, WAV, FLAC, AAC, OGG</li>
                  <li><strong>Images:</strong> JPG, PNG, GIF, BMP, WebP</li>
                  <li><strong>Documents:</strong> PDF, DOC, DOCX</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">File Limits</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><strong>Max file size:</strong> 2GB per file</li>
                  <li><strong>Max files per upload:</strong> 50 files</li>
                  <li><strong>Total upload limit:</strong> 10GB per session</li>
                  <li><strong>Processing time:</strong> 1-5 minutes per file</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
