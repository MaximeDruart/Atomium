import React from "react"
import Header from "./Header"
import Timeline from "./Timeline"
import "./UI.scss"


const UserInterface = () => {
  return (
    <div className="ui">
      <Header />
      <div className="main_container">
        <Timeline />
      </div> 
    </div>
  )
}

export default UserInterface
