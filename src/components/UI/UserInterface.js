import React from "react"
import Header from "./Header"
import Timeline from "./Timeline"
import "./UI.scss"
import Intro from "./Intro"

const UserInterface = () => {
  return (
    <div className="ui">
      <Header />
      <div className="main_container">
        {/* <Intro /> */}
        {/* <Timeline /> */}
      </div>
    </div>
  )
}

export default UserInterface
