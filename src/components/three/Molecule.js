import * as THREE from "three"

export default class Molecule {
  constructor() {
    this.atomSize = 2
    this.sphereGeometry = new THREE.SphereGeometry(this.atomSize, 16, 16)
    this.wfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0xa6f9
    })
  }

  getLink = (atomSize = 5, segments = 16, mat = this.wfMaterial) =>
    new THREE.Mesh(new THREE.CylinderGeometry(atomSize / 5, atomSize / 5, 1, segments, segments, true), mat)

  setLinkCoords = (atom1, atom2, atomLink, atomSize) => {
    // atom.position is relative to the group but we need absolute positionings to calculate the distance between atoms and the lookAt vector.
    let atom1WorldPos = new THREE.Vector3().setFromMatrixPosition(atom1.matrixWorld)
    let atom2WorldPos = new THREE.Vector3().setFromMatrixPosition(atom2.matrixWorld)
    let distanceBetweenAtoms = atom1WorldPos.distanceTo(atom2WorldPos) - atomSize * 2
    // setting the link to the position of the first atom, not using worldpos as the link is in the group and thus will be placed relatively.
    atomLink.position.copy(atom1.position)
    // rotating it to look at the 2nd
    atomLink.lookAt(atom2WorldPos)
    atomLink.rotateX(Math.PI / 2)
    // translating it by half its width + the size of an atom
    atomLink.translateY(distanceBetweenAtoms / 2 + atomSize)
    // scaling it to fit to the needed distance
    atomLink.scale.y = distanceBetweenAtoms
  }

  createMolecule = (...atoms) => {}
}
