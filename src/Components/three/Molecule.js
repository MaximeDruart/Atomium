import * as THREE from "three"

export default class Molecule {
  constructor() {
    this.atomSize = 5
    this.sphereGeometry = new THREE.SphereGeometry(this.atomSize, 16, 16)
    this.wfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0xa6f9
    })
  }

  getLink = (atomSize = 5, segments = 16, mat = this.wfMaterial) =>
    new THREE.Mesh(new THREE.CylinderGeometry(atomSize / 5, atomSize / 5, 1, segments, segments, true), mat)

  setLinkCoords = (atom1, atom2, atomLink, atomSize) => {
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

  createMolecule = (...atoms) => {}
}
