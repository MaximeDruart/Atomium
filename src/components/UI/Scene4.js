import React, { useEffect, useContext, useRef } from "react"
import gsap from "gsap"
import { Context } from "../../Context"
import "./Scene4.scss"

const Scene4 = () => {
  const { toggleControls, toggleCube, $background, $canvas, game, toggleHelp, clearSceneOfGroups } = useContext(Context)
  const $scene4 = useRef(null)

  useEffect(() => {
    game.listenToEvents()
    toggleControls(true)
    toggleCube(false)
    toggleHelp(true)

    gsap.from($scene4.current, 0.8, { opacity: 0 })
    gsap.to($background.current, 0.8, { opacity: 0 })
    gsap.set($canvas.current, { zIndex: 10 })
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return () => {
      toggleHelp(false)
      game.clearEvents()
      clearSceneOfGroups()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={$scene4} className="scene-2 scene-4">
      <div className="title">Assemble les atomes et découvre des molécules !</div>
      <div className="controls">
        <div className="molecules">
          <div onClick={() => game.createSimpleAtom(3, "black")} className="molecule">
            Carbone
          </div>
          <div onClick={() => game.createSimpleAtom(1, "white")} className="molecule">
            Hydrogène
          </div>
          <div onClick={() => game.createSimpleAtom(2, "blue")} className="molecule">
            Oxygène
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scene4
