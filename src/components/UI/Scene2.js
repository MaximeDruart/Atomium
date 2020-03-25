import React, { useContext, useState, useEffect, useRef } from "react"
import "./Scene2.scss"
import scene2data from "./Scene2data"
import Timeline from "./Timeline"
import { Context } from "../../Context"
import gsap from "gsap"

const Scene2 = () => {
  const $scene2 = useRef(null)
  const { updateContext, activeScene2Atom, switchAtom } = useContext(Context)
  const [activeDescription, setActiveDescription] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const changeAtom = val => {
    let newVal = gsap.utils.clamp(0, 2, activeScene2Atom + val)
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
  }, [])

  return (
    <div ref={$scene2} className="scene-2">
      <div className="title">Les 3 grandes molécules</div>
      <Timeline activeData={activeDescription} activeDataHandler={setActiveDescription} />
      <div className="description">{scene2data[activeScene2Atom].descriptions[activeDescription]}</div>
      <div className="atom-name">{scene2data[activeScene2Atom].name}</div>
      <div onClick={() => changeAtom(-1)} className="previous-atom">
        Previous molecule
      </div>
      <div onClick={() => changeAtom(1)} className="next-atom">
        Next molecule
      </div>
    </div>
  )
}

export default Scene2
