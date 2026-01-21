import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import clsx from 'clsx'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, name, blurb, isTall, imageId, rowRect, i, xOrigin }) => {
  const containerRef = useRef()
  const floaterRef = useRef()

  const imageSrc = imageId? `assets/thumbnails/${imageId}.png` : null


  return (
    <div
      ref={containerRef}
      className={styles.mask}
      style={{
        width: '100vw',
        left: rowRect? -rowRect.left : '',
        top: rowRect? -((rowRect.top+window.scrollY)-(rowRect.height*i))  + 'px' : '',
        height: rowRect? (rowRect.top)+window.scrollY+rowRect.height-2 +'px' : '',
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
          left: rowRect? rowRect.left + xOrigin : '',
          
          top: rowRect? rowRect.top + window.scrollY + rowRect.height - 100 : ''
        }}
        initial = {{y: 100}}
        animate = {{y: 0}}
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

