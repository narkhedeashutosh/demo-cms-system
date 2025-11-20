'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  Rewind,
  Captions,
  Monitor,
  ChevronDown,
} from 'lucide-react'

interface AdvancedVideoPlayerProps {
  src: string
  subtitles?: Array<{
    id: string
    language: string
    content: string
    startTime: number
    endTime: number
  }>
  onTimeUpdate?: (currentTime: number) => void
  onDurationChange?: (duration: number) => void
  className?: string
}

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return url
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
}

export default function AdvancedVideoPlayer({
  src,
  subtitles = [],
  onTimeUpdate,
  onDurationChange,
  className = ''
}: AdvancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('')
  const [safeAreaRatio, setSafeAreaRatio] = useState<'16:9' | '4:3'>('16:9')
  const [showSafeArea, setShowSafeArea] = useState(false)

  // Check if the source is a YouTube URL
  const isYouTubeUrl = getYouTubeVideoId(src) !== null
  const youtubeEmbedUrl = isYouTubeUrl ? getYouTubeEmbedUrl(src) : null

  const playbackRates = [0.25, 0.5, 1, 2, 4, 8]

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }, [])

  const handleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }, [isMuted, volume])

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }, [])

  const handleSkip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }, [])

  const handleFrameStep = useCallback((direction: 'forward' | 'backward') => {
    if (videoRef.current) {
      const frameTime = 1 / 30 // Assuming 30fps
      const currentTime = videoRef.current.currentTime
      const newTime = direction === 'forward' 
        ? currentTime + frameTime 
        : currentTime - frameTime
      handleSeek(Math.max(0, Math.min(newTime, duration)))
    }
  }, [duration, handleSeek])

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    const frames = Math.floor((time % 1) * 30) // Assuming 30fps
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
  }

  const getSafeAreaStyle = () => {
    if (!showSafeArea) return {}
    
    const is16_9 = safeAreaRatio === '16:9'
    return {
      position: 'absolute' as const,
      top: '12.5%',
      left: is16_9 ? '12.5%' : '6.25%',
      right: is16_9 ? '12.5%' : '6.25%',
      bottom: '12.5%',
      border: '2px dashed rgba(255, 255, 255, 0.7)',
      pointerEvents: 'none' as const,
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime)
      
      // Update current subtitle
      const currentSub = subtitles.find(sub => 
        video.currentTime >= sub.startTime && video.currentTime <= sub.endTime
      )
      setCurrentSubtitle(currentSub?.content || '')
    }

    const handleDurationChange = () => {
      setDuration(video.duration)
      onDurationChange?.(video.duration)
    }

    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [subtitles, onTimeUpdate, onDurationChange])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          handlePlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleSkip(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          handleSkip(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          handleVolumeChange(Math.min(1, volume + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          handleVolumeChange(Math.max(0, volume - 0.1))
          break
        case 'KeyM':
          e.preventDefault()
          handleMute()
          break
        case 'KeyF':
          e.preventDefault()
          handleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handlePlayPause, handleSkip, handleVolumeChange, volume, handleMute, handleFullscreen])

  // If it's a YouTube URL, render YouTube embed
  if (isYouTubeUrl && youtubeEmbedUrl) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={youtubeEmbedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="YouTube video player"
        />
      </div>
    )
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={handlePlayPause}
        />
        
        {/* Safe Area Overlay */}
        {showSafeArea && (
          <div style={getSafeAreaStyle()} />
        )}

        {/* Current Subtitle */}
        {showSubtitles && currentSubtitle && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded text-center max-w-4xl">
            <p className="text-lg">{currentSubtitle}</p>
          </div>
        )}

        {/* Controls */}
        <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Progress Bar */}
          <div className="px-4 mb-2">
            <div className="relative">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div
                className="absolute top-0 left-0 h-1 bg-blue-500 rounded-lg pointer-events-none"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Control Bar */}
          <div className="bg-gradient-to-t from-black to-transparent px-4 py-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button onClick={handlePlayPause} className="hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>

                {/* Skip Controls */}
                <button onClick={() => handleSkip(-10)} className="hover:scale-110 transition-transform">
                  <Rewind className="h-5 w-5" />
                </button>
                <button onClick={() => handleSkip(10)} className="hover:scale-110 transition-transform">
                  <FastForward className="h-5 w-5" />
                </button>

                {/* Frame Controls */}
                <button onClick={() => handleFrameStep('backward')} className="hover:scale-110 transition-transform">
                  <SkipBack className="h-5 w-5" />
                </button>
                <button onClick={() => handleFrameStep('forward')} className="hover:scale-110 transition-transform">
                  <SkipForward className="h-5 w-5" />
                </button>

                {/* Time Display */}
                <span className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <button onClick={handleMute} className="hover:scale-110 transition-transform">
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Subtitle Toggle */}
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`hover:scale-110 transition-transform ${showSubtitles ? 'text-blue-400' : ''}`}
                >
                  <Captions className="h-5 w-5" />
                </button>

                {/* Safe Area Toggle */}
                <button
                  onClick={() => setShowSafeArea(!showSafeArea)}
                  className={`hover:scale-110 transition-transform ${showSafeArea ? 'text-blue-400' : ''}`}
                >
                  <Monitor className="h-5 w-5" />
                </button>

                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Settings className="h-5 w-5" />
                  </button>

                  {/* Settings Dropdown */}
                  {showSettings && (
                    <div className="absolute bottom-8 right-0 bg-gray-800 rounded-lg p-4 min-w-48">
                      <div className="space-y-3">
                        {/* Playback Speed */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Playback Speed
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {playbackRates.map((rate) => (
                              <button
                                key={rate}
                                onClick={() => handlePlaybackRateChange(rate)}
                                className={`px-2 py-1 text-xs rounded ${
                                  playbackRate === rate 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Safe Area Ratio */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Safe Area Ratio
                          </label>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSafeAreaRatio('16:9')}
                              className={`px-3 py-1 text-xs rounded ${
                                safeAreaRatio === '16:9' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              16:9
                            </button>
                            <button
                              onClick={() => setSafeAreaRatio('4:3')}
                              className={`px-3 py-1 text-xs rounded ${
                                safeAreaRatio === '4:3' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              4:3
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button onClick={handleFullscreen} className="hover:scale-110 transition-transform">
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
