import React from "react"
import logo from './../../Images/logo.png'

const Header = () => 
{
  return(
      <div className="header">
        <img src={logo} alt="logo" className="header_logo"></img>
        <div className="header_links">
          <a className="header_link_1" href="">01</a>
          <a className="header_link_2" href="">02</a>
          <a className="header_link_3" href="">03</a>
          <a className="header_link_4" href="">04</a>
        </div>
      </div>
      
  )
}

export default Header
