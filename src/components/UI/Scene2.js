import React, { useContext, useState, useEffect, useRef } from "react"
import "./Scene2.scss"
import scene2data from "./Scene2data"
import Timeline from "./Timeline"
import { Context } from "../../Context"
import gsap from "gsap"

const Scene2 = () => {
  const $scene2 = useRef(null)
  const { updateContext, activeScene2Atom, switchAtom, clearAtomsAnimated, $background, $canvas } = useContext(Context)
  const [activeDescription, setActiveDescription] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const changeAtom = val => {
    let newVal = gsap.utils.clamp(0, scene2data.length - 1, activeScene2Atom + val)
    newVal !== activeScene2Atom && updateContext("activeScene2Atom", newVal)
  }

  useEffect(() => {
    !isFirstRender && switchAtom(scene2data[activeScene2Atom].structure)
    setActiveDescription(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene2Atom])

  useEffect(() => {
    setIsFirstRender(false)
    gsap.from($scene2.current, 0.8, { opacity: 0 })
    gsap.to($background.current, 0.8, { opacity: 0.4 })
    gsap.set($canvas.current, { zIndex: 10 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToScene3 = () => {
    gsap.to($scene2.current, 0.8, {
      opacity: 0,
      onStart: () => clearAtomsAnimated(),
      onComplete: () => {
        updateContext("activeScene", 2)
      }
    })
  }

  return (
    <div ref={$scene2} className="scene-2">
      <div className="title">
        <span className="number">02.</span>Les principaux atomes
      </div>
      <Timeline activeData={activeDescription} activeDataHandler={setActiveDescription} />
      <div className="description">{scene2data[activeScene2Atom].descriptions[activeDescription]}</div>
      <div className="atom-name">{scene2data[activeScene2Atom].name}</div>
      <div onClick={() => changeAtom(-1)} className="mf-active button previous-atom">
        Atome précédent
      </div>
      <div onClick={goToScene3} className="mf-active next">
        Découvrir les molécules
      </div>
      <div onClick={() => changeAtom(1)} className="mf-active button next-atom">
        Atome suivant
      </div>
    </div>
  )
}

export default Scene2
