import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import clsx from 'clsx'

import { useDuck } from '../App'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, name, blurb, img, rowRect, i, xOrigin, ...props }) => { //clean up later

  const [maskOn, setMask] = useState(true)
  const [floaterHeight, setFloaterHeight] = useState(0)

  const containerRef = useRef()
  const floaterRef = useRef()
  const isTall = img?.height > img?.width
  const floaterWidth = isTall? 200 : 300
  const setFloaters = useDuck((state) => state.setFloaters)
  const topThird = rowRect.top <= window.innerHeight/3

  const imageSrc = img?.name ? `assets/thumbnails/${img.name}.png` : null


  useLayoutEffect(() =>  {
    const rect = floaterRef.current.getBoundingClientRect()
    console.log(`layout effect: floater height is ${rect.height}`)
    setFloaterHeight(rect.height)
  }, [])



  const floaterStart = useMemo(() => {
    console.log('float recalc')
    if (!rowRect) return { x: '', y: '' }
    const clampedX = Math.max(
      floaterWidth / 2, 
      Math.min(xOrigin, rowRect.width - floaterWidth / 2)
    )
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

  const handleClose = () => {
    setFloaters({id: props.id})
  }

  //calculate offsets (position after animation) based on scrollposition vs. row position
  //and on dimension of floater + a randomized offset which determines direction and distance 
  const xOffset = 100
  const yOffset = !topThird? floaterHeight + 25 : -floaterHeight - 25
  const rotation = !topThird && isTall? -90 : !topThird? -25 : isTall? 90 : 45


  return (
    <div
      ref={containerRef}
      className={styles.mask}
      style={{
        width: '100vw',
        left:  maskData.x,
        top: maskData.y,
        height: maskData.height,
        clipPath: maskOn? 'inset(0 0 0 0)' : 'none',
        // border: maskOn? '1px solid red' : 'none',
        // background: maskOn? 'rgba(255,0,0,0.1)' : ''
      }}
    >
      <motion.div
        drag
        ref={floaterRef}
        className={clsx(styles.floater, isTall && styles.tall)}
        style = {{
          background: props.colors.bg || '',
          color: props.colors.text || '',
          left: floaterStart.x,
          top: floaterStart.y
        }}
        initial = {{x: 0, y: 0, rotate: !topThird? -10 : 45}}
        animate = {{
          x: xOffset,
          y: -yOffset,
          rotate: 0
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
      >
        <header>
          <button
            className={styles.closeButton}
            onClick={handleClose}
          >
            ×
          </button>
          <h3>{name}</h3>
        </header>
        {imageSrc && (
          <figure className={styles.pic}>
            <img
              src={imageSrc}
              width={img?.width}
              height={img?.height}
            />
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

