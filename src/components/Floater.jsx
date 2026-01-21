import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import clsx from 'clsx'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, title, content, isTall, imageId }) => {
  const imageSrc = imageId ? `/assets/thumbnails/${imageId}.png` : null
  const [position, setPosition] = useState(null)
  const [startOffset, setStartOffset] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const floaterRef = useRef(null)

  // Motion value for animation
  const animationProgress = useMotionValue(0)

  // Memoize random curve parameters so they don't change during animation
  const curveParams = useMemo(() => ({
    curveIntensity: 50 + Math.random() * 100,
    curveDirection: Math.random() > 0.5 ? 1 : -1,
    startRotation: -15 + Math.random() * 30,
    endRotation: -5 + Math.random() * 10
  }), [animKey])

  useEffect(() => {
    if (isOpen) {
      // Calculate final position (relative to parent container)
      const finalPosition = calculatePosition()

      // Calculate start position and the offset from final
      const startPos = calculateStartPosition()
      const offset = {
        x: startPos.x - finalPosition.x,
        y: startPos.y - finalPosition.y
      }

      setPosition(finalPosition)
      setStartOffset(offset)
      setIsAnimating(true)
      setAnimKey(prev => prev + 1)

      // Animate from offset to 0,0
      animationProgress.set(0)
      animate(animationProgress, 1, {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }).then(() => {
        setIsAnimating(false)
      })
    } else if (!isOpen) {
      setPosition(null)
      setStartOffset(null)
      animationProgress.set(0)
    }
  }, [isOpen])

  const calculatePosition = () => {
    const floaterWidth = 300
    const floaterHeight = 200

    // X: random position relative to parent, with variance
    const xVariance = (Math.random() * 0.8 - 0.7) * floaterWidth
    const x = 400 + xVariance // Base position from left of parent

    // Y: position above the row (negative because parent is at 100% / bottom)
    const yVariance = -Math.random() * 0.5 * floaterHeight
    const y = -floaterHeight - yVariance

    return { x, y }
  }

  const calculateStartPosition = () => {
    const floaterWidth = 300
    return {
      x: (floaterWidth + Math.random() * 50),
      y: 180
    }
  }

  // Transform animates from startOffset to 0
  const translateX = useTransform(animationProgress, (progress) => {
    if (!startOffset || !position) return 0

    const t = progress
    // Create curved path for X
    const controlX = startOffset.x / 2 + curveParams.curveDirection * curveParams.curveIntensity

    const x0 = startOffset.x
    const x1 = controlX
    const x2 = 0

    return (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2
  })

  const translateY = useTransform(animationProgress, (progress) => {
    if (!startOffset || !position) return 0

    const t = progress
    const y0 = startOffset.y
    const y1 = startOffset.y / 2 - 30 // Curve control point
    const y2 = 0

    return (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2
  })

  const rotate = useTransform(
    animationProgress,
    [0, 1],
    [curveParams.startRotation, curveParams.endRotation]
  )


  const handleClose = () => {
    setPosition(null)
    setStartOffset(null)
    animationProgress.set(0)
    onClose()
  }

  if (!isOpen || !position) return null

  console.log('Floater isTall:', isTall, 'classes:', clsx(styles.floater, isTall && styles.tall))

  return (
    <div className={isAnimating? styles.containerAnim : styles.container }>
      <motion.div
        drag
        key={animKey}
        ref={floaterRef}
        className={clsx(styles.floater, isTall && styles.tall)}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          x: isAnimating ? translateX : 0,
          y: isAnimating ? translateY : 0,
          // rotate: isAnimating ? rotate : 0,
          cursor: isDragging ? 'grabbing' : 'grab',
          pointerEvents: 'auto',
          willChange: isAnimating ? 'transform' : 'auto'
        }}
        // onMouseDown={handleMouseDown}
        initial={{ rotate: -15 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        <header>
          <button
            className={styles.closeButton}
            onClick={handleClose}
          >
            ×
          </button>
          <h3>{title}</h3>
        </header>
        {imageSrc && (
          <figure className={styles.pic}>
            <img src={imageSrc} />
          </figure>
        )}
        <p>{content}</p>
      </motion.div>
    </div>
  )
}

export default Floater
