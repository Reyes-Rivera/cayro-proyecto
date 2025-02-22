import { getCompanyInfoApi } from "@/api/company";
import { CompanyProfile } from "@/types/CompanyInfo";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
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
    <footer className="bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">{info?.title}</h2>
            <p className="text-gray-400 mb-4">{info?.slogan}</p>
            <div className="flex space-x-4">
              <Link to="#" className="hover:text-blue-400">
                <Facebook size={24} />
              </Link>
              <Link to="#" className="hover:text-blue-400">
                <Instagram size={24} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Legales</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terminos" className="hover:text-blue-400">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/aviso-privacidad" className="hover:text-blue-400">
                  Aviso de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/deslinde-legal" className="hover:text-blue-400">
                  Deslinde legal
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre-nosotros" className="hover:text-blue-400">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-blue-400">
                  Contactanos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p></p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={18} className="mr-2" />
                <p>{info?.contactInfo && info?.contactInfo[0]?.email}</p>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2" />
                <p>{info?.contactInfo && info?.contactInfo[0]?.phone}</p>
              </li>
              <li className="flex items-center">
                <MapPin size={18} className="mr-2" />
                <span>{info?.contactInfo && info?.contactInfo[0]?.address}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {info?.title}. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
