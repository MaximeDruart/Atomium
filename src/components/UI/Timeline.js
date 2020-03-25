import React, { useState } from "react"

const Timeline = () => {
  const [activePoint, setActivePoint] = useState(0)

  const onMouseClickHandler = index => {
    setActivePoint(index)
  }

  return (
    <div className="timeline">
      <div className="timeline_line"></div>
      <div className="timeline_points">
        <div onClick={() => onMouseClickHandler(0)} className={activePoint === 0 ? "point_selected" : "point"}></div>
        <div onClick={() => onMouseClickHandler(1)} className={activePoint === 1 ? "point_selected" : "point"}></div>
        <div onClick={() => onMouseClickHandler(2)} className={activePoint === 2 ? "point_selected" : "point"}></div>
      </div>
    </div>
  )
}

export default Timeline
