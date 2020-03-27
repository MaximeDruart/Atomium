/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls as ABSOLUTELYNOTORBITCONTROLS } from "three/examples/jsm/controls/OrbitControls.js"
import { DragControls } from "three/examples/jsm/controls/DragControls"
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

    const axesHelper = new THREE.AxesHelper(10)
    const gridHelper = new THREE.GridHelper(100, 100)

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

    // scaling down molecules with links is buggy so between scene 2 and 3 i'm actually dezooming the camera and upscaling the cube :D
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
    // switch between molecules in scene 3
    const switchMolecule = molecule => {
      let switchMolTl = gsap.timeline({ defaults: { duration: 0.4 } })
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

    // Intro scene with atoms everywhere
    const atomsSceneGroup = new THREE.Group()
    scene.add(atomsSceneGroup)
    // returns an array of x atoms, the first atom will be a carbon atom in the center of the scene needed for transition from intro to scene 2
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
    // extracting groups to allow for gsap animations
    let atomGroups = atoms.map(({ atomGroup }) => atomGroup)
    // all atoms but the first whos going to stay for scene 2
    let atomGroupsButFirst = atomGroups.slice(1)

    // Intro spawn timeline : camera dolly to the center of the scene + atoms stagger spawn
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

    // transition to scene 2 : staggered scale down of all atoms but the first one, which is the the new camera focus point.
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

    // switch between atoms for scene 2 : atom scale down then is dismounted. next atom is created with parameters and appears with scale up.
    const switchAtom = ({ protons, neutrons, electrons }) => {
      // the only child with children at the moment this function is executed is the atom group.
      let atomChild = scene.children.filter(child => child.children.length > 0)[0]
      let switchAtomTl = gsap.timeline({ defaults: { duration: 0.4 } })
      atomChild &&
        switchAtomTl.to(atomChild.scale, 0.4, {
          ease: "Power3.easeIn",
          x: 0.01,
          y: 0.01,
          z: 0.01,
          onComplete: () => scene.remove(atomChild)
        })
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

    const toggleHelp = isTrue => {
      if (isTrue) {
        scene.add(axesHelper)
        scene.add(gridHelper)
      } else {
        scene.remove(axesHelper)
        scene.remove(gridHelper)
      }
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
    updateContext("toggleHelp", toggleHelp)
    updateContext("adjustCamForMoleculeTl", adjustCamForMoleculeTl)

    // SCENE 4  :

    class Game {
      constructor() {
        this.group = new THREE.Group()
        this.wfMaterial = new THREE.MeshStandardMaterial({ wireframe: true, color: 0x666666 })
        this.sphereGeometry = new THREE.SphereGeometry(2, 8, 8)
        scene.add(this.group)
        this.isRaycasting = false
        this.raycaster = new THREE.Raycaster()
        this.mousePos = new THREE.Vector2()
        this.controls = new DragControls(this.group.children, camera, renderer.domElement)
        this.elementsToRaycast = this.group.children
        this.molecules = []
        this.selectedAtoms = []
      }

      ran = x => Math.random() * x - x / 2

      createSimpleAtom = (size, color) => {
        let atom = new THREE.Mesh(
          new THREE.SphereGeometry(size, 8, 8),
          new THREE.MeshStandardMaterial({ wireframe: true, color: color || 0x666666 })
        )
        atom.userData = { size, color }
        atom.position.set(this.ran(5), this.ran(5) + 5, this.ran(5))
        this.group.add(atom)
      }

      getLink = (atomSize = 2, segments = 8, mat = this.wfMaterial) =>
        new THREE.Mesh(new THREE.CylinderGeometry(atomSize / 5, atomSize / 5, 1, segments, segments, true), mat)

      // handling link creation between atoms : clicking an atom then a second will link them together
      clickHandler = () => {
        game.raycaster.setFromCamera(this.mousePos, camera)
        let intersects = game.raycaster.intersectObjects(game.elementsToRaycast)

        for (var i = 0; i < intersects.length; i++) {
          intersects[0].object.material.color.set(0xff0000)
          if (this.selectedAtoms.length === 1) {
            if (this.selectedAtoms[0] === intersects[0].object) {
              this.selectedAtoms[0].material.color.set(this.selectedAtoms[0].userData.color)
            } else this.connectAtoms(this.selectedAtoms[0], intersects[0].object)
            this.selectedAtoms = []
          } else this.selectedAtoms.push(intersects[0].object)
        }
      }

      // adds a link between 2 atoms and creates a molecule object to append to game molecules.
      // WIP
      connectAtoms = (atom1, atom2) => {
        // let moleculeGroup = new THREE.Group()
        const linkMesh = this.getLink()
        const link = {
          mesh: linkMesh,
          origin: atom1,
          end: atom2
        }
        atom1.material.color.set(atom1.userData.color)
        const atom1obj = { mesh: atom1, size: atom1.userData.size }
        const atom2obj = { mesh: atom2, size: atom2.userData.size }
        atom2.material.color.set(atom2.userData.color)
        // moleculeGroup.add(atom1, atom2, linkMesh)
        const moleculeRaw = {
          atom1: atom1obj,
          atom2: atom2obj,
          link
          // group: moleculeGroup
        }
        scene.add(linkMesh)
        // this.group.add(moleculeGroup)
        this.molecules.push(moleculeRaw)
      }

      mouseMoveHandler = event => {
        this.mousePos.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1

        game.raycaster.setFromCamera(this.mousePos, camera)
        let intersects = game.raycaster.intersectObjects(game.elementsToRaycast)
        for (var i = 0; i < intersects.length; i++) {}
      }

      listenToEvents = () => {
        this.isRaycasting = true
        renderer.domElement.addEventListener("mousemove", this.mouseMoveHandler)
        renderer.domElement.addEventListener("click", this.clickHandler)
      }

      clearEvents = () => {
        this.isRaycasting = false
        renderer.domElement.removeEventListener("mousemove", this.mouseMoveHandler)
        renderer.domElement.removeEventListener("click", this.clickHandler)
      }
    }

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
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearAlpha(0)
    $canvas.current.appendChild(renderer.domElement)

    let controls
    const game = new Game()
    updateContext("game", game)

    const animate = function(t) {
      // keeping molecules links updated
      // game molecules
      for (let i = 0; i < game.molecules.length; i++) {
        mol.setLinkCoords(
          game.molecules[i].atom1.mesh,
          game.molecules[i].atom2.mesh,
          game.molecules[i].link.mesh,
          game.molecules[i].atom1.size,
          game.molecules[i].atom2.size
        )
      }

      // scene 3 molecules
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
