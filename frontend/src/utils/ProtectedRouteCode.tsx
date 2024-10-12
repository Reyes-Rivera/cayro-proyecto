import { useAuth } from '@/context/AuthContextType';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRouterVerification = () => {
  const { isVerificationPending, emailToVerify } = useAuth();

  if (!isVerificationPending || !emailToVerify) {
    // Redirigir a la página de registro si no hay verificación pendiente
    return <Navigate to="/login" replace />;
  }

  // Si las condiciones se cumplen, renderiza las rutas protegidas (Outlet)
  return <Outlet />;
};

export default ProtectedRouterVerification;
