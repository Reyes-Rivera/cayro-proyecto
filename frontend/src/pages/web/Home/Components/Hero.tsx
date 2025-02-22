import { motion } from "framer-motion";
import backgroundImage from "../assets/hero.jpg";
import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="min-h-screen mt-14 lg:mt-0 bg-cover bg-center relative flex items-center justify-center text-center px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl text-white"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Moda y Estilo con Calidad
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Explora nuestra colección de prendas y accesorios. Desde ropa casual
          hasta ropa deportiva, tenemos todo lo que necesitas para lucir
          increíble en cualquier ocasión.
        </p>
        <div className="flex justify-center gap-6">
          <NavLink to={"/productos"}  className=" p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center">
            Ver catálogo
          </NavLink>
         
        </div>
      </motion.div>
    </section>
  );
}
