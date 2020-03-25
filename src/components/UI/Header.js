import React, { useContext, useCallback } from "react"
import logo from "../../assets/images/logo.png"
import { Context } from "../../Context"

const Header = () => {
  const { activeScene } = useContext(Context)
  const getLinks = useCallback(
    () =>
      new Array(4).fill(0).map((_, index) => (
        <span key={index} className={activeScene === index ? "header_link active" : "header_link"}>
          0{index + 1}
        </span>
      )),
    [activeScene]
  )
  return (
    <div className="header">
      <img src={logo} alt="logo" className="header_logo"></img>
      <div className="header_links">{getLinks()}</div>
    </div>
  )
}

export default Header
