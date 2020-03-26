import * as THREE from "three"

export default class Molecule {
  constructor(atomSize = 2) {
    this.atomSize = atomSize
    this.sphereGeometry = new THREE.SphereGeometry(this.atomSize, 8, 8)
    this.wfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0x666666
    })
  }

  getMolecule = (atomsArray, linksArray) => {
    const group = new THREE.Group()
    const atoms = atomsArray.map(atom => {
      // error handling for previous version where atom wasn't an object
      const atomMesh = atom.size ? this.getAtom(atom.size, atom.position) : this.getAtom(this.atomSize, atom)
      group.add(atomMesh)
      return atomMesh
    })
    const links = linksArray.map(link => {
      const linkMesh = this.getLink(this.atomSize)
      group.add(linkMesh)
      return {
        origin: link.origin,
        end: link.end,
        mesh: linkMesh
      }
    })

    return {
      // id : THREE.
      group,
      atoms,
      links
    }
  }

  getLink = (atomSize = 2, segments = 8, mat = this.wfMaterial) =>
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

  getAtom = (size = 2, { x, y, z }) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), this.wfMaterial)
    mesh.position.set(x, y, z)
    return mesh
  }
}
