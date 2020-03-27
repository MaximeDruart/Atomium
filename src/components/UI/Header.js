import React, { useContext, useCallback } from "react"
import logo from "../../assets/images/logo.png"
import { Context } from "../../Context"

const Header = () => {
  const { activeScene, updateContext, clearSceneOfGroups, toggleControls } = useContext(Context)
  const getLinks = useCallback(
    () =>
      new Array(4).fill(0).map((_, index) => (
        <span
          onClick={() => {
            if (activeScene !== index) {
              clearSceneOfGroups()
              toggleControls(false)
              updateContext("activeScene", index)
            }
          }}
          key={index}
          className={activeScene === index ? "mf-active header-link active" : "mf-active header-link"}>
          0{index + 1}
        </span>
      )),
    [activeScene, updateContext, clearSceneOfGroups, toggleControls]
  )
  return (
    <div className="header">
      <img
        onClick={() => {
          window.location.reload()
        }}
        src={logo}
        alt="logo"
        className="mf-active header-logo"></img>
      <div className="header-links">{getLinks()}</div>
    </div>
  )
}

export default Header
