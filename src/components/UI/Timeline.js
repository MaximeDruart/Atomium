import React, { useState } from "react"
import './Timeline.scss'

const Timeline = () => {
  const [activePoint, setActivePoint] = useState(0)

  const onMouseClickHandler = index => {
    setActivePoint(index)
  }

  return (
    <div className="timeline">
      <div className="timeline-line"></div>
      <div className="timeline-points">
        <div onClick={() => onMouseClickHandler(0)} className={activePoint === 0 ? "point-selected" : "point"}></div>
        <div onClick={() => onMouseClickHandler(1)} className={activePoint === 1 ? "point-selected" : "point"}></div>
        <div onClick={() => onMouseClickHandler(2)} className={activePoint === 2 ? "point-selected" : "point"}></div>
      </div>
    </div>
  )
}

export default Timeline
