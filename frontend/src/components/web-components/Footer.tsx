"use client";

import { getCompanyInfoApi } from "@/api/company";
import type { CompanyProfile } from "@/types/CompanyInfo";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const [info, setInfo] = useState<CompanyProfile>();

  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfoApi();
      if (res) {
        setInfo(res.data[0]);
      }
    };
    getInfo();
  }, []);

  return (
    <footer className="relative">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-16 text-slate-950 dark:text-slate-950"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-current"
          ></path>
        </svg>
      </div>

      <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                {info?.title || "Nombre de la Empresa"}
              </h2>
              <p className="text-gray-400 mb-4 max-w-xs">
                {info?.slogan || "Slogan de la empresa aquí"}
              </p>
              <div className="flex space-x-4">
                <Link
                  to="#"
                  className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center hover:bg-blue-600/30 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={20} className="text-blue-400" />
                </Link>
                <Link
                  to="#"
                  className="w-10 h-10 rounded-full bg-pink-600/20 flex items-center justify-center hover:bg-pink-600/30 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={20} className="text-pink-400" />
                </Link>
              </div>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white relative inline-block">
                Enlaces Legales
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/terminos"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link
                    to="/aviso-privacidad"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    Aviso de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    to="/deslinde-legal"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    Deslinde legal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white relative inline-block">
                Empresa
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/sobre-nosotros"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    Quiénes Somos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contacto"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    Contáctanos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/preguntas-frecuentes"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    FAQS
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white relative inline-block">
                Contacto
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500"></span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Mail
                    size={18}
                    className="mr-3 text-blue-400 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-400">
                    {(info?.contactInfo && info?.contactInfo[0]?.email) ||
                      "correo@ejemplo.com"}
                  </span>
                </li>
                <li className="flex items-start">
                  <Phone
                    size={18}
                    className="mr-3 text-blue-400 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-400">
                    {(info?.contactInfo && info?.contactInfo[0]?.phone) ||
                      "+52 123 456 7890"}
                  </span>
                </li>
                <li className="flex items-start">
                  <MapPin
                    size={18}
                    className="mr-3 text-blue-400 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-400">
                    {(info?.contactInfo && info?.contactInfo[0]?.address) ||
                      "Dirección de la empresa"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()}{" "}
              {info?.title || "Nombre de la Empresa"}. Todos los derechos
              reservados.
            </p>
            <div className="flex items-center text-gray-500 text-sm">
              <span>Hecho con</span>
              <Heart size={14} className="mx-1 text-red-500" />
              <span>por</span>
              <p
               
                className="ml-1 text-blue-400 hover:text-blue-300 transition-colors flex items-center"
              >
                {info?.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
