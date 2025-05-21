import { Loader as LoaderIcon } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Spinner con efecto de pulso */}
        <div className="absolute w-full h-full border-4 border-blue-100 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Icono de Lucide perfectamente centrado */}
        <LoaderIcon 
          className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" 
          strokeWidth={2.5}
        />
      </div>
      
      {/* Texto opcional con animación */}
      <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
        Cargando...
      </p>
    </div>
  );
};

export default Loader;
