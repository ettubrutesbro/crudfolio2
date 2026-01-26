import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import clsx from 'clsx'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, name, blurb, isTall, imageId, rowRect, i, xOrigin, ...props }) => { //clean up later

  const [maskOn, setMask] = useState(true)

  const containerRef = useRef()
  const floaterRef = useRef()

  const floaterWidth = isTall? 200 : 300
  const floaterHeight = 200

  const imageSrc = imageId? `assets/thumbnails/${imageId}.png` : null

    // const calculatePosition = () => {
    //   // X: random position relative to parent, with variance
    //   const xVariance = (Math.random() * 0.8 - 0.7) * floaterWidth
    //   const x = 400 + xVariance // Base position from left of parent

    //   // Y: position above the row (negative because parent is at 100% / bottom)
    //   const yVariance = -Math.random() * 0.5 * floaterHeight
    //   const y = -floaterHeight - yVariance

    //   return { x, y }
    // }

  // const floaterStart = {
  //   x: rowRect? rowRect.left + (Math.max(floaterWidth/2, Math.min(xOrigin,rowRect.width-floaterWidth/2)) - floaterWidth/2) : '',
  //   y: rowRect? rowRect.top + window.scrollY + rowRect.height : ''
  // }

  const floaterStart = useMemo(() => {
    console.log('float recalc')
    if (!rowRect) return { x: '', y: '' }
    
    const clampedX = Math.max(
      floaterWidth / 2, 
      Math.min(xOrigin, rowRect.width - floaterWidth / 2)
    )
    
    return {
      x: rowRect.left + clampedX - floaterWidth / 2,
      y: rowRect.top + window.scrollY + rowRect.height
    }
  }, [])

  const maskData = useMemo(() => {
    console.log('mask recalc')
    return {
      x: rowRect? -rowRect.left : '',
      y: rowRect? -((rowRect.top+window.scrollY)-(rowRect.height*i))  + 'px' : '',
      height: rowRect? (rowRect.top)+window.scrollY+rowRect.height-2 +'px' : ''
    }
  }, [])

  //calculate offsets (position after animation) based on scrollposition vs. row position
  //and on 
  const xOffset = 100
  const yOffset = 100

  return (
    <div
      ref={containerRef}
      className={styles.mask}
      style={{
        width: '100vw',
        left:  maskData.x,
        top: maskData.y,
        height: maskData.height,
        border: maskOn? '1px solid red' : 'none',
        clipPath: maskOn? 'inset(0 0 0 0)' : 'none'
        // background: 'rgba(255,0,0,0.1)'
      }}
    >
      <motion.div
        drag
        ref={floaterRef}
        className={clsx(styles.floater, isTall && styles.tall)}
        style = {{
          //these values are where it should start, so begin the
          //TODO: subtract half of floater width and constrain X
          // left: rowRect? rowRect.left + (Math.max(floaterWidth/2, Math.min(xOrigin,rowRect.width-floaterWidth/2)) - floaterWidth/2) : '',
          // top: rowRect? rowRect.top + window.scrollY + rowRect.height - 100 : '',
          background: props.colors.bg || '',
          color: props.colors.text || '',
        }}
        initial = {{x: floaterStart.x, y: floaterStart.y}}
        // animate = {{y: floaterStart.x + xOffset, y: floaterStart.y + yOffset}}
        animate = {{
          x: floaterStart.x + 100,
          y: floaterStart.y - 200
        }}
          transition={{
  x: {
    duration: 0.6,
    ease: [0.43, 0.13, 0.23, 0.96]  // Custom bezier
  },
  y: {
    duration: 0.4,
    ease: [0.22, 0.61, 0.36, 1]
  }
}}
        onAnimationComplete = {()=>{setMask(false)}}
        // TODO: callback when animation completes..? prev. done with state and animate method
        // transition
      >
        <header>
          <button
            className={styles.closeButton}
            // onClick={handleClose}
          >
            ×
          </button>
          <h3>{name}</h3>
        </header>
        {imageSrc && (
          <figure className={styles.pic}>
            <img src={imageSrc} />
          </figure>
        )}
        <p>{blurb}</p>
      </motion.div>
    </div>
  )
}

export const FloaterContainer = (props) => {
  return (
    <div className = {styles.floaterContainer}>
      {props.children}
    </div>
  )
}

export default Floater

