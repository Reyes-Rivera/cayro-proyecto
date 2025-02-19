import { useAuth } from '@/context/AuthContextType';
import { Outlet, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRouterAdmin = () => {
    const { auth, loading, user } = useAuth();
    if (loading) {
        return <div className="w-full h-screen flex justify-center items-center">
           <Loader2 className="w-12 h-12 text-[#0099FF] animate-spin mb-4" />
        </div>;
    }

    if (!auth || user?.role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRouterAdmin;