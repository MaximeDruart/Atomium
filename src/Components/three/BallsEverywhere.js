import * as THREE from "three"
import Atom from "./Atom"
import Molecule from "./Molecule"

export default class Balls {
  constructor() {
    this.geometry = Atom.wfMaterial
    this.atoms = []
    this.atomInstance = new Atom({})
  }

  getAtoms = x => {
    for (let i = 0; i < x; i++) {
      let atom = this.atomInstance.getAtom()
      atom.position.set(Math.random() * 5, Math.random() * 5, Math.random() * 5)
      this.atoms.push(atom)
    }
    return this.atoms
  }
}
