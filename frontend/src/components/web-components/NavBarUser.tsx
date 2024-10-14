import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import Logo from "../../assets/Logo.png";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextType';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';

const NavBarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, user, signOut } = useAuth();
  const handleLogout = async () => {
    const res = await signOut();
    if (res) {
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada.',
        text: 'La se sesión se ha cerrado correctamente.',
        confirmButtonColor: '#2F93D1',
      });
      navigate("/login");
      return;
    }
  }
  const navigate= useNavigate();
  const handleGoToProfile = () => {
    navigate("/user-profile");
  }
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
                  className='w-32'
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

              {
                auth ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-block">Juan Pérez</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span
                          className='cursor-pointer w-full'
                         onClick={handleGoToProfile}
                        >
                         Pefil
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span
                          className='cursor-pointer w-full'
                         onClick={handleLogout}
                        >
                         Cerrar sesión
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <NavLink
                    to="/login"
                    className={" bg-[#2F93D1] text-white p-1 rounded-md"}
                  >
                    Iniciar sesión
                  </NavLink>
                )
              }
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
