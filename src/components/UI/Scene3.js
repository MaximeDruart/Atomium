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
  const [isFirstRender, setIsFirstRender] = useState(true)

  const changeMolecule = val => {
    let newVal = gsap.utils.clamp(0, 2, activeScene3Molecule + val)
    newVal !== activeScene3Molecule && updateContext("activeScene3Molecule", newVal)
  }

  useEffect(() => {
    !isFirstRender && switchMolecule(scene3data[activeScene3Molecule].structure)
    setActiveDescription(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene3Molecule])

  useEffect(() => {
    setIsFirstRender(false)
    gsap.from($scene3.current, 0.8, { opacity: 0 })
  }, [])

  return (
    <div ref={$scene3} className="scene-2 scene-3">
      <div className="title">Les 3 grandes molécules</div>
      <Timeline activeData={activeDescription} activeDataHandler={setActiveDescription} />
      <div className="description">{scene3data[activeScene3Molecule].descriptions[activeDescription]}</div>
      <div className="atom-name">{scene3data[activeScene3Molecule].name}</div>
      <div onClick={() => changeMolecule(-1)} className=" button previous-atom previous-Molecule">
        previous molecule
      </div>
      <div onClick={() => changeMolecule(1)} className=" button next-atom next-Molecule">
        Next molecule
      </div>
    </div>
  )
}

export default Scene3
