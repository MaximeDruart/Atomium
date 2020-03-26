import React from "react"
import "./Timeline.scss"

const Timeline = ({ activeData, activeDataHandler }) => {
  return (
    <div className="timeline">
      <div className="timeline-line"></div>
      <div className="timeline-points">
        <div
          onClick={() => activeDataHandler(0)}
          className={activeData === 0 ? "point mf-active point-selected" : "point mf-active"}></div>
        <div
          onClick={() => activeDataHandler(1)}
          className={activeData === 1 ? "point mf-active point-selected" : "point mf-active"}></div>
        <div
          onClick={() => activeDataHandler(2)}
          className={activeData === 2 ? "point mf-active point-selected" : "point mf-active"}></div>
      </div>
    </div>
  )
}

export default Timeline
