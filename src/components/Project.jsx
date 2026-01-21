import { useRef, useState } from 'react'
import styles from './Project.module.css'
import FloaterContainer from './FloaterContainer'

const Project = (props) => {
  const rowRef = useRef(null)

  const handleClick = (e) => {
    console.log(e)
    if (!props.isFloaterOpen) {
      const rect = rowRef.current.getBoundingClientRect()
      props.onToggleFloater(props.projectId, rect, {
        name: props.name,
        blurb: props.blurb,
        isTall: props.isTall,
        id: props.id
      })
    }
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
    const [activeFloaters, setFloaters] = useState([])
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