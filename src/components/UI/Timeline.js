import React, { useState } from "react"

const Timeline = () => {
    const [click1, setClick1] = useState(false)
    const onMouseClickHandler1 = event => setClick1(true)

    const [click2, setClick2] = useState(false)
    const onMouseClickHandler2 = event => setClick2(true)

    const [click3, setClick3] = useState(false)
    const onMouseClickHandler3 = event => setClick3(true)

    // if (click1)
    // {
    //     const onMouseClickHandler2 = event => setClick2(false)
    //     const onMouseClickHandler3 = event => setClick3(false)

    // }else if (click2)
    // {
    //     const onMouseClickHandler1 = event => setClick1(false)
    //     const onMouseClickHandler3 = event => setClick3(false)
    // }else if (click3)
    // {
    //     const onMouseClickHandler1 = event => setClick1(false)
    //     const onMouseClickHandler2 = event => setClick2(false)
    // }

    const PointClicked = () =>
    {

    }

    return(
        <div className="timeline">
            <div className="timeline_line"></div>
            <div className="timeline_points">
                <div onClick={onMouseClickHandler1} className={click1 ? "point_selected" : "point"}></div>
                <div onClick={onMouseClickHandler2} className={click2 ? "point_selected" : "point"}></div>
                <div onClick={onMouseClickHandler3} className={click3 ? "point_selected" : "point"}></div>
            </div> 
        </div>
    )
}

export default Timeline