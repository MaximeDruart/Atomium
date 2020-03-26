import React, { useContext, useEffect, useRef } from "react"
import "./App.scss"
import THREECanvas from "./components/THREECanvas"
import UserInterface from "./components/UI/UserInterface"
import { Context } from "./Context"
import bgPoints from "./assets/images/points.png"
import MouseFollower from "./components/MouseFollower"

const AppWrap = () => {
  const { updateContext } = useContext(Context)
  const $background = useRef(null)

  useEffect(() => updateContext("$background", $background), [])
  return (
    <div className="container">
      <MouseFollower />
      <div className="background"></div>
      <div ref={$background} className="background background-points">
        <img src={bgPoints} alt=""></img>
      </div>
      <UserInterface />
      <THREECanvas />
    </div>
  )
}

export default AppWrap
