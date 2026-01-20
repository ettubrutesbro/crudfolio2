import { useState, useRef } from 'react'
import styles from './Project.module.css'
import Floater from './Floater'

const Project = (props) => {
  const [showFloater, setShowFloater] = useState(false)
  const [rowRect, setRowRect] = useState(null)
  const rowRef = useRef(null)

  const handleClick = () => {
    if (!showFloater) {
      const rect = rowRef.current.getBoundingClientRect()
      setRowRect(rect)
    }
    setShowFloater(!showFloater)
  }

  const handleClose = () => {
    console.log('closing floater')
    setShowFloater(false)
    setRowRect(null)
  }

  return (
    <li
      ref={rowRef}
      className={styles.project}
      onClick={!showFloater? handleClick : ''}
      // style={{zIndex: props.i}}
    >
      <div>{props.name}</div>
      <div>{props.year}</div>
      {showFloater && 
        
          <Floater
            isOpen={showFloater}
            onClose={handleClose}
            title={props.name}
            content={props.blurb}
          />
      }
    </li>
  )
}

export const ProjectList = (props) => {
    return (
        <ul className = {styles.projectList}>
            <h4 className = {styles.header}> Selected projects:</h4>
            {props.children}
        </ul>
    )
}

export default Project