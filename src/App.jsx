import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import styles from './App.module.css'

import PROJECTS from './assets/projects.json'

const Project = (props) => {
  const [showFloater, setShowFloater] = useState(false)
  return (
    <>
      <div className = {showFloater? styles.floaterOn : styles.floaterOff}>
        bla bla bla
      </div>
      <div
        className = {styles.project}
        onClick = {()=>setShowFloater(!showFloater)}
      >
        <div>{props.name}</div>
        <div>{props.year}</div>
      </div>
    </>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <article>
        <h1> Jack Leng </h1>
        <p>I design and code software, animate, illustrate and make prints. </p>
        <p>Most recently, I worked at Autodesk on AutoCAD Web & Mobile. Before that, I built features and design systems 0→1 in orgs of all sizes across many fields: Proteus Digital Health, Children Now, TSM, Sendbloom (acq. by LinkedIn), and Origami Logic (acq. by Intuit).  </p>
        {PROJECTS.map((p)=>{

          return (
            <Project
              name = {p.name}
              year = {p.year}
            />
          )
        })}
      </article>
    </>
  )
}

export default App
