import React, { useContext, useState } from "react"
import "./Scene2.scss"
import scene2data from "./Scene2data"
import Timeline from "./Timeline"

const Scene2 = () => {
  const { updateContext, activeScene, activeScene2Atom } = useContext()
  const [activeDescription, setActiveDescription] = useState(0)
  return (
    <div className="scene-2">
      <div className="title">Les 3 grandes molécules</div>
      <Timeline />
      <div className="molecule-name">{scene2data[activeScene2Atom].name}</div>
      <div className="description">{scene2data[activeScene2Atom].description[activeDescription]}</div>
    </div>
  )
}

export default Scene2
