import { Loader as LoaderIcon } from 'lucide-react';

const Loader = () => {
  return (
    <div 
      className="h-screen z-50 flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900"
      role="alert"
      aria-live="assertive"
      aria-label="Cargando contenido"
    >
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Spinner optimizado - transform GPU acelerado */}
        <div 
          className="absolute w-full h-full border-4 border-blue-100 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"
          style={{ 
            transform: 'translateZ(0)', // Aceleración GPU
            backfaceVisibility: 'hidden' // Mejor rendimiento
          }}
          aria-hidden="true"
        />
        
        {/* Icono con reducción de movimiento */}
        <LoaderIcon 
          className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse motion-reduce:animate-none" 
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </div>
      
      {/* Texto con soporte para preferencias de reducción de movimiento */}
      <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse motion-reduce:animate-none">
        Cargando...
      </p>
    </div>
  );
};

export default Loader;
