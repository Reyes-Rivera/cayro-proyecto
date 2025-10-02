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
import { Link } from "react-router-dom";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";

// Carga diferida del SVG pesado
const WaveSVG = lazy(() => import("./WaveSVG"));

// Hook personalizado para datos de la empresa
const useCompanyInfo = () => {
  const [info, setInfo] = useState<CompanyProfile>();
  const [loading, setLoading] = useState(true);

  const fetchCompanyInfo = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCompanyInfoApi();
      if (res?.data?.[0]) {
        setInfo(res.data[0]);
      }
    } catch (error) {
      console.warn("Error fetching company info:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyInfo();
  }, [fetchCompanyInfo]);

  return { info, loading };
};

// Componente de contacto optimizado
const ContactInfo = ({ info }: { info?: CompanyProfile }) => {
  const contactData = useMemo(
    () => [
      {
        icon: Mail,
        text: info?.contactInfo?.[0]?.email || "correo@ejemplo.com",
        type: "email" as const,
        href: `mailto:${info?.contactInfo?.[0]?.email || "correo@ejemplo.com"}`,
      },
      {
        icon: Phone,
        text: info?.contactInfo?.[0]?.phone || "+52 123 456 7890",
        type: "tel" as const,
        href: `tel:${info?.contactInfo?.[0]?.phone || "+521234567890"}`,
      },
      {
        icon: MapPin,
        text: info?.contactInfo?.[0]?.address || "Dirección de la empresa",
        type: "text" as const,
      },
    ],
    [info]
  );

  return (
    <ul className="space-y-4" role="list">
      {contactData.map((item, index) => (
        <li key={index} className="flex items-start">
          <item.icon
            size={18}
            className="mr-3 text-blue-400 mt-0.5 flex-shrink-0"
            aria-hidden="true"
          />
          {item.type === "text" ? (
            <span className="text-gray-400 text-sm leading-relaxed">
              {item.text}
            </span>
          ) : (
            <a
              href={item.href}
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm leading-relaxed break-words"
            >
              {item.text}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};

// Componente de enlaces optimizado
const LinkSection = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ to: string; text: string }>;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white relative inline-block">
        {title}
        <span
          className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500"
          aria-hidden="true"
        />
      </h3>
      <ul className="space-y-3" role="list">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.to}
              className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1 -mx-1"
            >
              <ChevronRight
                className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform -translate-x-2 group-hover:translate-x-0 group-focus:translate-x-0 transition-all duration-300 flex-shrink-0"
                aria-hidden="true"
              />
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Componente de redes sociales
const SocialLinks = () => {
  const socialLinks = useMemo(
    () => [
      {
        icon: Facebook,
        label: "Facebook",
        href: "#",
        color: "blue",
      },
      {
        icon: Instagram,
        label: "Instagram",
        href: "#",
        color: "pink",
      },
    ],
    []
  );

  return (
    <div className="flex space-x-3">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label={`Síguenos en ${social.label}`}
          rel="noopener noreferrer"
        >
          <social.icon
            size={18}
            className={`text-${social.color}-400`}
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
};

// Fallback para el SVG
const WaveFallback = () => (
  <div
    className="absolute top-0 left-0 right-0 h-8 bg-slate-950"
    aria-hidden="true"
  />
);

export function Footer() {
  const { info, loading } = useCompanyInfo();

  // Memoizar los datos de los enlaces
  const legalLinks = useMemo(
    () => [
      { to: "/terminos", text: "Términos y Condiciones" },
      { to: "/aviso-privacidad", text: "Aviso de Privacidad" },
      { to: "/deslinde-legal", text: "Deslinde legal" },
    ],
    []
  );

  const companyLinks = useMemo(
    () => [
      { to: "/sobre-nosotros", text: "Quiénes Somos" },
      { to: "/contacto", text: "Contáctanos" },
      { to: "/preguntas-frecuentes", text: "FAQS" },
    ],
    []
  );

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="relative" role="contentinfo">
      {/* Decorative top wave con lazy loading */}
      <div
        className="absolute top-0 left-0 right-0 h-8 overflow-hidden"
        aria-hidden="true"
      >
        <Suspense fallback={<WaveFallback />}>
          <WaveSVG />
        </Suspense>
      </div>

      <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Company Info */}
            <div className="space-y-4 lg:space-y-5">
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                {loading ? (
                  <span
                    className="skeleton bg-gray-700 rounded h-7 w-40 inline-block"
                    aria-hidden="true"
                  >
                    Cargando...
                  </span>
                ) : (
                  info?.title || "Nombre de la Empresa"
                )}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {loading ? (
                  <span
                    className="skeleton bg-gray-700 rounded h-4 w-full inline-block"
                    aria-hidden="true"
                  >
                    Cargando slogan...
                  </span>
                ) : (
                  info?.slogan || "Slogan de la empresa aquí"
                )}
              </p>
              <SocialLinks />
            </div>

            {/* Legal Links */}
            <LinkSection title="Enlaces Legales" links={legalLinks} />

            {/* Company Links */}
            <LinkSection title="Empresa" links={companyLinks} />

            {/* Contact Info */}
            <div className="space-y-4 lg:space-y-5">
              <h3 className="text-lg font-semibold text-white relative inline-block">
                Contacto
                <span
                  className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500"
                  aria-hidden="true"
                />
              </h3>
              <ContactInfo info={info} />
            </div>
          </div>

          {/* Bottom Section */}
          <div
            className="mt-10 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
            role="separator"
          >
            <p className="text-gray-500 text-xs lg:text-sm text-center md:text-left order-2 md:order-1">
              &copy; {currentYear}{" "}
              <span className="sr-only">
                {info?.title || "Nombre de la Empresa"}
              </span>
              {info?.title || "Nombre de la Empresa"}. Todos los derechos
              reservados.
            </p>
            <div
              className="flex items-center text-gray-500 text-xs lg:text-sm order-1 md:order-2"
              aria-label="Mensaje de agradecimiento"
            >
              <span>Hecho con</span>
              <Heart
                size={12}
                className="mx-1 text-red-500 flex-shrink-0"
                aria-label="amor"
              />
              <span>por</span>
              <span className="ml-1 text-blue-400">
                {info?.title || "Nuestra Empresa"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
