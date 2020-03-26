import React, { useContext, useState, useEffect, useRef } from "react"
import "./Scene2.scss"
// import "./Scene3.scss"
import scene3data from "./Scene3data"
import Timeline from "./Timeline"
import { Context } from "../../Context"
import gsap from "gsap"

const Scene3 = () => {
  const $scene3 = useRef(null)
  const [activeMolecule, setActiveMolecule] = useState(0)
  const { toggleControls, switchMolecule, toggleCube, adjustCamForMoleculeTl } = useContext(Context)
  const [activeDescription, setActiveDescription] = useState(0)

  const changeMolecule = val => {
    let newVal = gsap.utils.clamp(0, scene3data.length - 1, activeMolecule + val)
    newVal !== activeMolecule && setActiveMolecule(newVal)
  }

  useEffect(() => {
    switchMolecule(scene3data[activeMolecule].molecule)
    setActiveDescription(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMolecule])

  useEffect(() => {
    adjustCamForMoleculeTl(true)
    toggleCube(true)
    toggleControls(true)
    gsap.from($scene3.current, 0.8, { opacity: 0 })
    return () => adjustCamForMoleculeTl(false)
  }, [])

  return (
    <div ref={$scene3} className="scene-2 scene-3">
      <div className="title">
        <span className="number">03.</span> Les molécules
      </div>
      <Timeline activeData={activeDescription} activeDataHandler={setActiveDescription} />
      <div className="description">{scene3data[activeMolecule].descriptions[activeDescription]}</div>
      <div className="atom-name">{scene3data[activeMolecule].name}</div>
      {activeMolecule > 0 && (
        <div onClick={() => changeMolecule(-1)} className="mf-active button previous-atom previous-Molecule">
          Molécule précédente
        </div>
      )}
      {activeMolecule < scene3data.length - 1 && (
        <div onClick={() => changeMolecule(1)} className="mf-active button next-atom next-Molecule">
          Molécule suivante
        </div>
      )}
    </div>
  )
}

export default Scene3
