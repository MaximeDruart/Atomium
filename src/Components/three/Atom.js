import * as THREE from "three"
import SimplexNoise from "simplex-noise"

const simplex = new SimplexNoise()

// qu'est-ce donc qu'un atome jamy ?
// noyau : protons + neutrons
// autour gravite les électrons
export default class Atom {
  constructor({ protons = 1, neutrons = 1, electrons = 5, atomRadius = 6.5 }) {
    this.protons = {
      count: protons,
      size: 1
    }
    this.neutrons = {
      count: neutrons,
      size: 2
    }
    this.electrons = {
      count: electrons,
      size: 0.5
    }
    this.atomRadius = atomRadius
    this.geoSegments = 16
    this.atomGroup = new THREE.Group()
    this.coreGroup = new THREE.Group()
    this.electronsGroup = new THREE.Group()
    this.wfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0xa6f9
    })

    this.init()
    this.atomGroup.position.set(0, 0, 0)
  }

  map = (n, start1, stop1, start2, stop2) => ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2

  init = () => {
    const protonsGeometry = new THREE.SphereGeometry(this.protons.size, this.geoSegments, this.geoSegments)
    const neutronsGeometry = new THREE.SphereGeometry(this.neutrons.size, this.geoSegments, this.geoSegments)
    const electronsGeometry = new THREE.SphereGeometry(this.electrons.size, this.geoSegments, this.geoSegments)
    const ran = x => Math.random() * x - x / 2

    for (let i = 0; i < this.protons.count; i++) {
      const proton = new THREE.Mesh(protonsGeometry, this.wfMaterial)
      this.coreGroup.add(proton)
    }
    for (let i = 0; i < this.neutrons.count; i++) {
      const neutron = new THREE.Mesh(neutronsGeometry, this.wfMaterial)
      this.coreGroup.add(neutron)
    }
    for (let i = 0; i < this.electrons.count; i++) {
      const electron = new THREE.Mesh(electronsGeometry, this.wfMaterial)
      // rotating the electron to a random value
      electron.rotation.set(ran(Math.PI * 2), ran(Math.PI * 2), ran(Math.PI) * 2)
      // then translating it (axis doesn't matter) by radius to ensure that it always starts on the edge
      electron.translateX(this.atomRadius * 0.8)
      this.electronsGroup.add(electron)
    }

    this.atomGroup.add(this.coreGroup)
    this.atomGroup.add(this.electronsGroup)

    const atomOuterShell = new THREE.Mesh(
      new THREE.SphereGeometry(this.atomRadius, this.geoSegments, this.geoSegments),
      this.wfMaterial
    )
    this.atomGroup.add(atomOuterShell)
  }

  animateElectrons = time => {
    // rotating the whole group. feels natural if the number of electrons is small.
    this.electronsGroup.rotation.set(time / 160, time / 240, time / 320)
    // adding it a little noise to the scale to make it change more naturally
    let scale = this.map(simplex.noise2D(time / 2000, 0), -1, 1, 0.95, 1.1)
    this.electronsGroup.scale.set(scale, scale, scale)
  }

  get group() {
    return this.atomGroup
  }
}
