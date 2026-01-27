import { useRef, useState } from 'react'
import { useDuck } from '../App'

import styles from './Project.module.css'
import Floater, { FloaterContainer } from './Floater'

const Project = (props) => {
  const rowRef = useRef(null)
  const setFloaters = useDuck((state) => state.setFloaters)
  const getFloaters = useDuck((state) => state.activeFloaters)
  const bringToFront = useDuck((state) => state.bringToFront)

  
  const handleClick = (e) => {
    const rect = rowRef.current.getBoundingClientRect()
    //THIS may be the point at which the mask needs to be calculated, so that it stays in state and is specific to each floater
    console.log(`clicked rect ${rect.top} at ${e.clientX - rect.left}`)

    const alreadyActive = getFloaters.findIndex(f => f.id === props.id) !== -1
    if(!alreadyActive){ //show floater
       setFloaters({
        ...props,
        rowRect: rect,
        xOrigin: e.clientX - rect.left
      })
    }
    else{ //wiggle floater
      bringToFront(props.id, { shouldWiggle: true })
    }
   

  }

  return (
    <li
      ref={rowRef}
      className={styles.project}
      onClick={handleClick}
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
                  key = {e.id}
                  // i = {e.i}
                  {...e}
                />
              })}
            </FloaterContainer>
        </div>
    )
}

export default Project