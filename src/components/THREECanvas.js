/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef } from "react"
import { Context } from "../Context"
import * as THREE from "three"
import { OrbitControls as ABSOLUTELYNOTORBITCONTROLS } from "three/examples/jsm/controls/OrbitControls.js"
import Molecule from "./three/Molecule"
import Atom from "./three/Atom"
import gsap from "gsap"
import ThreePlugin from "./three/GSAPTHREE"
import cubeAlphaMapSource from "../assets/images/cubeAlphaMap.jpg"
gsap.registerPlugin(ThreePlugin)

const THREECanvas = () => {
  const { updateContext, ...context } = useContext(Context)
  const $canvas = useRef(null)

  const ran = x => Math.random() * x - x / 2

  // threejs scene
  useEffect(() => {
    updateContext("$canvas", $canvas)
    const textureLoader = new THREE.TextureLoader()
    const cubeAlphaMap = textureLoader.load(cubeAlphaMapSource)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    // using an object so it can be tweened
    let rotateSpeed = {
      value: 0.008
    }

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
    let atomsSceneGroup = new THREE.Group()
    const getAtoms = x => {
      const atoms = []
      for (let i = 0; i < x; i++) {
        let atom
        if (i === 0) {
          atom = new Atom({ scene, atomRadius: 2, neutrons: 6, protons: 6, electrons: 6 }).getAtom()
        } else {
          let elecCharge = Math.floor(Math.random() * 5) + 1
          atom = new Atom({
            scene,
            atomRadius: 2,
            neutrons: Math.floor(Math.random() * 3) + 1,
            protons: elecCharge,
            electrons: elecCharge
          }).getAtom()
          atom.atomGroup.position.set(ran(100), ran(70), ran(100))
        }
        atoms.push(atom)
        atomsSceneGroup.add(atom.atomGroup)
      }
      return atoms
    }

    scene.add(atomsSceneGroup)

    const atomInstance = new Atom({ scene })
    const atoms = getAtoms(150)

    let atomGroups = atoms.map(({ atomGroup }) => atomGroup)
    let atomGroupsButFirst = atomGroups.slice(1)

    camera.position.set(3, 25, 150)

    let rotateCamera = false
    let introSpawnTl = gsap
      .timeline({
        paused: true,
        defaults: {
          ease: "Power2.easeOut",
          duration: 4
        }
      })
      .addLabel("sync")
      .to(camera.position, { duration: 3.5, x: 0, y: 0, onComplete: () => (rotateCamera = true) }, "sync")
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

    // let firstAtomPos = atoms[0].atomGroup.position.matrixWorld
    let firstAtomPos = new THREE.Vector3().setFromMatrixPosition(atoms[0].atomGroup.matrixWorld)

    const cubeGeometry = new THREE.BoxBufferGeometry(6, 6, 6)
    const cubeMesh = new THREE.Mesh(
      cubeGeometry,
      new THREE.MeshStandardMaterial({
        opacity: 0.8,
        side: THREE.DoubleSide,
        color: 0xb2954d,
        alphaMap: cubeAlphaMap,
        wireframe: true
      })
    )

    // let scene2Group = new THREE.Group()
    let goToSecondTl = gsap
      .timeline({
        paused: true,
        defaults: {
          ease: "Power2.easeOut",
          duration: 4
        },
        onStart: () => {
          camera.lookAt(firstAtomPos)
          rotateCamera = false
          introSpawnTl.kill()
          cubeMesh.scale.set(0.01, 0.01, 0.01)
          scene.add(cubeMesh)

          // on complete :
          // kinda hacky but else its too long to wait for all atoms to despawn
          setTimeout(() => {
            controls = new ABSOLUTELYNOTORBITCONTROLS(camera, renderer.domElement)
            controls.enableDamping = true
            controls.enablePan = false
            controls.maxDistance = 35
            controls.minDistance = 5
            controls.dampingFactor = 0.05
            atomGroupsButFirst.forEach(atom => atomsSceneGroup.remove(atom))
            updateContext("activeScene", 1)
          }, 2500)
        }
      })
      .addLabel("sync")
      .to(
        atomGroupsButFirst,
        {
          duration: 0.5,
          three: { scaleX: 0.01, scaleY: 0.01, scaleZ: 0.01 },
          stagger: 0.01
        },
        "sync"
      )
      .to(
        camera.position,
        {
          duration: 2,
          onUpdate: () => camera.lookAt(scene.position),
          x: firstAtomPos.x,
          y: firstAtomPos.y,
          z: firstAtomPos.z - 12
        },
        "sync"
      )
      .to(rotateSpeed, { value: 0 }, "sync")
      .to(cubeMesh.scale, 2, { x: 1, y: 1, z: 1 }, "sync")

    const switchAtom = ({ protons, neutrons, electrons }) => {
      let atomChild = scene.children.filter(child => child.children.length > 0)[0]
      gsap.to(atomChild.scale, 0.4, {
        ease: "Power3.easeIn",
        x: 0.01,
        y: 0.01,
        z: 0.01,
        onComplete: () => {
          scene.remove(atomChild)
          const atom = new Atom({ scene, protons, neutrons, electrons, atomRadius: 2 }).getAtom()
          scene.add(atom.atomGroup)
          atoms.push(atom)
          gsap.from(atom.atomGroup.scale, 0.4, {
            ease: "Power3.easeOut",
            x: 0.01,
            y: 0.01,
            z: 0.01
          })
        }
      })
    }

    const clearAtomsAnimated = () => {
      let atomGrps = atoms.map(({ atomGroup }) => atomGroup)
      gsap.to(cubeMesh, 0.8, { ease: "Power3.easeInOut", three: { scaleX: 0, scaleY: 0, scaleZ: 0 } })
      gsap.to(atomGrps, 0.8, {
        ease: "Power3.easeInOut",
        three: { scaleX: 0, scaleY: 0, scaleZ: 0 },
        onComplete: () => {
          scene.remove(cubeMesh)
          atoms.forEach(atom => scene.remove(atom.atomGroup))
        }
      })
    }

    const clearSceneOfGroups = () => {
      scene.children.forEach((children, index, scene) => {
        children.children.length > 0 && scene.remove(children)
      })
    }

    // transition between second and third where two atoms link together by switching electrons. would take too much time right now.
    const secondToThirdTl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "Power2.easeOut",
        duration: 4
      },
      onStart: () => {}
    })
    // .addLabel("sync").to

    // scene.add(cubeMesh)

    updateContext("switchAtom", switchAtom)
    updateContext("introSpawnTl", introSpawnTl)
    updateContext("goToSecondTl", goToSecondTl)
    updateContext("secondToThirdTl", secondToThirdTl)
    updateContext("clearAtomsAnimated", clearAtomsAnimated)
    /**
     * Lights
     */

    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    const additionalLight = new THREE.DirectionalLight(0xb4974f, 1)
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

    let controls

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
      controls && controls.update()
      if (rotateCamera) {
        camera.position.x =
          camera.position.x * Math.cos(rotateSpeed.value) + camera.position.z * Math.sin(rotateSpeed.value)
        camera.position.z =
          camera.position.z * Math.cos(rotateSpeed.value) - camera.position.x * Math.sin(rotateSpeed.value)
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
