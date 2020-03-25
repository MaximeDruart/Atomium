import React, { useState, useContext, useEffect } from "react"
import Header from "./Header"
import Timeline from "./Timeline"
import "./UI.scss"
import Intro from "./Intro"
import TextAtoms from "./scene2/TextsAtoms.js"

const UserInterface = () => {
  const [activeScene, setActiveScene] = useState()
  return (
    <div className="ui">
      <Header />
      <div className="main_container">
        <Intro />
        <Timeline />
        <TextAtoms />
      </div>
    </div>
  )
}

export default UserInterface
