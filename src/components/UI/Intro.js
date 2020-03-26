import React, { useContext, useState, useEffect, useRef, useCallback } from "react"
import "./Intro.scss"
import { Context } from "../../Context"
import gsap from "gsap"

const introTexts = [
  {
    body: "Le monde est rempli d’atomes et de molécules qui s’assemblent pour créer la matière qui nous entoure."
  },
  {
    title: "Qu'est ce qu'une molécule ?",
    body:
      "Une molécule est une particule microscopique qui naît d’un  regroupement d'atomes. "
  },
  {
    title: "Et un atome alors ?",
    body:
      "Un atome contient un noyau autour du quel gravite des électrons. Il possède 3 types de particules : les neutrons, les protons et les electrons. Ce sont ces atomes qui composent les molécules."
  },
  {
    body:
      "Vous découvrirez donc à travers ce musée virtuel les principaux atomes qui constituent notre monde ainsi que les molécules les plus répandues."
  }
]

const Intro = props => {
  const { updateContext, introSpawnTl, goToSecondTl } = useContext(Context)
  const [textIndex, setTextIndex] = useState(0)
  const $introContainer = useRef(null)
  const $textContainer = useRef(null)
  const [timeSinceLastChange, setTimeSinceLastChange] = useState(Date.now())

  const wheelHandler = ({ deltaY }) => {
    setTextIndex(textIndex => {
      let scrollValue = Math.floor(deltaY) >= 1 ? 1 : Math.floor(deltaY / 50) < 0 ? -1 : 0
      let newValue = gsap.utils.clamp(0, introTexts.length - 1, textIndex + scrollValue)
      let actualTime = Date.now()
      if (actualTime - timeSinceLastChange > 1000 && scrollValue !== 0) {
        // setTimeSinceLastChange(Date.now())
        // textIndex !== newValue &&
        //   gsap.from($textContainer.current, { duration: 0.9, ease: "Power3.easeInOut", opacity: 0 })

        setTimeSinceLastChange(Date.now())
        textIndex !== newValue &&
          gsap.timeline().fromTo($textContainer.current, { opacity: 0 }, { opacity: 1, duration: 1.5 })

        // textIndex === introTexts.length && goToNext()
        return newValue
      } else return textIndex
    })
  }

  const goToNext = () => {
    gsap
      .timeline({
        defaults: {
          ease: "Power3.easeInOut",
          duration: 1
        },
        onStart: () => goToSecondTl.play()
      })
      .addLabel("sync")
      .to($introContainer.current, { opacity: 0, duration: 1, ease: "Power3.easeInOut" })
  }

  // playing the atom spawns timeline on mount
  useEffect(() => {
    const spawnText = () =>
      setTimeout(() => {
        gsap.timeline().to($introContainer.current, 1, { ease: "Power3.easeInOut", opacity: 1 })
      }, 3500)
    if (introSpawnTl) {
      introSpawnTl.eventCallback("onStart", spawnText)
      introSpawnTl.play()
    }
  }, [introSpawnTl])

  const getMappedTexts = useCallback(
    () =>
      introTexts.map((text, index) => (
        <div key={index} style={{ display: index === textIndex ? "block" : "none" }} className="text-item">
          {text.title && <div className="title">{text.title}</div>}
          <div className="body">{text.body}</div>
        </div>
      )),
    [textIndex]
  )

  return (
    <div onWheel={wheelHandler} ref={$introContainer} style={{ opacity: 0 }} className="intro-container">
      <div className="number">01</div>
      <div ref={$textContainer} className="text-container">
        {getMappedTexts()}
      </div>
      <div onClick={goToNext} className="mf-active skip-button button">
        SKIP INTRO
      </div>
    </div>
  )
}

export default Intro
