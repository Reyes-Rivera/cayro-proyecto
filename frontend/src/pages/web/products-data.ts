// Datos de productos importados del JSON proporcionado
const productsData = [
  {
    id: 1,
    name: "POLO HOMBRE",
    description:
      "Esta polo hombre es la elección perfecta para un look fresco y relajado. Su diseño de cuello redondo y corte clásico permite un ajuste cómodo sin perder estilo. Fabricada con telas suaves y transpirables, es ideal para cualquier temporada. Su colores vivos, combinando fácilmente con otras prendas para lograr un outfit moderno y dinámico.",
    active: true,
    createdAt: "2025-03-20T05:24:45.653Z",
    updatedAt: "2025-03-20T05:24:45.653Z",
    brandId: 1,
    genderId: 1,
    sleeveId: 1,
    categoryId: 1,
    variants: [
      {
        id: 1,
        productId: 1,
        colorId: 10,
        sizeId: 2,
        price: 150,
        stock: 10,
        barcode: "POLO-HOMBRE-ROJO-VINO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448029/POLO-ROJO_VINO_TINTO_nf1qsu.png",
        color: {
          id: 10,
          name: "Rojo vino",
          hexValue: "#800020",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 2,
        productId: 1,
        colorId: 10,
        sizeId: 4,
        price: 190,
        stock: 9,
        barcode: "POLO-HOMBRE-ROJO-VINO-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448029/POLO-ROJO_VINO_TINTO_nf1qsu.png",
        color: {
          id: 10,
          name: "Rojo vino",
          hexValue: "#800020",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
      {
        id: 3,
        productId: 1,
        colorId: 10,
        sizeId: 3,
        price: 120,
        stock: 8,
        barcode: "POLO-HOMBRE-ROJO-VINO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448029/POLO-ROJO_VINO_TINTO_nf1qsu.png",
        color: {
          id: 10,
          name: "Rojo vino",
          hexValue: "#800020",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 4,
        productId: 1,
        colorId: 9,
        sizeId: 2,
        price: 120,
        stock: 6,
        barcode: "POLO-HOMBRE-GRIS-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448114/POLO-GRIS_NUBE_tjztwj.png",
        color: {
          id: 9,
          name: "Gris",
          hexValue: "#61687a",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 5,
        productId: 1,
        colorId: 3,
        sizeId: 5,
        price: 300,
        stock: 5,
        barcode: "POLO-HOMBRE-BLANCO-XG",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448181/POLO-GRIS_PERLA_z6qrrk.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 5,
          name: "XG",
        },
      },
      {
        id: 6,
        productId: 1,
        colorId: 3,
        sizeId: 3,
        price: 280,
        stock: 3,
        barcode: "POLO-HOMBRE-BLANCO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448181/POLO-GRIS_PERLA_z6qrrk.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 7,
        productId: 1,
        colorId: 8,
        sizeId: 2,
        price: 280,
        stock: 5,
        barcode: "POLO-HOMBRE-AZUL-MARINO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448227/POLO-AZUL_NOCHE_x6sdgy.png",
        color: {
          id: 8,
          name: "Azul marino",
          hexValue: "#1b253f",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 8,
        productId: 1,
        colorId: 8,
        sizeId: 3,
        price: 270,
        stock: 3,
        barcode: "POLO-HOMBRE-AZUL-MARINO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448227/POLO-AZUL_NOCHE_x6sdgy.png",
        color: {
          id: 8,
          name: "Azul marino",
          hexValue: "#1b253f",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 9,
        productId: 1,
        colorId: 5,
        sizeId: 3,
        price: 280,
        stock: 3,
        barcode: "POLO-HOMBRE-AZUL-CIELO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448274/POLO-_AZUL_VIBRANTE_xttwnl.png",
        color: {
          id: 5,
          name: "Azul cielo",
          hexValue: "#1e90ff",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 1,
      name: "Hombre",
    },
    sleeve: {
      id: 1,
      name: "Tipo polo",
    },
    category: {
      id: 1,
      name: "Polo",
    },
  },
  {
    id: 2,
    name: "POLO ACANALADO MUJER",
    description:
      "Esta polo acanalado mujer es la elección perfecta para un look fresco y relajado. Su diseño de cuello redondo y corte clásico permite un ajuste cómodo sin perder estilo. Fabricada con telas suaves y transpirables, es ideal para cualquier temporada. Su tono #221c1a aporta versatilidad, combinando fácilmente con otras prendas para lograr un outfit moderno y dinámico.",
    active: true,
    createdAt: "2025-03-20T05:31:25.204Z",
    updatedAt: "2025-03-20T05:31:25.204Z",
    brandId: 1,
    genderId: 2,
    sleeveId: 1,
    categoryId: 1,
    variants: [
      {
        id: 10,
        productId: 2,
        colorId: 11,
        sizeId: 2,
        price: 270,
        stock: 5,
        barcode: "POLO-ACANALADO-MUJER-NEGRO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448582/POLO_ACANALADO-NEGRO_INTENSO_pkahiv.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 11,
        productId: 2,
        colorId: 11,
        sizeId: 3,
        price: 280,
        stock: 3,
        barcode: "POLO-ACANALADO-MUJER-NEGRO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448582/POLO_ACANALADO-NEGRO_INTENSO_pkahiv.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 12,
        productId: 2,
        colorId: 3,
        sizeId: 4,
        price: 290,
        stock: 5,
        barcode: "POLO-ACANALADO-MUJER-BLANCO-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448627/POLO_ACANALADO-BLANCO_HELADO_iwjlqe.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
      {
        id: 13,
        productId: 2,
        colorId: 3,
        sizeId: 2,
        price: 270,
        stock: 3,
        barcode: "POLO-ACANALADO-MUJER-BLANCO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448627/POLO_ACANALADO-BLANCO_HELADO_iwjlqe.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 14,
        productId: 2,
        colorId: 3,
        sizeId: 1,
        price: 260,
        stock: 5,
        barcode: "POLO-ACANALADO-MUJER-BLANCO-XCH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448627/POLO_ACANALADO-BLANCO_HELADO_iwjlqe.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 1,
          name: "XCH",
        },
      },
      {
        id: 15,
        productId: 2,
        colorId: 5,
        sizeId: 4,
        price: 280,
        stock: 5,
        barcode: "POLO-ACANALADO-MUJER-AZUL-CIELO-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448664/POLO_ACANALADO-AZUL_CIELO_TENUE_pod8rx.png",
        color: {
          id: 5,
          name: "Azul cielo",
          hexValue: "#1e90ff",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 2,
      name: "Mujer",
    },
    sleeve: {
      id: 1,
      name: "Tipo polo",
    },
    category: {
      id: 1,
      name: "Polo",
    },
  },
  {
    id: 3,
    name: "PLAYERA HENLEY HOMBRE",
    description:
      "Esta playera henley hombre es la elección perfecta para un look fresco y relajado. Su diseño de cuello redondo y corte clásico permite un ajuste cómodo sin perder estilo. Fabricada con telas suaves y transpirables, es ideal para cualquier temporada. Su tono #332d26 aporta versatilidad, combinando fácilmente con otras prendas para lograr un outfit moderno y dinámico.",
    active: true,
    createdAt: "2025-03-20T05:35:44.482Z",
    updatedAt: "2025-03-20T05:35:44.482Z",
    brandId: 1,
    genderId: 1,
    sleeveId: 2,
    categoryId: 3,
    variants: [
      {
        id: 16,
        productId: 3,
        colorId: 11,
        sizeId: 4,
        price: 260,
        stock: 3,
        barcode: "PLAYERA-HENLEY-HOMBRE-NEGRO-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448865/PLAYERA_HENLEY-GRIS_OSCURO_pppjrh.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
      {
        id: 17,
        productId: 3,
        colorId: 11,
        sizeId: 2,
        price: 268,
        stock: 3,
        barcode: "PLAYERA-HENLEY-HOMBRE-NEGRO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448865/PLAYERA_HENLEY-GRIS_OSCURO_pppjrh.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 18,
        productId: 3,
        colorId: 11,
        sizeId: 3,
        price: 270,
        stock: 2,
        barcode: "PLAYERA-HENLEY-HOMBRE-NEGRO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448865/PLAYERA_HENLEY-GRIS_OSCURO_pppjrh.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 19,
        productId: 3,
        colorId: 6,
        sizeId: 2,
        price: 280,
        stock: 3,
        barcode: "PLAYERA-HENLEY-HOMBRE-BEIGE-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742448915/PLAYERA_HENLEY-BEIGE_CLARO_mhwlmb.png",
        color: {
          id: 6,
          name: "Beige",
          hexValue: "#d2b48c",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 1,
      name: "Hombre",
    },
    sleeve: {
      id: 2,
      name: "Cuello redondo",
    },
    category: {
      id: 3,
      name: "Playeras",
    },
  },
  {
    id: 4,
    name: "PLAYERA CUELLO V-HOMBRE",
    description:
      "Esta playera cuello v-hombre es la elección perfecta para un look fresco y relajado. Su diseño de cuello redondo y corte clásico permite un ajuste cómodo sin perder estilo. Fabricada con telas suaves y transpirables, es ideal para cualquier temporada. Combinando fácilmente con otras prendas para lograr un outfit moderno y dinámico.",
    active: true,
    createdAt: "2025-03-20T05:39:37.029Z",
    updatedAt: "2025-03-20T05:39:37.029Z",
    brandId: 1,
    genderId: 1,
    sleeveId: 3,
    categoryId: 3,
    variants: [
      {
        id: 20,
        productId: 4,
        colorId: 10,
        sizeId: 2,
        price: 290,
        stock: 3,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-ROJO-VINO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449051/PLAYERA_CUELLO_V-ROJO_VINO_ufkzu4.png",
        color: {
          id: 10,
          name: "Rojo vino",
          hexValue: "#800020",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 21,
        productId: 4,
        colorId: 10,
        sizeId: 3,
        price: 290,
        stock: 3,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-ROJO-VINO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449051/PLAYERA_CUELLO_V-ROJO_VINO_ufkzu4.png",
        color: {
          id: 10,
          name: "Rojo vino",
          hexValue: "#800020",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 22,
        productId: 4,
        colorId: 3,
        sizeId: 1,
        price: 240,
        stock: 1,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-BLANCO-XCH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449076/PLAYERA_CUELLO_V-BLANCO_NUBE_sihhgc.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 1,
          name: "XCH",
        },
      },
      {
        id: 23,
        productId: 4,
        colorId: 3,
        sizeId: 5,
        price: 290,
        stock: 2,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-BLANCO-XG",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449076/PLAYERA_CUELLO_V-BLANCO_NUBE_sihhgc.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 5,
          name: "XG",
        },
      },
      {
        id: 24,
        productId: 4,
        colorId: 11,
        sizeId: 3,
        price: 260,
        stock: 3,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-NEGRO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449102/PLAYERA_CUELLO_V-NEGRO_AZABACHE_f4jay8.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 25,
        productId: 4,
        colorId: 11,
        sizeId: 2,
        price: 250,
        stock: 2,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-NEGRO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449102/PLAYERA_CUELLO_V-NEGRO_AZABACHE_f4jay8.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 26,
        productId: 4,
        colorId: 8,
        sizeId: 3,
        price: 280,
        stock: 3,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-AZUL-MARINO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449150/PLAYERA_CUELLO_V-AZUL_NOCHE_PROFUNDA_nlzwi3.png",
        color: {
          id: 8,
          name: "Azul marino",
          hexValue: "#1b253f",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 27,
        productId: 4,
        colorId: 8,
        sizeId: 2,
        price: 280,
        stock: 4,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-AZUL-MARINO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449150/PLAYERA_CUELLO_V-AZUL_NOCHE_PROFUNDA_nlzwi3.png",
        color: {
          id: 8,
          name: "Azul marino",
          hexValue: "#1b253f",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 28,
        productId: 4,
        colorId: 8,
        sizeId: 4,
        price: 290,
        stock: 2,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-AZUL-MARINO-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449150/PLAYERA_CUELLO_V-AZUL_NOCHE_PROFUNDA_nlzwi3.png",
        color: {
          id: 8,
          name: "Azul marino",
          hexValue: "#1b253f",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
      {
        id: 29,
        productId: 4,
        colorId: 8,
        sizeId: 1,
        price: 300,
        stock: 7,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-AZUL-MARINO-XCH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449150/PLAYERA_CUELLO_V-AZUL_NOCHE_PROFUNDA_nlzwi3.png",
        color: {
          id: 8,
          name: "Azul marino",
          hexValue: "#1b253f",
        },
        size: {
          id: 1,
          name: "XCH",
        },
      },
      {
        id: 30,
        productId: 4,
        colorId: 8,
        sizeId: 5,
        price: 300,
        stock: 6,
        barcode: "PLAYERA-CUELLO-V-HOMBRE-AZUL-MARINO-XG",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449150/PLAYERA_CUELLO_V-AZUL_NOCHE_PROFUNDA_nlzwi3.png",
        color: {
          id: 8,
          name: "Azul marino",
          hexValue: "#1b253f",
        },
        size: {
          id: 5,
          name: "XG",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 1,
      name: "Hombre",
    },
    sleeve: {
      id: 3,
      name: "Cuello en V",
    },
    category: {
      id: 3,
      name: "Playeras",
    },
  },
  {
    id: 5,
    name: "PLAYERA CUELLO V MUJER",
    description:
      "Esta playera cuello v mujer es la elección perfecta para un look fresco y relajado. Su diseño de cuello redondo y corte clásico permite un ajuste cómodo sin perder estilo. Fabricada con telas suaves y transpirables, es ideal para cualquier temporada. Su tono #4b3a2e aporta versatilidad, combinando fácilmente con otras prendas para lograr un outfit moderno y dinámico.",
    active: true,
    createdAt: "2025-03-20T05:42:08.990Z",
    updatedAt: "2025-03-20T05:42:08.990Z",
    brandId: 1,
    genderId: 2,
    sleeveId: 3,
    categoryId: 3,
    variants: [
      {
        id: 31,
        productId: 5,
        colorId: 7,
        sizeId: 2,
        price: 260,
        stock: 6,
        barcode: "PLAYERA-CUELLO-V-MUJER-MORADO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449259/PLAYERA_CUELLO_V-LILA_P%C3%81LIDO_ekmd3j.png",
        color: {
          id: 7,
          name: "Morado",
          hexValue: "#9370db",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 32,
        productId: 5,
        colorId: 7,
        sizeId: 1,
        price: 260,
        stock: 3,
        barcode: "PLAYERA-CUELLO-V-MUJER-MORADO-XCH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449259/PLAYERA_CUELLO_V-LILA_P%C3%81LIDO_ekmd3j.png",
        color: {
          id: 7,
          name: "Morado",
          hexValue: "#9370db",
        },
        size: {
          id: 1,
          name: "XCH",
        },
      },
      {
        id: 33,
        productId: 5,
        colorId: 3,
        sizeId: 5,
        price: 290,
        stock: 5,
        barcode: "PLAYERA-CUELLO-V-MUJER-BLANCO-XG",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449298/PLAYERA_CUELLO_V-BLANCO_G%C3%89LIDO_oxxofp.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 5,
          name: "XG",
        },
      },
      {
        id: 34,
        productId: 5,
        colorId: 3,
        sizeId: 2,
        price: 260,
        stock: 5,
        barcode: "PLAYERA-CUELLO-V-MUJER-BLANCO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449298/PLAYERA_CUELLO_V-BLANCO_G%C3%89LIDO_oxxofp.png",
        color: {
          id: 3,
          name: "Blanco",
          hexValue: "#ffffff",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 2,
      name: "Mujer",
    },
    sleeve: {
      id: 3,
      name: "Cuello en V",
    },
    category: {
      id: 3,
      name: "Playeras",
    },
  },
  {
    id: 6,
    name: "PLAYERA CUELLO REDONDO MUJER",
    description:
      "Esta playera cuello redondo mujer es la elección perfecta para un look fresco y relajado. Su diseño de cuello redondo y corte clásico permite un ajuste cómodo sin perder estilo. Fabricada con telas suaves y transpirables, es ideal para cualquier temporada. Su tono #484040 aporta versatilidad, combinando fácilmente con otras prendas para lograr un outfit moderno y dinámico.",
    active: true,
    createdAt: "2025-03-20T05:45:20.437Z",
    updatedAt: "2025-03-20T05:45:20.437Z",
    brandId: 1,
    genderId: 2,
    sleeveId: 2,
    categoryId: 3,
    variants: [
      {
        id: 35,
        productId: 6,
        colorId: 9,
        sizeId: 2,
        price: 240,
        stock: 9,
        barcode: "PLAYERA-CUELLO-REDONDO-MUJER-GRIS-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449507/PLAYERA_CUELLO_REDONDO-GRIS_AZUL_CLARO_vzgvl3.png",
        color: {
          id: 9,
          name: "Gris",
          hexValue: "#61687a",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 36,
        productId: 6,
        colorId: 5,
        sizeId: 2,
        price: 280,
        stock: 3,
        barcode: "PLAYERA-CUELLO-REDONDO-MUJER-AZUL-CIELO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449471/PLAYERA_CUELLO_REDONDO-AZUL_CLARO_coylgh.png",
        color: {
          id: 5,
          name: "Azul cielo",
          hexValue: "#1e90ff",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 37,
        productId: 6,
        colorId: 2,
        sizeId: 1,
        price: 240,
        stock: 5,
        barcode: "PLAYERA-CUELLO-REDONDO-MUJER-AMARILLO-XCH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449437/PLAYERA_CUELLO_REDONDO-AMARILLO_MANTECOSO_qkmusq.png",
        color: {
          id: 2,
          name: "Amarillo",
          hexValue: "#ffd700",
        },
        size: {
          id: 1,
          name: "XCH",
        },
      },
      {
        id: 38,
        productId: 6,
        colorId: 2,
        sizeId: 3,
        price: 260,
        stock: 4,
        barcode: "PLAYERA-CUELLO-REDONDO-MUJER-AMARILLO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449437/PLAYERA_CUELLO_REDONDO-AMARILLO_MANTECOSO_qkmusq.png",
        color: {
          id: 2,
          name: "Amarillo",
          hexValue: "#ffd700",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 39,
        productId: 6,
        colorId: 2,
        sizeId: 2,
        price: 240,
        stock: 8,
        barcode: "PLAYERA-CUELLO-REDONDO-MUJER-AMARILLO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449437/PLAYERA_CUELLO_REDONDO-AMARILLO_MANTECOSO_qkmusq.png",
        color: {
          id: 2,
          name: "Amarillo",
          hexValue: "#ffd700",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 2,
      name: "Mujer",
    },
    sleeve: {
      id: 2,
      name: "Cuello redondo",
    },
    category: {
      id: 3,
      name: "Playeras",
    },
  },
  {
    id: 7,
    name: "PLAYERA CUELLO REDONDO HOMBRE",
    description:
      "Esta playera cuello redondo hombre es la elección perfecta para un look fresco y relajado. Su diseño de cuello redondo y corte clásico permite un ajuste cómodo sin perder estilo. Fabricada con telas suaves y transpirables, es ideal para cualquier temporada. Combinando fácilmente con otras prendas para lograr un outfit moderno y dinámico.",
    active: true,
    createdAt: "2025-03-20T05:48:13.826Z",
    updatedAt: "2025-03-20T05:48:13.826Z",
    brandId: 1,
    genderId: 1,
    sleeveId: 2,
    categoryId: 3,
    variants: [
      {
        id: 40,
        productId: 7,
        colorId: 6,
        sizeId: 4,
        price: 280,
        stock: 5,
        barcode: "PLAYERA-CUELLO-REDONDO-HOMBRE-BEIGE-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449621/PLAYERA_CUELLO_REDONDO-BEIGE_ARENOSO_rna8yy.png",
        color: {
          id: 6,
          name: "Beige",
          hexValue: "#d2b48c",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
      {
        id: 41,
        productId: 7,
        colorId: 6,
        sizeId: 2,
        price: 240,
        stock: 5,
        barcode: "PLAYERA-CUELLO-REDONDO-HOMBRE-BEIGE-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449621/PLAYERA_CUELLO_REDONDO-BEIGE_ARENOSO_rna8yy.png",
        color: {
          id: 6,
          name: "Beige",
          hexValue: "#d2b48c",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 42,
        productId: 7,
        colorId: 5,
        sizeId: 1,
        price: 240,
        stock: 4,
        barcode: "PLAYERA-CUELLO-REDONDO-HOMBRE-AZUL-CIELO-XCH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449668/PLAYERA_CUELLO_REDONDO-AZUL_EL%C3%89CTRICO_qonggu.png",
        color: {
          id: 5,
          name: "Azul cielo",
          hexValue: "#1e90ff",
        },
        size: {
          id: 1,
          name: "XCH",
        },
      },
      {
        id: 43,
        productId: 7,
        colorId: 5,
        sizeId: 2,
        price: 240,
        stock: 5,
        barcode: "PLAYERA-CUELLO-REDONDO-HOMBRE-AZUL-CIELO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449668/PLAYERA_CUELLO_REDONDO-AZUL_EL%C3%89CTRICO_qonggu.png",
        color: {
          id: 5,
          name: "Azul cielo",
          hexValue: "#1e90ff",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 44,
        productId: 7,
        colorId: 5,
        sizeId: 4,
        price: 280,
        stock: 5,
        barcode: "PLAYERA-CUELLO-REDONDO-HOMBRE-AZUL-CIELO-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742449668/PLAYERA_CUELLO_REDONDO-AZUL_EL%C3%89CTRICO_qonggu.png",
        color: {
          id: 5,
          name: "Azul cielo",
          hexValue: "#1e90ff",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 1,
      name: "Hombre",
    },
    sleeve: {
      id: 2,
      name: "Cuello redondo",
    },
    category: {
      id: 3,
      name: "Playeras",
    },
  },
  {
    id: 8,
    name: "PANTALON PIXIE MUJER",
    description:
      "Los jeans de corte mujer ofrecen un ajuste impecable y una silueta favorecedora. Confeccionados con materiales de alta calidad, brindan confort y flexibilidad en cada movimiento. Ideales para un look casual o sofisticado, estos pantalones combinan perfectamente con cualquier outfit. En un elegante tono #25211a, son una opción imprescindible en cualquier guardarropa.",
    active: true,
    createdAt: "2025-03-20T22:07:34.992Z",
    updatedAt: "2025-03-20T22:07:34.992Z",
    brandId: 1,
    genderId: 2,
    sleeveId: 4,
    categoryId: 2,
    variants: [
      {
        id: 45,
        productId: 8,
        colorId: 6,
        sizeId: 4,
        price: 300,
        stock: 3,
        barcode: "PANTALON-PIXIE-MUJER-BEIGE-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508425/PANTALON_PIXIE-BEIGE_DURAZNO_bcizfr.png",
        color: {
          id: 6,
          name: "Beige",
          hexValue: "#d2b48c",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 2,
      name: "Mujer",
    },
    sleeve: {
      id: 4,
      name: "No aplica",
    },
    category: {
      id: 2,
      name: "Pantalones",
    },
  },
  {
    id: 9,
    name: "PANTALON PIXIE FLARE MUJER",
    description:
      "Los jeans de corte mujer ofrecen un ajuste impecable y una silueta favorecedora. Confeccionados con materiales de alta calidad, brindan confort y flexibilidad en cada movimiento. Ideales para un look casual o sofisticado, estos pantalones combinan perfectamente con cualquier outfit. En un elegante tono #1b1110, son una opción imprescindible en cualquier guardarropa.",
    active: true,
    createdAt: "2025-03-20T22:12:43.368Z",
    updatedAt: "2025-03-20T22:12:43.368Z",
    brandId: 1,
    genderId: 2,
    sleeveId: 4,
    categoryId: 2,
    variants: [
      {
        id: 46,
        productId: 9,
        colorId: 11,
        sizeId: 2,
        price: 280,
        stock: 11,
        barcode: "PANTALON-PIXIE-FLARE-MUJER-NEGRO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508705/PANTALON_PIXIE_FLARE-NEGRO_INTENSO_frn2ib.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 47,
        productId: 9,
        colorId: 10,
        sizeId: 3,
        price: 290,
        stock: 7,
        barcode: "PANTALON-PIXIE-FLARE-MUJER-ROJO-VINO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508733/PANTALON_PIXIE_FLARE-ROJO_CAOBA_rhs24f.png",
        color: {
          id: 10,
          name: "Rojo vino",
          hexValue: "#800020",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 48,
        productId: 9,
        colorId: 10,
        sizeId: 2,
        price: 280,
        stock: 7,
        barcode: "PANTALON-PIXIE-FLARE-MUJER-ROJO-VINO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508733/PANTALON_PIXIE_FLARE-ROJO_CAOBA_rhs24f.png",
        color: {
          id: 10,
          name: "Rojo vino",
          hexValue: "#800020",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 49,
        productId: 9,
        colorId: 10,
        sizeId: 4,
        price: 320,
        stock: 8,
        barcode: "PANTALON-PIXIE-FLARE-MUJER-ROJO-VINO-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508733/PANTALON_PIXIE_FLARE-ROJO_CAOBA_rhs24f.png",
        color: {
          id: 10,
          name: "Rojo vino",
          hexValue: "#800020",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 2,
      name: "Mujer",
    },
    sleeve: {
      id: 4,
      name: "No aplica",
    },
    category: {
      id: 2,
      name: "Pantalones",
    },
  },
  {
    id: 10,
    name: "PANTALON PIERNA ANCHA MUJER",
    description:
      "Los jeans de corte mujer ofrecen un ajuste impecable y una silueta favorecedora. Confeccionados con materiales de alta calidad, brindan confort y flexibilidad en cada movimiento. Ideales para un look casual o sofisticado, estos pantalones combinan perfectamente con cualquier outfit. En un elegante tono #131111, son una opción imprescindible en cualquier guardarropa.",
    active: true,
    createdAt: "2025-03-20T22:15:04.600Z",
    updatedAt: "2025-03-20T22:15:04.600Z",
    brandId: 1,
    genderId: 2,
    sleeveId: 4,
    categoryId: 2,
    variants: [
      {
        id: 50,
        productId: 10,
        colorId: 11,
        sizeId: 2,
        price: 320,
        stock: 4,
        barcode: "PANTALON-PIERNA-ANCHA-MUJER-NEGRO-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508870/PANTALON_PIERNA_ANCHA-NEGRO_OBSIDIANA_m24xth.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 51,
        productId: 10,
        colorId: 11,
        sizeId: 3,
        price: 350,
        stock: 3,
        barcode: "PANTALON-PIERNA-ANCHA-MUJER-NEGRO-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508870/PANTALON_PIERNA_ANCHA-NEGRO_OBSIDIANA_m24xth.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 52,
        productId: 10,
        colorId: 11,
        sizeId: 4,
        price: 390,
        stock: 8,
        barcode: "PANTALON-PIERNA-ANCHA-MUJER-NEGRO-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508870/PANTALON_PIERNA_ANCHA-NEGRO_OBSIDIANA_m24xth.png",
        color: {
          id: 11,
          name: "Negro",
          hexValue: "#000000",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 2,
      name: "Mujer",
    },
    sleeve: {
      id: 4,
      name: "No aplica",
    },
    category: {
      id: 2,
      name: "Pantalones",
    },
  },
  {
    id: 11,
    name: "PANTALON DE VESTIR HOMBRE",
    description:
      "Los jeans de corte hombre ofrecen un ajuste impecable y una silueta favorecedora. Confeccionados con materiales de alta calidad, brindan confort y flexibilidad en cada movimiento. Ideales para un look casual o sofisticado, estos pantalones combinan perfectamente con cualquier outfit. Son una opción imprescindible en cualquier guardarropa.",
    active: true,
    createdAt: "2025-03-20T22:26:06.670Z",
    updatedAt: "2025-03-20T22:26:06.670Z",
    brandId: 1,
    genderId: 1,
    sleeveId: 4,
    categoryId: 2,
    variants: [
      {
        id: 53,
        productId: 11,
        colorId: 9,
        sizeId: 2,
        price: 120,
        stock: 6,
        barcode: "PANTALON-DE-VESTIR-HOMBRE-GRIS-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508997/PANTALON_DE_VESTIR-GRIS_P%C3%89TREO_lowoch.png",
        color: {
          id: 9,
          name: "Gris",
          hexValue: "#61687a",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 54,
        productId: 11,
        colorId: 9,
        sizeId: 3,
        price: 150,
        stock: 10,
        barcode: "PANTALON-DE-VESTIR-HOMBRE-GRIS-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742508997/PANTALON_DE_VESTIR-GRIS_P%C3%89TREO_lowoch.png",
        color: {
          id: 9,
          name: "Gris",
          hexValue: "#61687a",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
      {
        id: 55,
        productId: 11,
        colorId: 6,
        sizeId: 2,
        price: 190,
        stock: 5,
        barcode: "PANTALON-DE-VESTIR-HOMBRE-BEIGE-CH",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742509117/PANTALON_DE_VESTIR-BEIGE_MIEL_ig2fvg.png",
        color: {
          id: 6,
          name: "Beige",
          hexValue: "#d2b48c",
        },
        size: {
          id: 2,
          name: "CH",
        },
      },
      {
        id: 56,
        productId: 11,
        colorId: 6,
        sizeId: 4,
        price: 260,
        stock: 8,
        barcode: "PANTALON-DE-VESTIR-HOMBRE-BEIGE-G",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742509117/PANTALON_DE_VESTIR-BEIGE_MIEL_ig2fvg.png",
        color: {
          id: 6,
          name: "Beige",
          hexValue: "#d2b48c",
        },
        size: {
          id: 4,
          name: "G",
        },
      },
      {
        id: 57,
        productId: 11,
        colorId: 6,
        sizeId: 3,
        price: 220,
        stock: 9,
        barcode: "PANTALON-DE-VESTIR-HOMBRE-BEIGE-MED",
        imageUrl:
          "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1742509117/PANTALON_DE_VESTIR-BEIGE_MIEL_ig2fvg.png",
        color: {
          id: 6,
          name: "Beige",
          hexValue: "#d2b48c",
        },
        size: {
          id: 3,
          name: "MED",
        },
      },
    ],
    brand: {
      id: 1,
      name: "Cayro Uniformes",
    },
    gender: {
      id: 1,
      name: "Hombre",
    },
    sleeve: {
      id: 4,
      name: "No aplica",
    },
    category: {
      id: 2,
      name: "Pantalones",
    },
  },
];

export default productsData;
