import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import gsap from "gsap"
import useEventListener from "@use-it/event-listener"

const useMouseMove = () => {
  const [coords, setCoords] = useState([0, 0])
  const [target, setTarget] = useState(null)
  useEventListener("mousemove", ({ clientX, clientY, target }) => {
    setCoords([clientX, clientY])
    setTarget(target)
  })
  return { coords, target }
}

const MouseFollower = () => {
  let [isHovered, setIsHovered] = useState(false)
  let $outerCircle = useRef(null)
  let $innerCircle = useRef(null)

  const { coords, target } = useMouseMove()
  $outerCircle.current &&
    coords[0] !== 0 &&
    gsap.to($outerCircle.current, 0.4, { ease: "Power1.easeOut", x: coords[0], y: coords[1] })
  $innerCircle.current && coords[0] !== 0 && gsap.set($innerCircle.current, { x: coords[0], y: coords[1] })

  const getTimeline = useCallback(() => {
    let hoverTl = gsap
      .timeline({
        paused: true,
        defaults: { ease: "Power1.easeOut", duration: 0.2 },
        onStart: () => setIsHovered(true),
        onReverseComplete: () => setIsHovered(false)
      })
      .addLabel("sync")
    $innerCircle.current &&
      hoverTl.to(
        $innerCircle.current,
        { scale: 4, opacity: 1, border: "thin solid #8b7230", background: "none" },
        "sync"
      )
    $outerCircle.current && hoverTl.to($outerCircle.current, { opacity: 0 }, "sync")

    return hoverTl
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [$outerCircle.current, $innerCircle.current])

  let hoverTl = useMemo(() => getTimeline(), [getTimeline])

  useEffect(() => {
    $outerCircle.current && target && target.classList.contains("mf-active")
      ? hoverTl.play()
      : $outerCircle.current && isHovered && hoverTl.reverse()
  })

  return (
    <div className="mouseFollower">
      <div ref={$outerCircle} className="outer-circle"></div>
      <div ref={$innerCircle} className="inner-circle"></div>
    </div>
  )
}

export default MouseFollower
