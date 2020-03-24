import React from "react"
import "./App.scss"
import THREECanvas from "./components/THREECanvas"
import UserInterface from "./components/UI/UserInterface"

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
