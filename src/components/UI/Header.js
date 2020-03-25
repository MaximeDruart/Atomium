import React from "react"
import logo from "../../assets/images/logo.png"

const Header = () => {
  // Hover header hook

  // condition ? si vrai : si faux
  return (
    <div className="header">
      <img src={logo} alt="logo" className="header_logo"></img>
      <div className="header_links">
        <span className="header_link">01</span>
        <span className="header_link">02</span>
        <span className="header_link">03</span>
        <span className="header_link">04</span>
      </div>
    </div>
  )
}

export default Header
