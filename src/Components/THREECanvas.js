import * as THREE from "three"
import React, { useContext, useEffect, useRef } from "react"
import { Context } from "../Context"

const THREECanvas = () => {
  const { updateContext, ...context } = useContext(Context)
  const $canvas = useRef(null)

  useEffect(() => {
    var scene = new THREE.Scene()

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    var renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearAlpha(0)
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
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
  }, [])

  return <div className="canvasContainer" ref={$canvas}></div>
}

export default THREECanvas
