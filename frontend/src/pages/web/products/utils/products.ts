import uniformeDeportivo from "../assets/conjunto-removebg-preview.png";
import pantalongris from "../assets/pantalongris2-removebg-preview.png";
import cbtaUniforme from "../assets/cbta-removebg-preview.png";
import escolta from "../assets/uniformes-escolta-removebg-preview.png";
import careta from "../assets/orimaria-img.png";
import deportivaroja from "../assets/deportiva-removebg-preview.png";
import shortsnegros from "../assets/shortsnegros-removebg-preview.png";
import calcetasAzul from "../assets/calceta-azul-marino-removebg-preview.png";
import chaquetaAzul from "../assets/chaquetaazul.png";
import polo3 from "../assets/polo-3-removebg-preview.png";
import sudare from "../assets/sudadera-removebg-preview.png";
import gorraNaranja from "../assets/gorranaranja-removebg-preview.png";
import casualRojo from "../assets/casualrojo.png";
import poloAzul from "../assets/polo_azul-removebg-preview.png";
import playerarosa from "../assets/mujer-rosa.png";
import calcetas from "../assets/calcetas-grises.png";
import espinilleras from "../assets/espinnilleras-grises.png";
import gorraUnisex from "../assets/gorraunisex.png";
import uniformeEscolar from "../assets/uniformeescolarhombre.png";
import playeraDeportivaMujer from "../assets/deportivomujer.png";
import poloverde from "../assets/poloverde.png";
import playerarosamen from "../assets/playerarosamen.png";
import clacetasBlancasMujer from "../assets/calcetas-blancas.png";
import espinillerasGris from "../assets/espinilleras.png";
import gorraMujer from "../assets/gorramujer.png";
import pantalon from "../assets/pantalon.png";
import playeraDeportiva from "../assets/playeradeportiva.png";
enum categories {
  Uniformesescolares = "uniformes-escolares",
  Deportivos = "Deportivos",
  Pantalones = "Pantalones",
  Gorras = "Gorras",
  Polo = "Polo",
  Playeras = "Playeras",
  Calcetas = "Calcetas",
  short = "Shorts",
  Espinilleras = "Espinilleras"
}

export enum Colors {
  Red = "#FF0000",
  White = "#FFFFFF",
  Green = "#008000",
  Orange = "#FFA500",
  Gray = "#808080",
  Pink = "#FFC0CB",
  Black = "#000000",
  Purple = "#800080",
  Blue = "#3B82F6"
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: categories;
  color: Colors;
  size: string;
  sex: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Uniforme Deportivo Azul",
    price: 299,
    image: uniformeDeportivo,
    category: categories.Deportivos,
    color: Colors.Blue, // Azul
    size: "M",
    sex: "Hombre",
  },
  {
    id: 2,
    name: "Uniforme CBTA femenino",
    price: 349,
    image: cbtaUniforme,
    category: categories.Uniformesescolares,
    color: Colors.White, // Blanco
    size: "L",
    sex: "Mujer",
  },
  {
    id: 3,
    name: "Camiseta Deportiva Roja",
    price: 199,
    image: deportivaroja,
    category: categories.Deportivos,
    color: Colors.Red, // Rojo
    size: "S",
    sex: "Hombre",
  },
  {
    id: 4,
    name: "Pantalón Escolar Gris",
    price: 249,
    image: pantalongris,
    category: categories.Uniformesescolares,
    color: Colors.Gray, // Gris
    size: "M",
    sex: "Hombre",
  },
  {
    id: 5,
    name: "Shorts Deportivos Negros",
    price: 179,
    image: shortsnegros,
    category: categories.short,
    color: Colors.Black, // Negro
    size: "L",
    sex: "Hombre",
  },
  {
    id: 6,
    name: "Uniforme de escolta",
    price: 229,
    image: escolta,
    category: categories.Uniformesescolares,
    color: Colors.Black, // Negro
    size: "S",
    sex: "Unisex",
  },
  {
    id: 7,
    name: "Chaqueta Deportiva",
    price: 399,
    image: chaquetaAzul,
    category: categories.Deportivos,
    color: Colors.Blue, // Azul
    size: "XL",
    sex: "Hombre",
  },
  {
    id: 8,
    name: "Calcetas negras",
    price: 59,
    image: calcetasAzul,
    category: categories.Calcetas,
    color: Colors.Black, // Negro
    size: "M",
    sex: "Unisex",
  },
  {
    id: 9,
    name: "Polo Secundaria 3",
    price: 189,
    image: polo3,
    category: categories.Polo,
    color: Colors.Green, // Verde
    size: "L",
    sex: "Hombre",
  },
  {
    id: 10,
    name: "Sudadera con Capucha",
    price: 329,
    image: sudare,
    category: categories.Deportivos,
    color: Colors.Black, // Negro
    size: "XL",
    sex: "Hombre",
  },
  {
    id: 11,
    name: "Gorra Deportiva",
    price: 89,
    image: gorraNaranja,
    category: categories.Gorras,
    color: Colors.Orange, // Naranja
    size: "M",
    sex: "Unisex",
  },
  {
    id: 12,
    name: "Playera Casual",
    price: 149,
    image: casualRojo,
    category: categories.Playeras,
    color: Colors.Red, // Rojo
    size: "S",
    sex: "Hombre",
  },
  {
    id: 13,
    name: "Uniforme Fausta Careta",
    price: 229,
    image: careta,
    category: categories.Uniformesescolares,
    color: Colors.Black, // Negro
    size: "S",
    sex: "Unisex",
  },
  {
    id: 14,
    name: "Polo Casual Hombre",
    price: 199,
    image: poloAzul,
    category: categories.Polo,
    color: Colors.Blue, // Azul intenso
    size: "M",
    sex: "Hombre",
  },
  {
    id: 15,
    name: "Playera Básica Mujer",
    price: 149,
    image: playerarosa,
    category: categories.Playeras,
    color: Colors.Pink, // Rosa claro
    size: "S",
    sex: "Mujer",
  },
  {
    id: 16,
    name: "Calcetas  Hombre",
    price: 69,
    image: calcetas,
    category: categories.Calcetas,
    color: Colors.Gray, // Gris oscuro
    size: "L",
    sex: "Hombre",
  },
  {
    id: 17,
    name: "Espinilleras Pro",
    price: 299,
    image: espinilleras,
    category: categories.Espinilleras,
    color: Colors.Gray, // Gris medio
    size: "M",
    sex: "Unisex",
  },
  {
    id: 18,
    name: "Gorra Unisex",
    price: 99,
    image: gorraUnisex,
    category: categories.Gorras,
    color: Colors.Orange, // Naranja oscuro
    size: "M",
    sex: "Unisex",
  },
  {
    id: 19,
    name: "Uniforme Escolar Primaria Hombre",
    price: 349,
    image: uniformeEscolar,
    category: categories.Uniformesescolares,
    color: Colors.White, // Blanco/gris claro
    size: "L",
    sex: "Hombre",
  },
  {
    id: 20,
    name: "Playera Deportiva Mujer",
    price: 329,
    image: playeraDeportivaMujer,
    category: categories.Deportivos,
    color: Colors.Blue, // Azul claro
    size: "M",
    sex: "Mujer",
  },
  {
    id: 21,
    name: "Polo verde",
    price: 209,
    image: poloverde,
    category: categories.Polo,
    color: Colors.Green, // Verde menta
    size: "S",
    sex: "Hombre",
  },
  {
    id: 22,
    name: "Playera Casual Hombre",
    price: 159,
    image: playerarosamen,
    category: categories.Playeras,
    color: Colors.Pink, // Rosa claro
    size: "L",
    sex: "Hombre",
  },
  {
    id: 23,
    name: "Calcetas Escolares Mujer",
    price: 49,
    image: clacetasBlancasMujer,
    category: categories.Calcetas,
    color: Colors.White, // blancas
    size: "S",
    sex: "Mujer",
  },
  {
    id: 24,
    name: "Espinilleras Clásicas Hombre",
    price: 199,
    image: espinillerasGris,
    category: categories.Espinilleras,
    color: Colors.Gray, // Gris
    size: "L",
    sex: "Hombre",
  },
  {
    id: 25,
    name: "Gorra Casual Mujer",
    price: 89,
    image: gorraMujer,
    category: categories.Gorras,
    color: Colors.Black, // negro
    size: "S",
    sex: "Mujer",
  },
  {
    id: 26,
    name: "Pantalón azul marino",
    price: 389,
    image: pantalon,
    category: categories.Pantalones,
    color:Colors.Blue, // azul marino
    size: "M",
    sex: "Mujer",
  },
  {
    id: 27,
    name: "Playera deportiva",
    price: 309,
    image: playeraDeportiva,
    category: categories.Deportivos,
    color: Colors.Blue, // Azul
    size: "XL",
    sex: "Hombre",
  },
];
