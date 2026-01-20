import { useState, useRef, useEffect } from 'react'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, title, content, rowRect }) => {
  const [position, setPosition] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const floaterRef = useRef(null)

  useEffect(() => {
    if (isOpen && rowRect) {
      // Generate new position each time floater opens
      const newPosition = calculatePosition(rowRect)
      setPosition(newPosition)
    } else if (!isOpen) {
      // Clear position when closed
      setPosition(null)
    }
  }, [isOpen, rowRect])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const calculatePosition = (rect) => {
    const floaterWidth = 300
    const floaterHeight = 200

    // X: centered on row's right edge, with random variance of -0.7 to +0.1 floater widths
    const xVariance = (Math.random() * 0.8 - 0.7) * floaterWidth // -210 to +30
    const x = rect.right - floaterWidth / 2 + xVariance

    // Y: floater bottom above row bottom, with variance of 0 to +0.2 floater heights
    const yVariance = Math.random() * 0.2 * floaterHeight // 0 to 40
    const y = rect.bottom - floaterHeight + yVariance

    return { x, y }
  }

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'BUTTON') return

    const rect = floaterRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
  }

  const handleClose = () => {
    setPosition(null)
    onClose()
  }

  if (!isOpen || !position) return null

  return (
    <div
      ref={floaterRef}
      className={styles.floater}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <button
        className={styles.closeButton}
        onClick={handleClose}
      >
        ×
      </button>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  )
}

export default Floater
