import React, { useState } from "react"
import "./Timeline.scss"

const Timeline = ({ activeData, activeDataHandler }) => {
  const onMouseClickHandler = index => activeDataHandler(index)

  return (
    <div className="timeline">
      <div className="timeline-line"></div>
      <div className="timeline-points">
        <div
          onClick={() => onMouseClickHandler(0)}
          className={activeData === 0 ? "point point-selected" : "point"}></div>
        <div
          onClick={() => onMouseClickHandler(1)}
          className={activeData === 1 ? "point point-selected" : "point"}></div>
        <div
          onClick={() => onMouseClickHandler(2)}
          className={activeData === 2 ? "point point-selected" : "point"}></div>
      </div>
    </div>
  )
}

export default Timeline
