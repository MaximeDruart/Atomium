import * as THREE from "three"
import SimplexNoise from "simplex-noise"

const simplex = new SimplexNoise()

// qu'est-ce donc qu'un atome jamy ?
// noyau : protons + neutrons
// autour gravite les électrons
export default class Atom {
  constructor({ scene, protons = 3, neutrons = 3, electrons = 5, atomRadius = 6, displayTrail = false }) {
    this.scene = scene
    this.protons = { count: protons, size: atomRadius / 10 }
    this.neutrons = { count: neutrons, size: atomRadius / 10 }
    this.electrons = { count: electrons, size: atomRadius / 20 }
    this.atomRadius = atomRadius
    this.coreRadius = atomRadius / 7 // 7 is a randome value
    this.geoSegments = 8

    this.protonsGeometry = new THREE.SphereGeometry(this.protons.size, this.geoSegments, this.geoSegments)
    this.neutronsGeometry = new THREE.SphereGeometry(this.neutrons.size, this.geoSegments, this.geoSegments)
    this.electronsGeometry = new THREE.SphereGeometry(this.electrons.size, this.geoSegments, this.geoSegments)
    this.atomOuterShellGeometry = new THREE.SphereGeometry(this.atomRadius, this.geoSegments, this.geoSegments)

    this.wfMaterial = new THREE.MeshStandardMaterial({ wireframe: true, color: 0x000000 })
    this.redWfMaterial = new THREE.MeshStandardMaterial({ wireframe: true, color: 0x888888 })
    this.transparentWfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      transparent: true,
      color: 0x666666,
      opacity: 0.3,
      side: THREE.DoubleSide
    })

    this.trailMaterial = new THREE.PointsMaterial({ color: 0xa6f9, size: 0.5 })
    this.displayTrail = displayTrail
  }

  static wfMaterial = new THREE.MeshStandardMaterial({
    wireframe: true,
    color: 0xa6f9
  })

  map = (n, start1, stop1, start2, stop2) => ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  ran = x => Math.random() * x - x / 2

  // this function returns an object containing the mesh for the atom and differents subgroups
  getAtom = () => {
    const atomGroup = new THREE.Group()
    const coreGroup = new THREE.Group()
    const electronsGroup = new THREE.Group()
    const electronTrailsGeometries = []
    const electronTrailsMeshes = new THREE.Group()

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
      const electronPivotPoint = new THREE.Group()
      const electron = new THREE.Mesh(this.electronsGeometry, this.wfMaterial)
      // rotating the electron to a random value
      electron.rotation.set(this.ran(Math.PI * 2), this.ran(Math.PI * 2), this.ran(Math.PI * 2))
      // then translating it (which axis doesn't matter) by radius to ensure that it always starts on the edge
      electron.translateX(this.atomRadius * 0.8)
      electronPivotPoint.add(electron)
      electronsGroup.add(electronPivotPoint)

      // let trailGeometry = new THREE.Geometry()
      // trailGeometry.vertices.push(new THREE.Vector3(electron.position.x, electron.position.y, electron.position.z))

      // electronTrailsGeometries.push(trailGeometry)
      // electronTrailsMeshes.add(new THREE.Points(trailGeometry, this.trailMaterial))
    }
    const atomOuterShell = new THREE.Mesh(this.atomOuterShellGeometry, this.transparentWfMaterial)

    atomGroup.add(coreGroup)
    atomGroup.add(electronsGroup)
    // atomGroup.add(electronTrailsMeshes)
    atomGroup.add(atomOuterShell)

    atomGroup.position.set(0, 0, 0)

    return {
      atomGroup,
      coreGroup,
      electronsGroup,
      electronTrailsGeometries,
      electronTrailsMeshes,
      atomOuterShell
    }
  }

  // executed each frame, rotates each electron around its axis in the center of the atom.
  // tried to do a trail system but i couldn't make it work :/
  animateElectrons = (time, atomGroup, elecGroup, elecTrailsGeos, elecTrailsMeshes) => {
    // rotating the whole group. it feels kinda natural if the number of electrons is small.
    elecGroup.children.forEach((pivot, index) => {
      // pivot.rotation.set(time / 160 + index * 10, time / 160 + index * 10, 0)
      pivot.rotation.set(time / 160 + index * 10, time / 240 + index * 10, time / 320 + index * 10)
    })

    // adding it a little noise to the scale to make it change more naturally
    let scale = this.map(simplex.noise2D(time / 2000, 0), -1, 1, 0.95, 1.1)
    elecGroup.scale.set(scale, scale, scale)

    if (this.displayTrail) {
      // for each electron
      // atomGroup.remove(elecTrailsMeshes)
      elecTrailsMeshes = new THREE.Group()
      elecGroup.children.forEach((electron, index) => {
        // get its real world position
        let electronPos = new THREE.Vector3().setFromMatrixPosition(electron.matrixWorld)
        // add it as point in the trail geometry

        elecTrailsGeos[index].vertices.push(electronPos)
        // !isNaN(electronPos.x) && electronPos.x !== 0 && elecTrailsGeos[index].vertices.push(electronPos)
        // elecTrailsMeshes = []
        // console.log(elecTrailsMeshes)
        // elecTrailsMeshes.children[index].geometry.dispose()
        console.log(elecTrailsGeos[index])
        elecTrailsMeshes.add(new THREE.Points(elecTrailsGeos[index], this.trailMaterial))

        // doesn't work
        // elecTrailsMeshes.children[index].geometry.dynamic = true
        // elecTrailsMeshes.children[index].geometry = elecTrailsGeos[index]
        // elecTrailsMeshes.children[index].geometry.verticesNeedUpdate = true
        console.log(elecTrailsMeshes.children[index].geometry)
      })
      atomGroup.add(elecTrailsMeshes)
    }
  }
}
