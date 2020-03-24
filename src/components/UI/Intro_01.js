import React from "react"
import "./Intro_01.scss"

const Intro = props => {
  return (
    <div className="intro-container">
      <div className="number">01</div>
      <div className="text-container">
        <div className="text-item">La matière est constituée de molécules et d'atomes.</div>
        <div className="text-item">
          <div className="title">Qu'est ce qu'une molécule ?</div>
          <div className="body">
            Une molécule est une particule microscopique qui compose la plupart des matières. Une molécule correspond à
            un regroupement d'atomes liés entre eux. Ces atomes ne peuvent se séparer spontanément : seule une
            transformation chimique peut modifier la composition d'une molécule.
          </div>
        </div>
        <div className="text-item">
          <div className="title">Et un atome alors ?</div>
          <div className="body">
            Un atome contient un noyau (ensemble de protons et de neutrons), et autour de ce noyau, il y a des
            électrons. On distingue ces particules du fait qu'elles comportent des « charges » différentes : les
            neutrons n'ont aucune charge, les protons ont une charge positive, et les électrons une charge négative. Ce
            sont les atomes qui composent les molécules.
          </div>
        </div>
        <div className="text-item">
          Vous découvrirez donc à travers ce musée virtuel les principaux atomes qui constituent notre monde ainsi que
          les molécules les plus répandues.
        </div>
      </div>
    </div>
  )
}

export default Intro
