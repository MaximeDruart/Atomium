import React, { useState } from "react"

const Timeline = () => {
    return(
        <div className="timeline">
            <div className="timeline_line"></div>
            <div className="timeline_points">
                <div className="point_selected"></div>
                <div className="point"></div>
                <div className="point"></div>
            </div> 
        </div>
    )
}

export default Timeline