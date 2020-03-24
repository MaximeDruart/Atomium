import React, { useContext, useEffect, useRef } from "react"
import { Context } from "../Context"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Molecule from "./three/Molecule"
import Atom from "./three/Atom"

const THREECanvas = () => {
  const { updateContext, ...context } = useContext(Context)
  const $canvas = useRef(null)

  // threejs scene
  useEffect(() => {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 8

    /**
     * Objects
     */

    const mol = new Molecule()

    // molecule
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
    mol.setLinkCoords(atom, atom2, atomLink12, mol.atomSize)

    const atomLink13 = mol.getLink(mol.atomSize)
    moleculeGroup.add(atomLink13)
    mol.setLinkCoords(atom, atom3, atomLink13, mol.atomSize)
    moleculeGroup.position.set(1, 1, 1)

    scene.add(moleculeGroup)

    // atom
    let fullAtom = new Atom({})
    let fullAtomGroup = fullAtom.group
    // scene.add(fullAtomGroup)

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

      // atom.position.x = Math.sin(t / 110) * 2
      // atom.position.y = -Math.sin(t / 90) * 2
      // atom.position.z = -Math.sin(t / 120) * 2

      mol.setLinkCoords(atom, atom2, atomLink12, mol.atomSize)
      mol.setLinkCoords(atom, atom3, atomLink13, mol.atomSize)

      fullAtom.animateElectrons(t)

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
