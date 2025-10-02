"use client";

import { memo, useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

/* ---------- Typewriter ligero ---------- */
const TypewriterText = memo(({ texts }: { texts: string[] }) => {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  const [spd, setSpd] = useState(150);

  useEffect(() => {
    const t = texts[i];
    const timer = setTimeout(() => {
      if (!del) {
        setTxt(t.substring(0, txt.length + 1));
        if (txt.length === t.length) {
          setSpd(1500);
          setDel(true);
        } else setSpd(90);
      } else {
        setTxt(t.substring(0, txt.length - 1));
        if (txt.length === 0) {
          setDel(false);
          setI((i + 1) % texts.length);
          setSpd(500);
        } else setSpd(50);
      }
    }, spd);
    return () => clearTimeout(timer);
  }, [txt, i, del, texts, spd]);

  return <span>{txt}</span>;
});
TypewriterText.displayName = "TypewriterText";

/* ---------- Hero ---------- */
const HomeHero = () => {
  return (
    <div className="relative min-h-[80vh] bg-white dark:bg-gray-900 flex items-center overflow-hidden">
      {/* Fondo sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50/50 dark:from-blue-900/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Texto */}
          <div className="md:col-span-5">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              NUEVA COLECCIÓN
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Estilo que{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600 dark:text-blue-400">
                  define
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded" />
              </span>{" "}
              tu personalidad
            </h1>

            <div className="mt-4 flex items-center text-lg text-gray-700 dark:text-gray-300">
              <span className="mr-2">Descubre</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                <TypewriterText
                  texts={[
                    "calidad premium",
                    "diseños exclusivos",
                    "tendencias actuales",
                    "comodidad garantizada",
                  ]}
                />
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mt-5 text-lg max-w-xl">
              Nuestra nueva colección combina estilo contemporáneo con
              materiales sostenibles. Cada prenda está diseñada para destacar tu
              personalidad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <NavLink
                to="/productos"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg shadow-blue-600/20"
              >
                <span className="flex items-center">
                  Explorar colección
                  <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </NavLink>

              <NavLink
                to="/contacto"
                className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-full transition-colors hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                Contactar
              </NavLink>
            </div>
          </div>

          {/* Imagen LCP */}
          <div className="md:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="relative overflow-hidden rounded-xl">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/playeras-640.webp 640w, /playeras-960.webp 960w, /playeras-1280.webp 1280w"
                    sizes="(min-width: 1024px) 720px, 92vw"
                  />
                  <img
                    src="/playeras-1280.webp"
                    alt="Colección de Playeras"
                    width={1280}
                    height={720}
                    className="block w-full h-[300px] md:h-[420px] object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    style={{ containIntrinsicSize: "720px 1280px" }}
                  />
                </picture>

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 text-white drop-shadow">
                  <h3 className="text-2xl md:text-3xl font-bold">Playeras</h3>
                  <NavLink
                    to="/productos?categoria=playeras"
                    className="mt-2 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-full transition-colors"
                  >
                    Ver colección <ArrowRight className="ml-2 w-4 h-4" />
                  </NavLink>
                </div>
              </div>
            </div>
            {/* sin animaciones pesadas para LCP */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HomeHero);
