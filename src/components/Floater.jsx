import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import clsx from 'clsx'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, name, blurb, isTall, imageId, rowRect, i, xOrigin, ...props }) => { //clean up later

  const [maskOn, setMask] = useState(true)
  const [floaterHeight, setFloaterHeight] = useState(0)

  const containerRef = useRef()
  const floaterRef = useRef()

  const floaterWidth = isTall? 200 : 300
  useLayoutEffect(() =>  {
    const rect = floaterRef.current.getBoundingClientRect()
    console.log(`layout effect: floater height is ${rect.height}`)
    setFloaterHeight(rect.height)
  }, [])

  const imageSrc = imageId? `assets/thumbnails/${imageId}.png` : null

  const topThird = rowRect.top <= window.innerHeight/3

  const floaterStart = useMemo(() => {
    console.log('float recalc')
    if (!rowRect) return { x: '', y: '' }
    
    const clampedX = Math.max(
      floaterWidth / 2, 
      Math.min(xOrigin, rowRect.width - floaterWidth / 2)
    )
    console.log(-floaterHeight)
    return {
      x: rowRect.left + clampedX - floaterWidth / 2,
      y: !topThird? rowRect.top + window.scrollY + rowRect.height : -floaterHeight
    }
  }, [floaterHeight])

  const maskData = useMemo(() => {
    //if the row is in the top third of the window, mask should start at top and extend towards bottom
    //otherwise start at bottom of row and go to top of window
    return {
      x: -rowRect.left,
      y: !topThird? -((rowRect.top+window.scrollY)-(rowRect.height*i))  + 'px' : rowRect.height * i - 1,
      height: !topThird? (rowRect.top)+window.scrollY+rowRect.height-2 +'px' : window.innerHeight - rowRect.top
    }
  }, [])

  //calculate offsets (position after animation) based on scrollposition vs. row position
  //and on dimension of floater + a randomized offset which determines direction and distance 
  const xOffset = 100
  const yOffset = !topThird? floaterHeight + 25 : -floaterHeight - 25

  return (
    <div
      ref={containerRef}
      className={styles.mask}
      style={{
        width: '100vw',
        left:  maskData.x,
        top: maskData.y,
        height: maskData.height,
        // border: maskOn? '1px solid red' : 'none',
        clipPath: maskOn? 'inset(0 0 0 0)' : 'none',
        // background: maskOn? 'rgba(255,0,0,0.1)' : ''
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
          left: floaterStart.x,
          top: floaterStart.y
        }}
        initial = {{x: 0, y: 0}}
        // animate = {{y: floaterStart.x + xOffset, y: floaterStart.y + yOffset}}
        animate = {{
          x: xOffset,
          y: -yOffset
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

