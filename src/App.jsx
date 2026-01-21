import { useState } from 'react'
import './App.css'
import PROJECTS from './assets/projects.json'
import Project, {ProjectList} from './components/Project'

import {create} from 'zustand'

export const useDuck = create((set) => ({
    activeFloaters: [],
    setFloaters: (newFloater) => set((state) => {
      console.log('before:', state.activeFloaters)
      console.log('toggling:', newFloater.id)
      
      // Find if this floater already exists based on id (or another unique property)
      const existingIndex = state.activeFloaters.findIndex(f => f.id === newFloater.id)
      
      if (existingIndex !== -1) {
        // Remove it if it exists
        console.log('remove')
        const newArray = [...state.activeFloaters]
        newArray.splice(existingIndex, 1)
        return { activeFloaters: newArray }
      } else {
        // Add it if it doesn't exist
        console.log('add')
        return { activeFloaters: [...state.activeFloaters, newFloater] }
      }
    })
}))

function App() {


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
                projectId = {p.id}
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
