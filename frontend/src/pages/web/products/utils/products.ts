import uniformeDeportivo from "../assets/conjunto-removebg-preview.png"
import pantalongris from "../assets/pantalongris2-removebg-preview.png"
import cbtaUniforme from "../assets/cbta-removebg-preview.png"
import escolta from "../assets/uniformes-escolta-removebg-preview.png"
import careta from "../assets/orimaria-img.png"
import deportivaroja from "../assets/deportiva-removebg-preview.png"
import shortsnegros from "../assets/shortsnegros-removebg-preview.png"
import calcetasAzul from "../assets/calceta-azul-marino-removebg-preview.png"
import chaquetaAzul from "../assets/chaquetaazul.png"
import polo3 from "../assets/polo-3-removebg-preview.png"
import sudare from "../assets/sudadera-removebg-preview.png"
import gorraNaranja from "../assets/gorranaranja-removebg-preview.png"
import casualRojo from "../assets/casualrojo.png"
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  color: string;
  size: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Uniforme Deportivo Azul",
    price: 299,
    image: uniformeDeportivo,
    category: "Uniformes Deportivos",
    color: "#3B82F6",
    size: "M",
  },
  {
    id: 2,
    name: "Uniforme CBTA femenino",
    price: 349,
    image: cbtaUniforme,
    category: "Uniformes Escolares",
    color: "#FFFFFF",
    size: "L",
  },
  {
    id: 3,
    name: "Camiseta Deportiva Roja",
    price: 199,
    image:deportivaroja,
    category: "Uniformes Deportivos",
    color: "#EF4444",
    size: "S",
  },
  {
    id: 4,
    name: "Pantalón Escolar Gris",
    price: 249,
    image: pantalongris,
    category: "Uniformes Escolares",
    color: "#6B7280",
    size: "M",
  },
  {
    id: 5,
    name: "Shorts Deportivos Negros",
    price: 179,
    image: shortsnegros,
    category: "Uniformes Deportivos",
    color: "#111827",
    size: "L",
  },
  {
    id: 6,
    name: "Uniforme de escolta",
    price: 229,
    image: escolta,
    category: "Uniformes Escolares",
    color: "#111827",
    size: "S",
  },
  {
    id: 7,
    name: "Chaqueta Deportiva",
    price: 399,
    image: chaquetaAzul,
    category: "Uniformes Deportivos",
    color: "#3B82F6",
    size: "XL",
  },
  {
    id: 8,
    name: "Calcetas negras",
    price: 59,
    image: calcetasAzul,
    category: "Calcetas",
    color: "#111827",
    size: "M",
  },
  {
    id: 9,
    name: "Polo Secundaria 3",
    price: 189,
    image: polo3,
    category: "Polos",
    color: "#10B981",
    size: "L",
  },
  {
    id: 10,
    name: "Sudadera con Capucha",
    price: 329,
    image: sudare,
    category: "Uniformes Deportivos",
    color: "#111827",
    size: "XL",
  },
  {
    id: 11,
    name: "Gorra Deportiva",
    price: 89,
    image: gorraNaranja,
    category: "Gorras",
    color: "#F59E0B",
    size: "M",
  },
  {
    id: 12,
    name: "Playera Casual",
    price: 149,
    image: casualRojo,
    category: "Playeras",
    color: "#EF4444",
    size: "S",
  },
  {
    id: 6,
    name: "Uniforme Fausta Careta",
    price: 229,
    image: careta,
    category: "Uniformes Escolares",
    color: "#111827",
    size: "S",
  },
];
