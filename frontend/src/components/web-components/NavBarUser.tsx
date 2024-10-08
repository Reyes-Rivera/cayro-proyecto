import { Menu, X } from 'lucide-react';
import Logo from "../../assets/Logo.png";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NavBarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={Logo}
                  alt="Cayro Uniformes"
                  width={96}
                  height={32}
                />
              </div>
            </div>
            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8 ml-auto">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "border-[#2F93D1] text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-[#2F93D1] hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/productos"
                className={({ isActive }) =>
                  isActive
                    ? "border-[#2F93D1] text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-[#2F93D1] hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Productos
              </NavLink>
              <NavLink
                to="/sobre-nosotros"
                className={({ isActive }) =>
                  isActive
                    ? "border-[#2F93D1] text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-[#2F93D1] hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Sobre Nosotros
              </NavLink>
              <NavLink
                to="/contacto"
                className={({ isActive }) =>
                  isActive
                    ? "border-[#2F93D1] text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-[#2F93D1] hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Contacto
              </NavLink>
              <NavLink
                to="/login"
                // className={({ isActive }) =>
                //   isActive
                //     ? "border-[#2F93D1] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                //     : "border-transparent text-gray-500 hover:border-[#2F93D1] hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                // }
                className={" bg-[#2F93D1] text-white p-1 rounded-md"}
              >
                Iniciar sesión
              </NavLink>
            </div>
            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2F93D1] bg-transparent"
              >
                <span className="sr-only">Abrir menú principal</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-[#2F93D1] hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Inicio
            </NavLink>
            <NavLink
              to="/productos"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-[#2F93D1] hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Productos
            </NavLink>
            <NavLink
              to="/sobre-nosotros"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-[#2F93D1] hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Sobre Nosotros
            </NavLink>
            <NavLink
              to="/contacto"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-[#2F93D1] hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Contacto
            </NavLink>
            <NavLink
              to="/login"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-[#2F93D1] hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Login
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBarUser;
