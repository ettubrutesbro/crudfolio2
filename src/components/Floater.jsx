import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import clsx from 'clsx'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, title, content, isTall, imageId, rowRect, i }) => {
  const containerRef = useRef()
  const floaterRef = useRef()

  const imageSrc = imageId? `assets/thumbnails/${imageId}.png` : null

  // Calculate these values once on mount and freeze them
  const frozenStyles = useMemo(() => {
    if (!rowRect) return {}

    const scrollY = window.scrollY
    console.log('Calculating frozen styles - rowRect.top:', rowRect.top, 'scrollY:', scrollY)

    return {
      mask: {
        left: -rowRect.left,
        width: '100vw',
        top: -((rowRect.top + scrollY) - (rowRect.height * i)) + 'px',
        height: (rowRect.top) + scrollY + rowRect.height - 2 + 'px',
        background: 'rgba(255,0,0,0.1)'
      },
      floater: {
        left: rowRect.left,
        top: rowRect.top + scrollY + rowRect.height - 10
      }
    }
  }, []) // Empty dependency array = only calculate once on mount

  return (
    <div
      ref={containerRef}
      className={styles.mask}
      style={frozenStyles.mask}
    >
      <motion.div
        drag
        ref={floaterRef}
        className={clsx(styles.floater, isTall && styles.tall)}
        style={frozenStyles.floater}
      >
        <header>
          <button
            className={styles.closeButton}
            // onClick={handleClose}
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
