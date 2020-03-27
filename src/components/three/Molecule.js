import * as THREE from "three"

export default class Molecule {
  constructor(atomSize = 2) {
    this.atomSize = atomSize
    this.wfMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0x666666
    })
  }

  // this function takes an array of atoms ( each atom containing position, color and size data) and an array of links ( each containing the mesh and indexes of the 2 atoms that it links.) and returns an object containing the mesh, atoms and links separated for animation.
  getMolecule = (atomsArray, linksArray) => {
    const group = new THREE.Group()
    const atoms = atomsArray.map(atom => {
      const atomMesh = new THREE.Mesh(
        new THREE.SphereGeometry(atom.size, 8, 8),
        new THREE.MeshStandardMaterial({ wireframe: true, color: atom.color || 0x666666 })
      )
      atomMesh.position.set(atom.position.x, atom.position.y, atom.position.z)
      group.add(atomMesh)
      return { mesh: atomMesh, size: atom.size || this.atomSize }
    })
    const links = linksArray.map(link => {
      const linkMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(this.atomSize / 5, this.atomSize / 5, 1, 8, 8, true),
        this.wfMaterial
      )
      group.add(linkMesh)
      return {
        origin: link.origin,
        end: link.end,
        mesh: linkMesh
      }
    })

    return { group, atoms, links }
  }

  // this function updates a link to match its two atoms parents.
  setLinkCoords = (atom1, atom2, atomLink, atomSize1, atomSize2) => {
    // atom.position is relative to the group but we need absolute positionings to calculate the distance between atoms and the lookAt vector.
    let atom1WorldPos = new THREE.Vector3().setFromMatrixPosition(atom1.matrixWorld)
    let atom2WorldPos = new THREE.Vector3().setFromMatrixPosition(atom2.matrixWorld)
    let distanceBetweenAtoms = atom1WorldPos.distanceTo(atom2WorldPos) - (atomSize1 + atomSize2)
    // setting the link to the position of the first atom, not using worldpos as the link is in the group and thus will be placed relatively.
    atomLink.position.copy(atom1.position)
    // rotating it to look at the 2nd
    atomLink.lookAt(atom2WorldPos)
    atomLink.rotateX(Math.PI / 2)
    // translating it by half its width + the size of an atom
    atomLink.translateY(distanceBetweenAtoms / 2 + atomSize1)
    // scaling it to fit to the needed distance
    atomLink.scale.y = distanceBetweenAtoms
  }
}
