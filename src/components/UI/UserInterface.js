import React, { useState, useContext, useEffect } from "react"
import Header from "./Header"
import Timeline from "./Timeline"
import "./UI.scss"
import Intro from "./Intro"

const UserInterface = () => {
  const [activeScene, setactiveScene] = useState()
  return (
    <div className="ui">
      <Header />
      <div className="main_container">
        <Intro />
        {/* <Timeline /> */}
      </div>
    </div>
  )
}

export default UserInterface
