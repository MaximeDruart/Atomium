import React, { useContext } from "react"
import "./Scene2.scss"
import scene2data from "./Scene2data"

const Scene2 = () => {
  const { updateContext, activeScene, activeScene2Atom } = useContext()
  return <div className="scene-2"></div>
}

export default Scene2
