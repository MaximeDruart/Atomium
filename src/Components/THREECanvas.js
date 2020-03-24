import React, { useContext, useEffect, useRef } from "react"
import { Context } from "../Context"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Molecule from "./three/Molecule"
import Atom from "./three/Atom"
import gsap from "gsap"
import ThreePlugin from "./three/GSAPTHREE"
import cubeAlphaMapSource from "../Images/cubeAlphaMap.jpg"
gsap.registerPlugin(ThreePlugin)

const THREECanvas = () => {
  const { updateContext, ...context } = useContext(Context)
  const $canvas = useRef(null)

  const ran = x => Math.random() * x - x / 2

  // threejs scene
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    const cubeAlphaMap = textureLoader.load(cubeAlphaMapSource)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    // var axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)

    // var gridHelper = new THREE.GridHelper(100, 100)
    // scene.add(gridHelper)

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

    // BALLS SCENE
    const getAtoms = x => {
      const atoms = []
      for (let i = 0; i < x; i++) {
        let atom = atomInstance.getAtom()
        i !== 0 && atom.atomGroup.position.set(ran(100), ran(70), ran(100))
        atoms.push(atom)
        scene.add(atom.atomGroup)
      }
      return atoms
    }

    const atomInstance = new Atom({ scene, atomRadius: 2 })
    const atoms = getAtoms(150)

    let atomGroups = atoms.map(({ atomGroup }) => {
      return atomGroup
    })

    camera.position.set(3, 25, 150)

    let spawnEnded = false
    let spawnTl = gsap
      .timeline({
        paused: false,
        defaults: {
          ease: "Power2.easeOut",
          duration: 4
        }
      })
      .addLabel("sync")
      .to(camera.position, { duration: 3.5, x: 0, y: 0, onComplete: () => (spawnEnded = true) }, "sync")
      .to(camera.position, { z: 15 }, "sync")
      .from(camera.rotation, { y: Math.PI / 8, z: -Math.PI / 4 }, "sync")
      .from(
        atomGroups,
        {
          duration: 0.6,
          three: { scaleX: 0.01, scaleY: 0.01, scaleZ: 0.01 },
          stagger: 0.07
        },
        "sync"
      )

    // spawnTl.play()

    // WIREFRAME CUBE
    // const cubeGeometry = new THREE.BoxBufferGeometry(10, 10, 10)

    // var edges = new THREE.EdgesGeometry(cubeGeometry, 10)
    // var line = new THREE.LineSegments(
    //   edges,
    //   new THREE.LineDashedMaterial({ color: 0x000000, linewidth: 1, scale: 1, dashSize: 2, gapSize: 8 })
    //   // new THREE.MeshStandardMaterial({ color: "red", alphaMap: cubeAlphaMap, wireframe: true })
    // )
    // line.computeLineDistances()
    // scene.add(line)

    // scene.add(
    //   new THREE.Mesh(
    //     cubeGeometry,
    //     new THREE.MeshStandardMaterial({ color: 0xb2954d, alphaMap: cubeAlphaMap, wireframe: true })
    //   )
    // )

    /**
     * Lights
     */

    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    const additionalLight = new THREE.DirectionalLight(0xB4974F, 1)
    additionalLight.position.set(2, 2, 2)
    scene.add(additionalLight)


    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearAlpha(0)
    $canvas.current.appendChild(renderer.domElement)

    // const controls = new OrbitControls(camera, renderer.domElement)
    // controls.enableDamping = true
    // controls.dampingFactor = 0.05

    const animate = function(t) {
      // keeping atom links updated
      // mol.setLinkCoords(atom, atom2, atomLink12, mol.atomSize)
      // mol.setLinkCoords(atom, atom3, atomLink13, mol.atomSize)

      // moving around electrons
      atoms.forEach(atom =>
        atomInstance.animateElectrons(
          t,
          atom.atomGroup,
          atom.electronsGroup,
          atom.electronTrailsGeometries,
          atom.electronTrailsMeshes
        )
      )

      // camera movements
      // controls.update()
      if (spawnEnded) {
        camera.position.x = camera.position.x * Math.cos(0.008) + camera.position.z * Math.sin(0.008)
        camera.position.z = camera.position.z * Math.cos(0.008) - camera.position.x * Math.sin(0.008)
        camera.lookAt(scene.position)
      }
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
