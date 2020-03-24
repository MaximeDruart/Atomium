import * as THREE from "three"
import SimplexNoise from "simplex-noise"

const simplex = new SimplexNoise()

// qu'est-ce donc qu'un atome jamy ?
// noyau : protons + neutrons
// autour gravite les électrons
export default class Atom {
  constructor({ protons = 3, neutrons = 3, electrons = 3, atomRadius = 6 }) {
    this.protons = {
      count: protons,
      size: 0.6
    }
    this.neutrons = {
      count: neutrons,
      size: 0.6
    }
    this.electrons = {
      count: electrons,
      size: 0.5
    }
    this.atomRadius = atomRadius
    // 7 is a randome value
    this.coreRadius = atomRadius / 7
    this.geoSegments = 16

    this.protonsGeometry = new THREE.SphereGeometry(this.protons.size, this.geoSegments, this.geoSegments)
    this.neutronsGeometry = new THREE.SphereGeometry(this.neutrons.size, this.geoSegments, this.geoSegments)
    this.electronsGeometry = new THREE.SphereGeometry(this.electrons.size, this.geoSegments, this.geoSegments)
    this.atomOuterShellGeometry = new THREE.SphereGeometry(this.atomRadius, this.geoSegments, this.geoSegments)

    this.wfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0xa6f9
    })

    this.redWfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0xff0000
    })

    this.transparentWfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      transparent: true,
      color: 0xa6f9,
      opacity: 0.1,
      side: THREE.DoubleSide
    })

    this.trailMaterial = new THREE.PointsMaterial({ color: 0xa6f9 })

    this.displayTrail = true
  }

  static wfMaterial = new THREE.MeshStandardMaterial({
    wireframe: true,
    color: 0xa6f9
  })

  map = (n, start1, stop1, start2, stop2) => ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  ran = x => Math.random() * x - x / 2

  getAtom = () => {
    const atomGroup = new THREE.Group()
    const coreGroup = new THREE.Group()
    const electronsGroup = new THREE.Group()
    const electronTrailsGeometries = []

    for (let i = 0; i < this.protons.count; i++) {
      const proton = new THREE.Mesh(this.protonsGeometry, this.redWfMaterial)
      proton.rotation.set(this.ran(Math.PI * 2), this.ran(Math.PI * 2), this.ran(Math.PI * 2))
      proton.translateX(this.coreRadius * 0.8)

      coreGroup.add(proton)
    }

    for (let i = 0; i < this.neutrons.count; i++) {
      const neutron = new THREE.Mesh(this.neutronsGeometry, this.wfMaterial)
      neutron.rotation.set(this.ran(Math.PI * 2), this.ran(Math.PI * 2), this.ran(Math.PI * 2))
      neutron.translateX(this.coreRadius * 0.8)

      coreGroup.add(neutron)
    }

    for (let i = 0; i < this.electrons.count; i++) {
      const electron = new THREE.Mesh(this.electronsGeometry, this.wfMaterial)
      // rotating the electron to a random value
      electron.rotation.set(this.ran(Math.PI * 2), this.ran(Math.PI * 2), this.ran(Math.PI * 2))
      // then translating it (which axis doesn't matter) by radius to ensure that it always starts on the edge
      electron.translateX(this.atomRadius * 0.8)
      electronsGroup.add(electron)
      let trailGeometry = new THREE.Geometry()
      trailGeometry.vertices.push(new THREE.Vector3(electron.position.x, electron.position.y, electron.position.z))
      electronTrailsGeometries.push(trailGeometry)
    }
    const atomOuterShell = new THREE.Mesh(this.atomOuterShellGeometry, this.transparentWfMaterial)

    atomGroup.add(coreGroup)
    atomGroup.add(electronsGroup)
    atomGroup.add(atomOuterShell)

    atomGroup.position.set(0, 0, 0)

    console.log("creating atom !")
    return {
      atomGroup,
      coreGroup,
      electronsGroup,
      electronTrailsGeometries,
      atomOuterShell
    }
  }

  animateElectrons = (time, elecGroup) => {
    // rotating the whole group. it feels kinda natural if the number of electrons is small.
    elecGroup.rotation.set(time / 160, time / 240, time / 320)
    // adding it a little noise to the scale to make it change more naturally
    let scale = this.map(simplex.noise2D(time / 2000, 0), -1, 1, 0.95, 1.1)
    elecGroup.scale.set(scale, scale, scale)
  }
}
