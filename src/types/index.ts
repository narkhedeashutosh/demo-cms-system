export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: 'assets' | 'users' | 'settings';
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface Asset {
  id: string;
  filename: string;
  originalName: string;
  fileType: 'video' | 'audio' | 'image' | 'document';
  mimeType: string;
  fileSize: number;
  duration?: number; // for video/audio
  width?: number; // for video/image
  height?: number; // for video/image
  bitrate?: number; // for video/audio
  codec?: string; // for video/audio
  frameRate?: number; // for video
  sampleRate?: number; // for audio
  channels?: number; // for audio
  status: 'uploading' | 'processing' | 'ready' | 'error' | 'deleted';
  tags: Tag[];
  metadata: Record<string, any>;
  subtitles: Subtitle[];
  uploadedBy: string;
  uploadedAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  thumbnailUrl?: string;
  previewUrl?: string;
  downloadUrl: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
  createdAt: Date;
}

export interface Subtitle {
  id: string;
  language: string;
  content: string;
  startTime: number;
  endTime: number;
  assetId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  fileType?: string[];
  status?: string[];
  tags?: string[];
  uploadedBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'name' | 'uploadedAt' | 'fileSize' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalAssets: number;
  totalSize: number;
  recentUploads: number;
  processingQueue: number;
  storageUsed: number;
  storageLimit: number;
}

export interface UploadProgress {
  fileId: string;
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}
