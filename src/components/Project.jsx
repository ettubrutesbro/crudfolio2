import { useRef, useState } from 'react'
import { useDuck } from '../App'

import styles from './Project.module.css'
import Floater, { FloaterContainer } from './Floater'

const Project = (props) => {
  const rowRef = useRef(null)
  const setFloaters = useDuck((state) => state.setFloaters)

  const handleClick = (e) => {
    const rect = rowRef.current.getBoundingClientRect()
    //THIS may be the point at which the mask needs to be calculated, so that it stays in state and is specific to each floater
    console.log(`clicked rect ${rect.top} at ${e.clientX - rect.left}`)
    setFloaters({
      ...props,
      rowRect: rect,
      xOrigin: e.clientX - rect.left
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
            <FloaterContainer>
              {activeFloaters.map((e,i)=> {
                return <Floater
                  key = {e.projectID}
                  i = {e.i}
                  name = {e.name}
                  blurb = {e.blurb}
                  isTall = {e.isTall}
                  imageId = {e.id}
                  rowRect = {e.rowRect}
                  xOrigin = {e.xOrigin}
                />
              })}
            </FloaterContainer>
        </div>
    )
}

export default Project