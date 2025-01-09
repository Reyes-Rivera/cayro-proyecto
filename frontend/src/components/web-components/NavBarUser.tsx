import { ChevronDown, LogOut, Menu, Sun, Moon, User, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextType';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';
import logo from "@/assets/logo.png";

const NavBarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    const res = await signOut();
    if (res) {
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'La sesión se ha cerrado correctamente.',
        confirmButtonColor: '#2F93D1',
      });
      navigate("/login");
    }
  };

  const handleGoToProfile = () => {
    navigate(user?.role === "ADMIN" ? "/admin-profile" : "/user-profile");
  };

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      setDarkMode(false);
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.classList.add('dark');
      setDarkMode(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow-md dark:bg-gray-900' : 'bg-transparent'}`}>
      <nav className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* LOGO */}
            <div className="flex items-center">
              <NavLink to="/" className="flex-shrink-0">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-28 w-auto object-contain dark:filter dark:drop-shadow-white"
                  loading="lazy"
                />
              </NavLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-6 ml-auto">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-black dark:text-white border-b-2 border-blue-600"
                    : "text-gray-800 dark:text-gray-300 hover:text-blue-600 transition-all"
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive
                    ? "text-black dark:text-white border-b-2 border-blue-600"
                    : "text-gray-800 dark:text-gray-300 hover:text-blue-600 transition-all"
                }
              >
                Productos
              </NavLink>

              {auth ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">{user?.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-gray-800">
                    <DropdownMenuItem onClick={handleGoToProfile}>
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Iniciar sesión
                </NavLink>
              )}

              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                {darkMode ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6 text-gray-900" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                {darkMode ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6 text-gray-900" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="space-y-1 pt-2 pb-3">
            <NavLink to="/" className="block px-4 py-2 text-gray-800 dark:text-gray-300">
              Inicio
            </NavLink>
            <NavLink to="/products" className="block px-4 py-2 text-gray-800 dark:text-gray-300">
              Productos
            </NavLink>

            {auth ? (
              <>
                <button
                  onClick={handleGoToProfile}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300"
                >
                  Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink to="/login" className="block px-4 py-2 text-gray-800 dark:text-gray-300">
                Iniciar sesión
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBarUser;
