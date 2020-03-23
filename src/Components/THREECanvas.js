import * as THREE from "three"
import React, { useContext, useEffect, useRef } from "react"
import { Context } from "../Context"

const THREECanvas = () => {
  const { updateContext, ...context } = useContext(Context)
  const $canvas = useRef(null)

  // threejs scene
  useEffect(() => {
    var scene = new THREE.Scene()

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    var renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearAlpha(0)

    $canvas.current.appendChild(renderer.domElement)

    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    var cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 5

    var animate = function() {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
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
