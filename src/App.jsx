import { useState } from 'react'
import './App.css'
import PROJECTS from './assets/projects.json'
import Project, {ProjectList} from './components/Project'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <article>
        <h1> Jack Leng </h1>
        <p>I design and code software, animate, illustrate and make prints. </p>
        <p>Most recently, I worked at Autodesk on AutoCAD Web & Mobile. Before that, I built features and design systems 0→1 in orgs of all sizes across many fields: Proteus Digital Health, Children Now, TSM, Sendbloom (acq. by LinkedIn), and Origami Logic (acq. by Intuit).  </p>
        <address>
            <a href = "linkedin.com">LinkedIn profile ></a>
            <a href = "mailto:jack.leng(AT)gmail.com">E-mail me ></a>
        </address>
        <ProjectList>
          {PROJECTS.map((p,i)=>{
            return (
              <Project
                key = {`project-${i}`}
                i = {i}
                {...p}
              />
            )
          })}
        </ProjectList>
      </article>
    </>
  )
}

export default App
