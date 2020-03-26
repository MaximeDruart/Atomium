/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls as ABSOLUTELYNOTORBITCONTROLS } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import ThreePlugin from "./three/GSAPTHREE"
import cubeAlphaMapSource from "../assets/images/cubeAlphaMap.jpg"
import { Context } from "../Context"
import Molecule from "./three/Molecule"
import Atom from "./three/Atom"

gsap.registerPlugin(ThreePlugin)

const THREECanvas = () => {
  const { updateContext } = useContext(Context)
  const $canvas = useRef(null)

  const ran = x => Math.random() * x - x / 2

  // threejs scene
  useEffect(() => {
    updateContext("$canvas", $canvas)
    const textureLoader = new THREE.TextureLoader()
    const cubeAlphaMap = textureLoader.load(cubeAlphaMapSource)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog("lightblue", 5, 100)

    const mol = new Molecule()
    const atomInstance = new Atom({ scene })

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500)
    camera.position.set(3, 25, 150)
    // using an object so it can be tweened
    let rotateSpeed = { value: 0.008 }
    let rotateCamera = false

    // const axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)

    // const gridHelper = new THREE.GridHelper(100, 100)
    // scene.add(gridHelper)

    /**
     * Objects
     */

    const cubeMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(6, 6, 6),
      new THREE.MeshStandardMaterial({
        opacity: 0.8,
        side: THREE.DoubleSide,
        color: 0xb2954d,
        alphaMap: cubeAlphaMap,
        wireframe: true
      })
    )
    // adding a name to the cube so later we can check if it's in the scene or not
    cubeMesh.name = "cubeMesh"

    const adjustCamForMoleculeTl = forward => {
      let tl = gsap.timeline().addLabel("sync")
      if (forward) {
        tl.to(camera.position, 0.3, { z: -20 }, "sync")
        tl.to(
          cubeMesh.scale,
          0.3,
          {
            x: cubeMesh.scale.x * 1.95,
            y: cubeMesh.scale.y * 1.95,
            z: cubeMesh.scale.z * 1.95
          },
          "sync"
        )
      } else {
        tl.to(camera.position, 0.3, { z: -10 }, "sync")
        tl.to(
          cubeMesh.scale,
          0.3,
          {
            x: 1,
            y: 1,
            z: 1
          },
          "sync"
        )
      }
    }

    // molecule
    let molecules = []
    const switchMolecule = molecule => {
      // if molecules.length === 0, meaning that it's the first molecule to spawn and we need to adjust the camera coming from scene 2
      // molecules.length === 0 && adjustCamForMoleculeTl.play()
      let switchMolTl = gsap.timeline({
        defaults: { duration: 0.4 }
      })
      molecules.length > 0 &&
        switchMolTl.to(molecules[molecules.length - 1].group.scale, {
          ease: "Power3.easeIn",
          x: 0.5,
          y: 0.5,
          z: 0.5,
          onComplete: () => {
            scene.remove(molecules[molecules.length - 1].group)
            molecules.pop()
          }
        })
      switchMolTl.fromTo(
        molecule.group.scale,
        { x: 0.01, y: 0.01, z: 0.01 },
        {
          onStart: () => {
            scene.add(molecule.group)
            molecules.push(molecule)
          },
          ease: "Power3.easeOut",
          x: 1,
          y: 1,
          z: 1
        }
      )
    }

    // BALLS SCENE
    const atomsSceneGroup = new THREE.Group()
    scene.add(atomsSceneGroup)
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

    let atoms = getAtoms(150)
    let atomGroups = atoms.map(({ atomGroup }) => atomGroup)
    // all atoms but the first whos going to stay for scene 2
    let atomGroupsButFirst = atomGroups.slice(1)

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

    const goToSecondTl = () => {
      gsap
        .timeline({
          defaults: {
            ease: "Power2.easeOut",
            duration: 4
          },
          onStart: () => {
            rotateCamera = false
            introSpawnTl.kill()
            cubeMesh.scale.set(0.01, 0.01, 0.01)
            scene.add(cubeMesh)

            // kinda hacky but else its too long to wait for all atoms to despawn
            // on complete :
            setTimeout(() => {
              atomGroupsButFirst.forEach(atom => atomsSceneGroup.remove(atom))
              updateContext("activeScene", 1)
              atoms = atoms.slice(0, 1)
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
            x: scene.position.x,
            y: scene.position.y,
            z: scene.position.z - 12
          },
          "sync"
        )
        .to(rotateSpeed, { value: 0 }, "sync")
        .to(cubeMesh.scale, 2, { x: 1, y: 1, z: 1 }, "sync")
    }

    const switchAtom = ({ protons, neutrons, electrons }) => {
      // the only child with children at the moment this function is executed is the atom group.
      let atomChild = scene.children.filter(child => child.children.length > 0)[0]

      console.log(scene.children)
      console.log(atomChild)
      let switchAtomTl = gsap.timeline({ onComplete: () => console.log(scene.children), defaults: { duration: 0.4 } })
      atomChild &&
        switchAtomTl.to(atomChild.scale, 0.4, {
          ease: "Power3.easeIn",
          x: 0.01,
          y: 0.01,
          z: 0.01,
          onComplete: () => scene.remove(atomChild)
        })
      // atomChild
      const atom = new Atom({ scene, protons, neutrons, electrons, atomRadius: 2 }).getAtom()
      scene.add(atom.atomGroup)
      atoms.push(atom)
      switchAtomTl.fromTo(
        atom.atomGroup.scale,
        { x: 0.01, y: 0.01, z: 0.01 },
        {
          ease: "Power3.easeOut",
          duration: 0.4,
          x: 1,
          y: 1,
          z: 1
        }
      )
    }

    const clearAtomsAnimated = () => {
      let atomGrps = atoms.map(({ atomGroup }) => atomGroup)
      gsap.to(atomGrps, 0.8, {
        ease: "Power3.easeInOut",
        three: { scaleX: 0.01, scaleY: 0.01, scaleZ: 0.01 },
        onComplete: () => atoms.forEach(atom => scene.remove(atom.atomGroup))
      })
    }

    const clearSceneOfGroups = () => {
      scene.children.forEach(children => {
        children.children.length > 0 && scene.remove(children)
      })
    }

    const toggleCube = isTrue =>
      isTrue ? !scene.getObjectByName("cubeMesh") && scene.add(cubeMesh) : scene.remove(cubeMesh)

    const toggleControls = isTrue => {
      if (isTrue) {
        if (!controls) {
          rotateCamera = false
          controls = new ABSOLUTELYNOTORBITCONTROLS(camera, renderer.domElement)
          controls.enableDamping = true
          controls.enablePan = false
          controls.maxDistance = 35
          controls.minDistance = 5
          controls.dampingFactor = 0.05
        }
      } else controls = null
    }

    // passing these functions to context so they can be accessed from the scenes.

    // scene transitions
    updateContext("introSpawnTl", introSpawnTl)
    updateContext("goToSecondTl", goToSecondTl)

    // scene specifics
    updateContext("switchAtom", switchAtom)
    updateContext("switchMolecule", switchMolecule)

    // utils
    updateContext("clearAtomsAnimated", clearAtomsAnimated)
    updateContext("clearSceneOfGroups", clearSceneOfGroups)
    updateContext("toggleControls", toggleControls)
    updateContext("toggleCube", toggleCube)
    updateContext("adjustCamForMoleculeTl", adjustCamForMoleculeTl)

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
      // keeping molecules links updated
      molecules.forEach(molecule => {
        molecule.links.forEach(link => {
          mol.setLinkCoords(
            molecule.atoms[link.origin].mesh,
            molecule.atoms[link.end].mesh,
            link.mesh,
            molecule.atoms[link.origin].size,
            molecule.atoms[link.end].size
          )
        })
      })

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
