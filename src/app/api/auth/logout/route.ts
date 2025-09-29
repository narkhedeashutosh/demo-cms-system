import { NextResponse } from 'next/server'

export async function POST() {
  // Mock logout - in a real app, this would clear the session
  return NextResponse.json({ success: true })
}
