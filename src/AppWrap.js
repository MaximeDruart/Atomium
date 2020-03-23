import React from "react"
import "./App.scss"
import THREECanvas from "./Components/THREECanvas"
import UserInterface from "./Components/UI/UserInterface"

const AppWrap = () => {
  return (
    <div className="container">
      <div className="background"></div>
      <UserInterface />
      <THREECanvas />
      <div className="content"></div>
    </div>
  )
}

export default AppWrap
