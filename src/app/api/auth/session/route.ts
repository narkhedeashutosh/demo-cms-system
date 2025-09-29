import { NextResponse } from 'next/server'

export async function GET() {
  // Mock session data - in a real app, this would check actual authentication
  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    permissions: [
      { id: '1', name: 'View Assets', description: 'View and browse media assets', resource: 'assets', action: 'read' },
      { id: '2', name: 'Upload Assets', description: 'Upload new media assets', resource: 'assets', action: 'create' },
      { id: '3', name: 'Edit Assets', description: 'Edit asset metadata and properties', resource: 'assets', action: 'update' },
      { id: '4', name: 'Delete Assets', description: 'Delete media assets', resource: 'assets', action: 'delete' },
      { id: '5', name: 'View Users', description: 'View user accounts and information', resource: 'users', action: 'read' },
      { id: '6', name: 'Manage Users', description: 'Create, edit, and delete user accounts', resource: 'users', action: 'create' },
      { id: '7', name: 'Edit Users', description: 'Edit user information and permissions', resource: 'users', action: 'update' },
      { id: '8', name: 'Delete Users', description: 'Delete user accounts', resource: 'users', action: 'delete' },
      { id: '9', name: 'View Settings', description: 'View system settings', resource: 'settings', action: 'read' },
      { id: '10', name: 'Manage Settings', description: 'Modify system settings', resource: 'settings', action: 'update' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return NextResponse.json(mockUser)
}
