import { useRef, useState } from 'react'
import { useDuck } from '../App'

import styles from './Project.module.css'
import FloaterContainer from './FloaterContainer'

const Project = (props) => {
  const rowRef = useRef(null)
  const setFloaters = useDuck((state) => state.setFloaters)

  const handleClick = (e) => {
    const rect = rowRef.current.getBoundingClientRect()
    //THIS may be the point at which the mask needs to be calculated, so that it stays in state and is specific to each floater
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

    //no likey: floater container and the ul are both iterating but use different models, where there's a map in floatercontainer, and then in the ul, its a map being passed in by the parent....

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