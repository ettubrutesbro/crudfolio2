import { useRef, useState } from 'react'
import { useDuck } from '../App'

import styles from './Project.module.css'
import FloaterContainer from './FloaterContainer'

const Project = (props) => {
  const rowRef = useRef(null)
  const setFloaters = useDuck((state) => state.setFloaters)

  const handleClick = (e) => {
    const rect = rowRef.current.getBoundingClientRect()
    console.log(`clicked rect ${rect.top} at ${e.clientX - rect.left}`)
    setFloaters({
      ...props,
      rowRect: rect
    })

  }

  return (
    <li
      ref={rowRef}
      className={styles.project}
      onClick={!props.isFloaterOpen ? handleClick : undefined}
    >
      <div>{props.name}</div>
      <div>{props.year}</div>
    </li>
  )
}

export const ProjectList = (props) => {

    const activeFloaters = useDuck((state) => state.activeFloaters)

    return (
        <div className={styles.projectsWrapper}>
            <h4 className={styles.header}> Selected projects:</h4>
            <ul className={styles.projectList}>
                {props.children}
            </ul>
            <FloaterContainer
                activeFloaters={activeFloaters}
            />
        </div>
    )
}

export default Project