'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Asset, SearchFilters } from '@/types'
import { formatFileSize, formatDuration, formatDate } from '@/lib/utils'
import {
  Search,
  Filter,
  Film,
  Image,
  Music,
  FileText,
  Play,
  Pause,
  Eye,
  Tag,
  Trash2,
  Download,
  Grid3X3,
  List,
  Archive,
  RotateCcw,
} from 'lucide-react'

export default function AssetLibraryPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    fileType: [],
    status: [],
    tags: [],
    sortBy: 'uploadedAt',
    sortOrder: 'desc',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
        tags: [{ id: '1', name: 'Marketing', color: 'blue', category: 'Department', createdAt: new Date() }],
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
        filename: 'company-logo.png',
        originalName: 'Company Logo.png',
        fileType: 'image',
        mimeType: 'image/png',
        fileSize: 2500000,
        width: 512,
        height: 512,
        status: 'ready',
        tags: [{ id: '2', name: 'Branding', color: 'green', category: 'Type', createdAt: new Date() }],
        metadata: {},
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
        status: 'processing',
        tags: [{ id: '3', name: 'Podcast', color: 'purple', category: 'Content', createdAt: new Date() }],
        metadata: {},
        subtitles: [],
        uploadedBy: 'bob@example.com',
        uploadedAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000),
        downloadUrl: '/api/assets/3/download',
      },
    ]

    setTimeout(() => {
      setAssets(mockAssets)
      setFilteredAssets(mockAssets)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = [...assets]

    // Search query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(asset =>
        asset.originalName.toLowerCase().includes(query) ||
        asset.filename.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.name.toLowerCase().includes(query))
      )
    }

    // File type filter
    if (filters.fileType && filters.fileType.length > 0) {
      filtered = filtered.filter(asset => filters.fileType!.includes(asset.fileType))
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(asset => filters.status!.includes(asset.status))
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(asset =>
        asset.tags.some(tag => filters.tags!.includes(tag.id))
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.originalName
          bValue = b.originalName
          break
        case 'fileSize':
          aValue = a.fileSize
          bValue = b.fileSize
          break
        case 'duration':
          aValue = a.duration || 0
          bValue = b.duration || 0
          break
        case 'uploadedAt':
        default:
          aValue = a.uploadedAt.getTime()
          bValue = b.uploadedAt.getTime()
          break
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredAssets(filtered)
  }, [assets, filters])

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }))
  }

  const handleFileTypeFilter = (fileType: string) => {
    setFilters(prev => ({
      ...prev,
      fileType: prev.fileType?.includes(fileType)
        ? prev.fileType.filter(t => t !== fileType)
        : [...(prev.fileType || []), fileType]
    }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status?.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...(prev.status || []), status]
    }))
  }

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    )
  }

  const handleSelectAll = () => {
    setSelectedAssets(
      selectedAssets.length === filteredAssets.length
        ? []
        : filteredAssets.map(asset => asset.id)
    )
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'uploading':
        return 'bg-blue-100 text-blue-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'deleted':
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AssetLib</h1>
            <p className="text-gray-600">Manage and organize your media assets</p>
          </div>
          <div className="flex space-x-3">
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={filters.query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                    <div className="space-y-2">
                      {['video', 'image', 'audio', 'document'].map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.fileType?.includes(type) || false}
                            onChange={() => handleFileTypeFilter(type)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="space-y-2">
                      {['ready', 'processing', 'uploading', 'error'].map(status => (
                        <label key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.status?.includes(status) || false}
                            onChange={() => handleStatusFilter(status)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="uploadedAt">Upload Date</option>
                      <option value="name">Name</option>
                      <option value="fileSize">File Size</option>
                      <option value="duration">Duration</option>
                    </select>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as any }))}
                      className="block w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-700">
            {filteredAssets.length} of {assets.length} assets
          </p>
          {filteredAssets.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedAssets.length === filteredAssets.length ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedAssets.length > 0 && (
                <>
                  <Button variant="secondary" size="sm">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive ({selectedAssets.length})
                  </Button>
                  <Button variant="danger" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedAssets.length})
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Asset Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                {asset.thumbnailUrl ? (
                  <img
                    src={asset.thumbnailUrl}
                    alt={asset.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {getFileTypeIcon(asset.fileType)}
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset.id)}
                    onChange={() => handleSelectAsset(asset.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </div>
                {asset.fileType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
                          <Play className="h-6 w-6" />
                        </button>
                      </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 truncate" title={asset.originalName}>
                    {asset.originalName}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatFileSize(asset.fileSize)}</span>
                    {asset.duration && (
                      <span>{formatDuration(asset.duration)}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(asset.uploadedAt)}</span>
                    <span>{asset.uploadedBy}</span>
                  </div>

                  {asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.name}
                        </span>
                      ))}
                      {asset.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{asset.tags.length - 2} more</span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        ) : (
          <div className="space-y-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => handleSelectAsset(asset.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div className="flex-shrink-0 w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                      {getFileTypeIcon(asset.fileType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {asset.originalName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{formatFileSize(asset.fileSize)}</span>
                        {asset.duration && (
                          <span>{formatDuration(asset.duration)}</span>
                        )}
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                        <span>Uploaded {formatDate(asset.uploadedAt)}</span>
                      </div>
                      
                      {asset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {asset.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredAssets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-500">
                {filters.query || filters.fileType?.length || filters.status?.length
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first asset to get started'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
