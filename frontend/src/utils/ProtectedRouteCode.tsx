import { useAuth } from '@/context/AuthContextType';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRouterVerification = () => {
  const { isVerificationPending, emailToVerify } = useAuth();
  if (!isVerificationPending || !emailToVerify) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRouterVerification;
