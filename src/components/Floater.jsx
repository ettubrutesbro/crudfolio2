import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react'
import { motion } from 'motion/react'
import clsx from 'clsx'

import { useDuck } from '../App'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, name, blurb, img, rowRect, i, xOrigin, zIndex, wiggle, ...props }) => { //clean up later

  const [maskOn, setMask] = useState(true)
  const [floaterHeight, setFloaterHeight] = useState(0)

  const floaterRef = useRef()

  const isTall = img?.height > img?.width
  const floaterWidth = isTall? 200 : 300

  // Capture window values once on mount so resize doesn't affect positioning
  const initialWindowRef = useRef({
    scrollY: window.scrollY,
    innerHeight: window.innerHeight
  })
  const initialWindow = initialWindowRef.current
  const topThird = rowRect.top <= initialWindow.innerHeight / 3

  const setFloaters = useDuck((state) => state.setFloaters)
  const constraintsRef = useDuck((state) => state.dragConstraints)
  const bringToFront = useDuck((state) => state.bringToFront)

  const imageSrc = img?.name ? `assets/thumbnails/${img.name}.png` : null


  useLayoutEffect(() =>  {
    //floater height needed for starting mount animation in concealment
    const rect = floaterRef.current.getBoundingClientRect()
    setFloaterHeight(rect.height)
  }, [])

  // Mask positioning captured once on mount — derived from stable props and frozen window values
  const maskDataRef = useRef({
    x: -rowRect.left,
    // If row is in top third, mask starts at top and extends down; otherwise starts at bottom of row and goes up
    y: !topThird ? -((rowRect.top + initialWindow.scrollY) - (rowRect.height * i)) + 'px' : rowRect.height * i - 1,
    height: !topThird ? (rowRect.top) + initialWindow.scrollY + rowRect.height - 2 + 'px' : initialWindow.innerHeight - rowRect.top
  })
  const maskData = maskDataRef.current

  const floaterStart = useMemo(() => {
    //determines "start" position (the "tucked-away" origin before floater animates out, becoming visible)
    //x based on xOrigin (where the mouse clicked the row) but limited so start doesnt stick out from row itself
    //y is either at bottom of project row (scroll + distance from top + row height) or tangent above row if row
    //is in top-third Y of screen (so it animates down, not up)
    const clampedX = Math.max(
      floaterWidth / 2,
      Math.min(xOrigin, rowRect.width - floaterWidth / 2)
    )
    return {
      x: rowRect.left + clampedX - floaterWidth / 2,
      y: !topThird ? rowRect.top + initialWindow.scrollY + rowRect.height : -floaterHeight
    }
  }, [floaterHeight])


  // Watch for wiggle trigger (timestamp change) and run attention animation
  useEffect(() => {
    if (!wiggle) return

    // TODO: Implement wiggle/scroll-into-view animation here
    // e.g., check if floater is in viewport, scroll if needed, then shake
    console.log('wiggle triggered for', props.id)

  }, [wiggle])

  const handleDragStart = () => {
    bringToFront(props.id)
  }

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
      className={clsx(styles.mask)}
      style={{
        width: '100vw',
        left:  maskData.x,
        top: maskData.y,
        height: maskData.height,
        clipPath: maskOn? 'inset(0 0 0 0)' : 'none',
        zIndex: zIndex,
        // border: maskOn? '1px solid red' : 'none',
        // background: maskOn? 'rgba(255,0,0,0.1)' : ''
      }}
    >
      <motion.div
        drag
        whileDrag = {{
          scale: 1.05,
          boxShadow: '4px 4px 6px rgba(0,0,0,0.45)',
          cursor: 'grabbing'
        }}
        dragMomentum = {false}
        dragConstraints = {constraintsRef}
        onDragStart = {handleDragStart}

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
          },
          rotation: {
            duration: 0.8
          }
        }}
        onAnimationComplete = {() => {
          setMask(false)
        }}
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

