import React, { useContext, useEffect, useRef } from "react"
import { Context } from "../Context"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const THREECanvas = () => {
  const { updateContext, ...context } = useContext(Context)
  const $canvas = useRef(null)

  // threejs scene
  useEffect(() => {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50)
    camera.position.z = 8

    // Objects
    const atomSize = 5

    let sphereGeometry = new THREE.SphereGeometry(atomSize, 16, 16)
    let wfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0xa6f9
    })

    const getLink = (atomSize = 5, segments = 16, mat = wfMaterial) =>
      new THREE.Mesh(new THREE.CylinderGeometry(atomSize / 5, atomSize / 5, 1, segments, segments, true), mat)

    const setLinkCoords = (atom1, atom2, atomLink, atomSize) => {
      let distanceBetweenAtoms = atom1.position.distanceTo(atom2.position) - atomSize * 2
      // setting the link to the position of the first atom
      atomLink.position.copy(atom1.position)
      // rotating it to look at the 2nd
      atomLink.lookAt(atom2.position)
      atomLink.rotateX(Math.PI / 2)
      // translating it by half its width + the size of an atom
      atomLink.translateY(distanceBetweenAtoms / 2 + atomSize)
      // scaling it to fit to the needed distance
      atomLink.scale.y = distanceBetweenAtoms
    }

    const atom = new THREE.Mesh(sphereGeometry, wfMaterial)
    atom.position.set(5, -2, 2)
    const atom2 = new THREE.Mesh(sphereGeometry, wfMaterial)
    atom2.position.set(-12, 12, -3)
    const atom3 = new THREE.Mesh(sphereGeometry, wfMaterial)
    atom3.position.set(-2, 6, 12)

    const atomLink12 = getLink(atomSize)
    setLinkCoords(atom, atom2, atomLink12, atomSize)
    const atomLink13 = getLink(atomSize)
    setLinkCoords(atom, atom3, atomLink13, atomSize)

    scene.add(atom)
    scene.add(atom2)
    scene.add(atom3)
    scene.add(atomLink12)
    scene.add(atomLink13)

    // Lights

    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    // renderer
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
      atom.position.x = Math.sin(t / 110) * 2
      atom.position.y = -Math.sin(t / 90) * 2
      atom.position.z = -Math.sin(t / 120) * 2
      setLinkCoords(atom, atom2, atomLink12, atomSize)
      setLinkCoords(atom, atom3, atomLink13, atomSize)
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
