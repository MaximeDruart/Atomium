import React, { useState } from "react"
import logo from "./../../Images/logo.png"

const Header = () => {
  const [hovering, setHovering] = useState(false)
  const onMouseEnterHandler = event => setHovering(true)
  const onMouseLeaveHandler = event => setHovering(false)

  // condition ? si vrai : si faux
  return (
    <div className="header">
      <img src={logo} alt="logo" className="header_logo"></img>
      <div className="header_links">
        <a
          onMouseEnter={onMouseEnterHandler}
          onMouseLeave={onMouseLeaveHandler}
          className={hovering ? "header_link_1 header_link_hovered" : "header_link"}
          href="#">
          01
        </a>
        <a className="header_link_2" href="">
          02
        </a>
        <a className="header_link_3" href="">
          03
        </a>
        <a className="header_link_4" href="">
          04
        </a>
      </div>
    </div>
  )
}

export default Header
