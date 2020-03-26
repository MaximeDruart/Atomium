import React, { useContext, useState, useEffect, useRef } from "react"
import "./Scene2.scss"
// import "./Scene3.scss"
import scene3data from "./Scene3data"
import Timeline from "./Timeline"
import { Context } from "../../Context"
import gsap from "gsap"

const Scene3 = () => {
  const $scene3 = useRef(null)
  const { updateContext, activeScene3Molecule, switchMolecule } = useContext(Context)
  const [activeDescription, setActiveDescription] = useState(0)

  const changeMolecule = val => {
    let newVal = gsap.utils.clamp(0, scene3data.length - 1, activeScene3Molecule + val)
    newVal !== activeScene3Molecule && updateContext("activeScene3Molecule", newVal)
  }

  useEffect(() => {
    switchMolecule(scene3data[activeScene3Molecule].molecule)
    setActiveDescription(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene3Molecule])

  useEffect(() => {
    gsap.from($scene3.current, 0.8, { opacity: 0 })
  }, [])

  return (
    <div ref={$scene3} className="scene-2 scene-3">
      <div className="title">
        <span className="number">03.</span> Les 3 grandes molécules
      </div>
      <Timeline activeData={activeDescription} activeDataHandler={setActiveDescription} />
      <div className="description">{scene3data[activeScene3Molecule].descriptions[activeDescription]}</div>
      <div className="atom-name">{scene3data[activeScene3Molecule].name}</div>
      <div onClick={() => changeMolecule(-1)} className="mf-active button previous-atom previous-Molecule">
        previous molecule
      </div>
      <div onClick={() => changeMolecule(1)} className="mf-active button next-atom next-Molecule">
        Next molecule
      </div>
    </div>
  )
}

export default Scene3
