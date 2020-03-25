// keeping molecules updated
molecules.forEach(molecule => {
  molecule.links.forEach(link => {
    mol.setLinkCoords(molecule.atoms[link.origin], molecule.atoms[link.end], link.mesh, mol.atomSize)
  })
})
