import React, { useContext, useState, useEffect, useRef } from "react"
import "./Scene2.scss"
import scene2data from "./Scene2data"
import Timeline from "./Timeline"
import { Context } from "../../Context"
import gsap from "gsap"

const Scene2 = () => {
  const $scene2 = useRef(null)
  const [activeAtom, setActiveAtom] = useState(0)
  const {
    updateContext,
    switchAtom,
    clearAtomsAnimated,
    toggleControls,
    toggleCube,
    $background,
    $canvas
  } = useContext(Context)
  const [activeDescription, setActiveDescription] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const changeAtom = val => {
    let newVal = gsap.utils.clamp(0, scene2data.length - 1, activeAtom + val)
    newVal !== activeAtom && setActiveAtom(newVal)
  }

  useEffect(() => {
    !isFirstRender && switchAtom(scene2data[activeAtom].structure)
    setActiveDescription(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAtom])

  useEffect(() => {
    toggleControls(true)
    toggleCube(true)
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
      <div className="description">{scene2data[activeAtom].descriptions[activeDescription]}</div>
      <div className="atom-name">{scene2data[activeAtom].name}</div>
      {activeAtom > 0 && (
        <div onClick={() => changeAtom(-1)} className="mf-active button previous-atom">
          Atome précédent
        </div>
      )}
      <div onClick={goToScene3} className="mf-active next buttonNext">
        Découvrir les molécules
      </div>
      {activeAtom < scene2data.length - 1 && (
        <div onClick={() => changeAtom(1)} className="mf-active button next-atom">
          Atome suivant
        </div>
      )}
    </div>
  )
}

export default Scene2
