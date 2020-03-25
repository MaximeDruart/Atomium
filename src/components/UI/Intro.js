import React, { useContext, useState, useEffect, useRef, useCallback } from "react"
import "./Intro.scss"
import { Context } from "../../Context"
import gsap from "gsap"

const introTexts = [
  {
    body: "La matière est constituée de molécules et d'atomes."
  },
  {
    title: "Qu'est ce qu'une molécule ?",
    body:
      "Une molécule est une particule microscopique qui compose la plupart des matières. Une molécule correspond à un regroupement d'atomes liés entre eux. Ces atomes ne peuvent se séparer spontanément : seule une transformation chimique peut modifier la composition d'une molécule."
  },
  {
    title: "Et un atome alors ?",
    body:
      " Un atome contient un noyau (ensemble de protons et de neutrons), et autour de ce noyau, il y a des électrons. On distingue ces particules du fait qu'elles comportent des « charges » différentes : les neutrons n'ont aucune charge, les protons ont une charge positive, et les électrons une charge négative. Ce sont les atomes qui composent les molécules."
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
      let scrollValue = Math.floor(deltaY / 50) >= 1 ? 1 : Math.floor(deltaY / 50) < 0 ? -1 : 0
      let newValue = gsap.utils.clamp(0, introTexts.length - 1, textIndex + scrollValue)
      let actualTime = Date.now()
      if (actualTime - timeSinceLastChange > 1000 && scrollValue !== 0) {
        setTimeSinceLastChange(Date.now())
        textIndex !== newValue &&
          gsap.from($textContainer.current, { duration: 0.9, ease: "Power3.easeInOut", opacity: 0 })
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
      <div onClick={goToNext} className="skip-button button">
        SKIP INTRO
      </div>
    </div>
  )
}

export default Intro
