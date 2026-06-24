'use client'

import { useState, useEffect } from 'react'

export function PreLoader() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check session storage to prevent repeated loader plays on page transition
    if (sessionStorage.getItem('wcc-has-seen-intro')) {
      setIsDone(true)
      document.body.classList.add('preloader-done')
      document.documentElement.classList.add('preloader-done')
      return
    }

    document.body.style.overflow = 'hidden'

    // Start progress counter
    const startTime = performance.now()
    const duration = 1800 // 1.8 seconds

    let rafId: number
    
    const updateProgress = (now: number) => {
      const elapsed = now - startTime
      const percent = Math.min(elapsed / duration, 1)
      
      // easeInOutCubic for butter-smooth cinematic acceleration/deceleration
      const ease = percent < 0.5 
        ? 4 * percent * percent * percent 
        : 1 - Math.pow(-2 * percent + 2, 3) / 2
        
      setProgress(Math.round(ease * 100))

      if (percent < 1) {
        rafId = requestAnimationFrame(updateProgress)
      } else {
        sessionStorage.setItem('wcc-has-seen-intro', 'true')
        setTimeout(() => {
          setIsFading(true)
          setTimeout(() => {
            setIsDone(true)
            document.body.classList.add('preloader-done')
            document.documentElement.classList.add('preloader-done')
            document.body.style.overflow = ''
          }, 800) // smooth fade duration
        }, 300) // brief pause at 100%
      }
    }

    rafId = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(rafId)
      document.body.style.overflow = ''
    }
  }, [])

  if (isDone) return null

  return (
    <div
      id="global-preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#060606',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.05)' : 'scale(1)',
        filter: isFading ? 'blur(10px)' : 'none',
        transition: 'opacity 0.9s cubic-bezier(0.76, 0, 0.24, 1), transform 0.9s cubic-bezier(0.76, 0, 0.24, 1), filter 0.9s cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      {/* Cinematic Ambient Backdrop Glow — Brand Royal Blue */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Cinematic Floating Logo Frame */}
      <div
        className="preloader-logo-animate"
        style={{
          position: 'relative',
          zIndex: 10,
          marginBottom: '28px',
          width: '100px',
          height: '100px',
          opacity: 0, // Controlled by CSS @keyframes animation
        }}
      >
        <img
          src="/images/wcc-logo.png"
          alt="WCC Fashions Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 15px 30px rgba(59,130,246,0.25))',
          }}
        />
      </div>

      {/* Editorial Cinematic Brand Text */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'white', fontFamily: 'sans-serif' }}>
        <h1
          className="preloader-title-animate"
          style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0, // Controlled by CSS @keyframes animation
          }}
        >
          WCC <span style={{ fontWeight: 400, color: '#3B82F6' }}>FASHIONS</span>
        </h1>
        <p
          className="preloader-sub-animate"
          style={{
            margin: '8px 0 0 0',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'monospace',
            opacity: 0, // Controlled by CSS @keyframes animation
          }}
        >
          Western Clothing Co. · Est. 2001
        </p>
      </div>

      {/* Modern High-End progress indicator line */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: '44px',
          width: '200px',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(to right, transparent, #3B82F6)',
            transition: 'width 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    </div>
  )
}

