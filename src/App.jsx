import { useState, useRef, useLayoutEffect } from 'react'
import './App.css'
import './App.module.css'
import PROJECTS from './assets/projects.json'
import Project, {ProjectList} from './components/Project'

import {create} from 'zustand'

export const useDuck = create((set) => ({
    activeFloaters: [],
    setFloaters: (newFloater) => set((state) => {

      // Find if this floater already exists based on id (or another unique property)
      const existingIndex = state.activeFloaters.findIndex(f => f.id === newFloater.id)
      if (existingIndex !== -1) { // remove
        const newArray = [...state.activeFloaters]
        newArray.splice(existingIndex, 1)
        return { activeFloaters: newArray }
      } else { //add, assigning current zIndexCounter as its zIndex
        return {
          activeFloaters: [...state.activeFloaters, { ...newFloater, zIndex: state.zIndexCounter }],
          zIndexCounter: state.zIndexCounter + 1
        }
      }
    }),
    // Brings a floater to front by updating its zIndex in activeFloaters
    // Optional shouldWiggle flag triggers attention animation (stores timestamp for re-triggering)
    bringToFront: (id, { shouldWiggle = false } = {}) => set((state) => {
      const newZIndex = state.zIndexCounter + 1
      return {
        activeFloaters: state.activeFloaters.map(f =>
          f.id === id
            ? { ...f, zIndex: newZIndex, ...(shouldWiggle && { wiggle: Date.now() }) }
            : f
        ),
        zIndexCounter: newZIndex
      }
    }),
    zIndexCounter: 1000,
    zIndexUp: () => set((state) => ({ zIndexCounter: state.zIndexCounter + 1 })),
    dragConstraints: null,
    setDragConstraints: (ref) => set((state) => ({dragConstraints: ref}))
}))

function App() {

  const bodyRef = useRef(null)
  const setBodyAsDragConstraints = useDuck((state) => state.setDragConstraints)

  useLayoutEffect(()=>{
    console.log('setting main as drag constraint')
    setBodyAsDragConstraints(bodyRef)
  }, [])

  return (
    <main ref = {bodyRef}>
      <article>
        <h1> Jack Leng </h1>
        <p>I design and code software, animate, illustrate and make prints. </p>
        <p>Most recently, I worked at Autodesk on AutoCAD Web & Mobile. Before that, I built features and design systems 0→1 in orgs of all sizes across many fields: Proteus Digital Health, Children Now, TSM, Sendbloom (acq. by LinkedIn), and Origami Logic (acq. by Intuit).  </p>
        <address>
            <a href = "linkedin.com">LinkedIn profile</a>
            <a href = "mailto:jack.leng(AT)gmail.com">E-mail me</a>
        </address>
        <ProjectList>
          {PROJECTS.map((p,i)=>{
            return (
              <Project
                key = {`project-${i}`}
                id = {p.id}
                i = {i}
                {...p}
              />
            )
          })}
        </ProjectList>
      </article>
    </main>
  )
}

export default App
