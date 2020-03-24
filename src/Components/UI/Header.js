import React, { useState } from "react"
import logo from "../../assets/images/logo.png"

const Header = () => {
  // Hover header hook
  const [hovering1, setHovering1] = useState(false)
  const onMouseEnterHandler1 = event => setHovering1(true)
  const onMouseLeaveHandler1 = event => setHovering1(false)

  const [hovering2, setHovering2] = useState(false)
  const onMouseEnterHandler2 = event => setHovering2(true)
  const onMouseLeaveHandler2 = event => setHovering2(false)

  const [hovering3, setHovering3] = useState(false)
  const onMouseEnterHandler3 = event => setHovering3(true)
  const onMouseLeaveHandler3 = event => setHovering3(false)

  const [hovering4, setHovering4] = useState(false)
  const onMouseEnterHandler4 = event => setHovering4(true)
  const onMouseLeaveHandler4 = event => setHovering4(false)

  // condition ? si vrai : si faux
  return (
    <div className="header">
      <img src={logo} alt="logo" className="header_logo"></img>
      <div className="header_links">
        <span
          onMouseEnter={onMouseEnterHandler1}
          onMouseLeave={onMouseLeaveHandler1}
          className={hovering1 ? "header_link header_link_hovered" : "header_link"}>
          01
        </span>
        <span
          onMouseEnter={onMouseEnterHandler2}
          onMouseLeave={onMouseLeaveHandler2}
          className={hovering2 ? "header_link header_link_hovered" : "header_link"}>
          02
        </span>
        <span
          onMouseEnter={onMouseEnterHandler3}
          onMouseLeave={onMouseLeaveHandler3}
          className={hovering3 ? "header_link header_link_hovered" : "header_link"}>
          03
        </span>
        <span
          onMouseEnter={onMouseEnterHandler4}
          onMouseLeave={onMouseLeaveHandler4}
          className={hovering4 ? "header_link header_link_hovered" : "header_link"}>
          04
        </span>
      </div>
    </div>
  )
}

export default Header
