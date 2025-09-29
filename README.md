# Media Asset Management System

A comprehensive media asset management website built with React, Next.js, and Tailwind CSS. This system provides a complete solution for managing, organizing, and processing media assets with advanced features like tagging, subtitles, and user permissions.

## Features

### Core Functionality
- **Asset Library**: Browse, search, and filter media assets with advanced search capabilities
- **Asset Upload**: Drag-and-drop file upload with progress tracking and format validation
- **Asset Processing**: Automated processing pipeline with status monitoring
- **Asset Review**: Detailed technical metadata display and analysis
- **Asset Restoration**: Recover deleted assets from trash
- **Search & Filtering**: Global search across all assets with multiple filter options

### Advanced Features
- **Asset Tagging**: Add and manage metadata tags with custom categories and colors
- **Subtitle Management**: Add, edit, and manage subtitles for video and audio content
- **User Permissions**: Role-based access control with granular permissions
- **Technical Metadata**: Display comprehensive technical information for media files
- **Real-time Processing**: Monitor asset processing jobs with live status updates

### User Interface
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Interactive Components**: Rich user interactions with drag-and-drop, modals, and forms
- **Accessibility**: Built with accessibility best practices

## Technology Stack

- **Frontend**: React 18, Next.js 15, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Media Player**: React Player

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd media-asset-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login
- Email: `admin@example.com`
- Password: `password`

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin-only pages
│   ├── assets/            # Asset management pages
│   ├── dashboard/         # Dashboard page
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## Pages Overview

### Dashboard
- Overview of system statistics
- Recent uploads and processing queue
- Storage usage monitoring
- Quick access to key features

### Asset Library
- Grid view of all media assets
- Advanced search and filtering
- Bulk operations (select, delete, download)
- Asset preview and metadata

### Asset Ingest
- Drag-and-drop file upload
- Upload progress tracking
- File format validation
- Batch upload support

### Asset Onboard
- Processing job monitoring
- Real-time status updates
- Error handling and retry
- Processing pipeline visualization

### Asset Review
- Technical metadata display
- Media player integration
- Asset analysis tools
- Quality assessment

### Asset Tagging
- Tag management system
- Custom categories and colors
- Bulk tagging operations
- Tag-based filtering

### Asset Subtitles
- Subtitle editor
- Multi-language support
- Time-synchronized editing
- Subtitle format support

### Asset Restore
- Deleted asset recovery
- Trash management
- Permanent deletion
- Recovery time limits

### User Permissions
- User account management
- Role-based access control
- Permission assignment
- User activity monitoring

## Key Features

### Search & Filtering
- Global search across all assets
- Filter by file type, status, tags, and date
- Sort by name, size, date, or duration
- Advanced search operators

### Asset Processing
- Automated thumbnail generation
- Metadata extraction
- Format conversion
- Quality optimization
- Error handling and retry

### User Management
- Role-based permissions (Admin, Editor, Viewer)
- Granular permission control
- User activity tracking
- Account management

### Media Support
- **Video**: MP4, AVI, MOV, WMV, FLV, WebM
- **Audio**: MP3, WAV, FLAC, AAC, OGG
- **Images**: JPG, PNG, GIF, BMP, WebP
- **Documents**: PDF, DOC, DOCX

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.