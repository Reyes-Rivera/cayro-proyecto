import { motion } from "framer-motion";
import escolta from "@/assets/uniformes-escolta-removebg-preview.png";
import polo from "@/assets/polo-3-removebg-preview.png";
import deportivo from "@/assets/conjunto-removebg-preview.png";
import espinilleras from "@/assets/espinilleras-removebg-preview.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import ProductCard from "../../products/components/ProductCard";

// Datos de los productos (4 fijos + 8 en carrusel)
const allProducts = [
  { id: 1, name: "Uniforme Escolar Clásico", price: 599, oldPrice: 799, image: escolta, category: "Primaria" },
  { id: 2, name: "Conjunto Deportivo Premium", price: 499, oldPrice: 649, image: deportivo, category: "Deportes" },
  { id: 3, name: "Falda Plisada Elegante", price: 299, oldPrice: 399, image: polo, category: "Secundaria" },
  { id: 4, name: "Espinilleras", price: 249, oldPrice: 299, image: espinilleras, category: "Accesorios" },
  { id: 5, name: "Polo Casual", price: 350, oldPrice: 450, image: polo, category: "Hombre" },
  { id: 6, name: "Pantalón Formal", price: 799, oldPrice: 999, image: deportivo, category: "Hombre" },
  { id: 7, name: "Playera Deportiva", price: 199, oldPrice: 299, image: espinilleras, category: "Deportes" },
  { id: 8, name: "Sudadera Clásica", price: 599, oldPrice: 749, image: escolta, category: "Mujer" },
  { id: 9, name: "Gorra Sport", price: 149, oldPrice: 199, image: espinilleras, category: "Accesorios" },
  { id: 10, name: "Short Deportivo", price: 399, oldPrice: 499, image: deportivo, category: "Deportes" },
  { id: 11, name: "Chamarra Ligera", price: 899, oldPrice: 1099, image: polo, category: "Hombre" },
  { id: 12, name: "Calcetas Largas", price: 99, oldPrice: 149, image: escolta, category: "Accesorios" },
];

// Separar los 4 productos fijos y los 8 en carrusel
const fixedProducts = allProducts.slice(0, 4);
const carouselProducts = allProducts.slice(4);

export default function FeaturedProducts() {
  return (
    <section className="py-20 px-10 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            Productos destacados
          </h2>
        </motion.div>

        {/* Sección de 4 productos fijos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {fixedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Carrusel SIN pausas, completamente continuo */}
        <div className="relative overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={4} // Muestra 4 productos a la vez
            autoplay={{
              delay: 0, // Sin pausa entre transiciones
              disableOnInteraction: false, // No se detiene al interactuar
              pauseOnMouseEnter: true, // Se detiene solo si el usuario pone el cursor
            }}
            speed={5000} // Velocidad de movimiento, más alta para que sea fluido
            loop={true} // Hace que el carrusel nunca termine
            freeMode={true} // Movimiento suave, sin cortes
            className="mySwiper"
          >
            {carouselProducts.concat(carouselProducts).map((product, index) => (
              <SwiperSlide key={index}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
