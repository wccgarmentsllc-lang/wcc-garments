'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface VideoCardProps {
  src?: string
  poster: string
  title?: string
  className?: string
}

export function VideoCard({ src, poster, title, className = '' }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleHoverStart = () => {
    if (videoRef.current && src) {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handleHoverEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  return (
    <div
      className={`image-hover-zoom group relative cursor-pointer overflow-hidden ${className}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      data-cursor="play"
    >
      <Image
        src={poster}
        alt={title || 'Video thumbnail'}
        fill
        className={`object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
      />
      {src && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/50 bg-black/30 backdrop-blur-sm">
          <Play className="ml-1 h-6 w-6 text-white" fill="white" />
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-sm font-medium text-white">{title}</p>
        </div>
      )}
    </div>
  )
}
