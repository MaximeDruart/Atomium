import React, { useContext, useEffect, useRef } from "react"
import { Context } from "../Context"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Molecule from "./three/Molecule"
import Atom from "./three/Atom"

const THREECanvas = () => {
  const { updateContext, ...context } = useContext(Context)
  const $canvas = useRef(null)

  const ran = x => Math.random() * x - x / 2

  // threejs scene
  useEffect(() => {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 15

    /**
     * Objects
     */

    // molecule
    const mol = new Molecule()
    const atom = new THREE.Mesh(mol.sphereGeometry, mol.wfMaterial)
    atom.position.set(5, -2, 2)
    const atom2 = new THREE.Mesh(mol.sphereGeometry, mol.wfMaterial)
    atom2.position.set(-6, 1, -3)
    const atom3 = new THREE.Mesh(mol.sphereGeometry, mol.wfMaterial)
    atom3.position.set(-1, 3, 6)

    const moleculeGroup = new THREE.Group()
    moleculeGroup.add(atom)
    moleculeGroup.add(atom2)
    moleculeGroup.add(atom3)

    const atomLink12 = mol.getLink(mol.atomSize)
    moleculeGroup.add(atomLink12)
    const atomLink13 = mol.getLink(mol.atomSize)
    moleculeGroup.add(atomLink13)

    moleculeGroup.position.set(1, 1, 1)

    // scene.add(moleculeGroup)

    // SINGLE ATOM
    // let fullAtom = new Atom({})
    // let fullAtomGroup = fullAtom.getAtom().group
    // scene.add(fullAtomGroup)

    // BALLS SCENE

    const getAtoms = x => {
      const atoms = []
      for (let i = 0; i < x; i++) {
        let atom = atomInstance.getAtom()
        i !== 0 && atom.atomGroup.position.set(ran(100), ran(100), ran(100))
        atoms.push(atom)
        scene.add(atom.atomGroup)
      }
      return atoms
    }

    const atomInstance = new Atom({})
    const atoms = getAtoms(50)

    /**
     * Lights
     */

    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearAlpha(0)
    $canvas.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    const animate = function(t) {
      controls.update()

      // keeping atom links updated
      // mol.setLinkCoords(atom, atom2, atomLink12, mol.atomSize)
      // mol.setLinkCoords(atom, atom3, atomLink13, mol.atomSize)

      // moving around electrons
      atoms.forEach(atom => atomInstance.animateElectrons(t, atom.electronsGroup))

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    const resizeHandler = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", resizeHandler)
    return () => window.removeEventListener("resize", resizeHandler)
  }, [])

  return <div className="canvasContainer" ref={$canvas}></div>
}

export default THREECanvas
