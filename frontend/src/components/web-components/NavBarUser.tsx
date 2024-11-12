import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextType';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from "@/components/web-components/ThemeToggle";
import { getCompanyInfoApi } from '@/api/company';

const NavBarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [logo, setLogo] = useState();

  const handleLogout = async () => {
    const res = await signOut();
    if (res) {
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada.',
        text: 'La sesión se ha cerrado correctamente.',
        confirmButtonColor: '#2F93D1',
      });
      navigate("/login");
      return;
    }
  }

  const handleGoToProfile = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin-profile");
    }
    if (user?.role === "USER") {
      navigate("/user-profile");
    }
  }
  useEffect(() => {
    const getInfoPage = async () => {
      const res = getCompanyInfoApi();
      setLogo((await res).data[0].logoUrl);
    };
    getInfoPage();
  }, []);
  return (
    <div>
      <nav className="bg-gray-50 shadow-sm dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-28 h-28 flex justify-start">
                <img
                  src={logo}
                  alt="Cayro Uniformes"
                  className=" object-contain dark:filter dark:drop-shadow-white"
                />
              </div>
            </div>
            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8 ml-auto">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "border-[#2F93D1] text-gray-700 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:border-[#2F93D1] hover:text-gray-700 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Inicio
              </NavLink>
              {auth ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block text-gray-700 dark:text-gray-100">{user?.name}</span>
                      <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-100" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-gray-800">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-100" />
                      <span className="cursor-pointer w-full text-gray-700 dark:text-gray-100" onClick={handleGoToProfile}>
                        Perfil
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-100" />
                      <span className="cursor-pointer w-full text-gray-700 dark:text-gray-100" onClick={handleLogout}>
                        Cerrar sesión
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink to="/login" className="bg-[#2F93D1] text-white dark:text-gray-100 p-1 rounded-md">
                  Iniciar sesión
                </NavLink>
              )}
              <ThemeToggle />
            </div>
            {/* Mobile Menu Button */}
            <div className=" flex items-center sm:hidden gap-3">
              <ThemeToggle />
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-100 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2F93D1] bg-transparent dark:bg-slate-950"
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
              className="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#2F93D1] hover:text-gray-700 dark:hover:text-gray-100 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Inicio
            </NavLink>



            {auth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-gray-700 dark:text-gray-100">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-100" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-gray-800">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-100" />
                    <span className="cursor-pointer w-full text-gray-700 dark:text-gray-100" onClick={handleGoToProfile}>
                      Perfil
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-100" />
                    <span className="cursor-pointer w-full text-gray-700 dark:text-gray-100" onClick={handleLogout}>
                      Cerrar sesión
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink to="/login" className="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#2F93D1] hover:text-gray-700 dark:hover:text-gray-100 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
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
