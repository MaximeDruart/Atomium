import Molecule from "../three/Molecule"
import * as THREE from "three"
const mol = new Molecule()

export default [
  {
    name: "Dioxygene O²",
    descriptions: [
      "Le dioxygène ou oxygène moléculaire est la forme de l'oxygène trouvé dans l'air. C'est une molécule constituée par l'assemblage de deux atomes d'oxygène et a donc la formule O2.",

      "Le dioxygène est simplement appelé oxygène dans la vie de tous les jours. Il est apporté aux globules rouges par les poumons au cours de la respiration (inspiration). L'hémoglobine contenue dans les globules rouges est la protéine qui permet cela. Quand on manque d'hémoglobine, on est anémié, on souffre d'anémie.",

      "Au cours de la respiration cellulaire, la molécule de dioxygène sert à brûler les nutriments, et les transforme en molécules de dioxyde de carbone et d'eau durant la dernière étape du processus. De nombreux êtres vivants sont incapables de vivre sans le gaz dioxygène. Seules les plantes sont capables d'en produire : c'est le phénomène de photosynthèse. Il est le comburant obligatoire lors d'une combustion car il est le seul gaz de l'air qui permet les combustions."
    ],
    molecule: mol.getMolecule(
      [
        { size: 3, position: new THREE.Vector3(3, 0, 0) },
        { size: 3, position: new THREE.Vector3(-4, 1, -3) }
      ],
      [{ origin: 0, end: 1 }]
    )
  },
  {
    name: "Dioxyde de carbone CO2",
    descriptions: [
      "Le dioxyde de carbone, parfois appelé gaz carbonique, est un gaz dont la molécule est formée d'un atome de carbone et de deux atomes d'oxygène. Sa formule est CO2.",

      "Il est créé lors de la combustion de produits contenant du carbone, c'est-à-dire par exemple le bois, le charbon, le sucre (source d'énergie chez les êtres vivants), mais aussi le pétrole (pour les véhicules). Du dioxyde de carbone est aussi produit par le raisin lors de la fermentation qui donnera le vin.Ce gaz joue un rôle important dans l'effet de serre qui permet de garder la Terre chaude mais son augmentation provoque le réchauffement climatique.",

      "À partir de dioxyde de carbone et d'eau, les plantes et les algues qui contiennent de la chlorophylle sont capables de produire des sucres ou glucides.Les animaux, au contraire, mangent du sucre et le transforment en dioxyde de carbone et eau. Ces deux étapes font partie du cycle du carbone et du cycle de l'eau."
    ],
    molecule: mol.getMolecule(
      [
        { size: 2.6, position: new THREE.Vector3(5, -2, 2) },
        { size: 2, position: new THREE.Vector3(-6, 1, -3) },
        { size: 2, position: new THREE.Vector3(-1, -3, 6) }
      ],
      [
        { origin: 0, end: 1 },
        { origin: 0, end: 2 }
      ]
    )
  },
  {
    name: "Eau H20",
    descriptions: [
      "La molécule d'eau a pour formule H2O, c'est-à-dire qu'elle est composée d'un atome d'oxygène et de deux atomes d'hydrogène. Si on veut parler de deux molécules d’eau, on écrit alors 2H2O.",

      "L'eau est l'élément liquide le plus répandu sur la surface de la Terre. Elle est indispensable à toute forme de vie sur la planète. L'homme est composé à 65 % d'eau, les plantes à plus de 85 %. L'homme doit boire au moins 1.5 litres d'eau par jour, le reste est contenu dans les aliments.",

      "L'eau existe sous les trois états physiques : Solide, on l'appelle glace. Cette transformation s'opère lorsque l'eau liquide baisse en dessous de 0 °C. Liquide, on l'appelle simplement eau. Et gazeux, on l'appelle vapeur. Lorsque l'eau atteint une température de 100 °C, celle-ci se met à bouillir et se transforme en vapeur d'eau."
    ],
    molecule: mol.getMolecule(
      [
        { size: 3, position: new THREE.Vector3(-7, 4, -1) },
        { size: 2.1, position: new THREE.Vector3(5, -3, -2) },
        { size: 2.1, position: new THREE.Vector3(-1, -3, 6) }
      ],
      [
        { origin: 0, end: 1 },
        { origin: 0, end: 2 }
      ]
    )
  },
  {
    name: "Méthane CH4",
    descriptions: [
      "Le méthane est une molécule composée d'un atome de carbone et de quatre atomes d'hydrogène : sa formule brute est donc CH4.",

      "C'est un composé organique, produit par les êtres vivants et le processus de fermentation.Dans les conditions habituelles, c'est un gaz. Il peut être mis sous forme liquide à très basse température ou sous forte pression pour être stocké ou transporté.",

      "Le méthane est un gaz à effet de serre à l'impact vingt fois plus puissant que celui du dioxyde de carbone sur la planète.Il est le composant très majoritaire du grisou, redouté pour ses explosions dans les mines.Le méthane présent dans les roches profondes (gisement) est exploité comme énergie appelée gaz naturel. C'est alors une énergie fossile.Le méthane peut aussi être produit par la fermentation de déchets dans des digesteurs : la méthanisation. Dans ce cas, c'est une énergie renouvelable."
    ],
    molecule: mol.getMolecule(
      [
        { size: 2.5, position: new THREE.Vector3(0, 0, 0) },
        { size: 1.3, position: new THREE.Vector3(-6, 1, -1) },
        { size: 1.3, position: new THREE.Vector3(7, -2, 1) },
        { size: 1.3, position: new THREE.Vector3(-3, -7, 1) },
        { size: 1.3, position: new THREE.Vector3(2, 5, -1) }
      ],
      [
        { origin: 0, end: 1 },
        { origin: 0, end: 2 },
        { origin: 0, end: 3 },
        { origin: 0, end: 4 }
      ]
    )
  },
  {
    name: "L'éthanol",
    descriptions: [
      "L'éthanol, ou alcool éthylique Écouter (ou plus simplement alcool), est un alcool de formule semi-développée CH3-CH2-OH",

      "C'est un psychotrope, et l'une des plus anciennes drogues récréatives, sous la forme de boisson alcoolisée.",

      "L'éthanol est utilisé par l'industrie agroalimentaire (pour la production de spiritueux notamment), la parfumerie et la pharmacie galénique (comme solvant) ainsi qu'en biocarburant (bioéthanol). Il est en outre utilisé dans les thermomètres à alcool."
    ],
    molecule: mol.getMolecule(
      [
        { size: 2.5, position: new THREE.Vector3(4, 0, 0)}, // atome centrale
        { size: 2.5, position:new THREE.Vector3(-2, 1, -1)}, // atome a droite
        { size: 1.5, position:new THREE.Vector3(11, 5, 3)}, // atoem gauche
        { size: 1.5, position:new THREE.Vector3(8, -5, -3)},
        { size: 1.5, position:new THREE.Vector3(6, 2, -7)}, // atome 2
        { size: 2.5, position:new THREE.Vector3(-8, 7, 1)},
        { size: 1.5, position:new THREE.Vector3( -7, -3, 2)}, // fond droit
        { size: 1.5, position:new THREE.Vector3( -7, -1, -6)},// proche droit
        { size: 1.5, position:new THREE.Vector3( -13, 8, 1)}


      ],
      [
        {origin: 0, end:1},
        {origin: 0,end: 2},
        {origin: 0,end: 3},
        {origin: 0,end: 4},
        {origin: 1,end: 5},
        {origin: 1,end: 6},
        {origin: 1,end: 7},
        {origin: 5,end: 8},
      ]
    )
  },
]
