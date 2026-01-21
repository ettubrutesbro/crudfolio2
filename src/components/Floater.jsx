import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import clsx from 'clsx'
import styles from './Floater.module.css'

const Floater = ({ isOpen, onClose, title, content, isTall, imageId, rowRect, i }) => {
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
        background: 'rgba(255,0,0,0.1)'
      }}
    >
      <motion.div
        drag
        ref={floaterRef}
        className={clsx(styles.floater, isTall && styles.tall)}
        style = {{
          //these values are where it should start, so begin the
          left: rowRect? rowRect.left : '',
          top: rowRect? rowRect.top + window.scrollY + rowRect.height - 10 : ''
        }}
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

export const FloaterContainer = (props) => {
  return (
    <div className = {styles.floaterContainer}>
      {props.children}
    </div>
  )
}

export default Floater

