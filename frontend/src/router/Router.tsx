import { Routes, Route } from "react-router-dom";
import NavBarUser from "../components/web-components/NavBarUser";
import SignUpPage from "@/pages/user/SignUp";
import LoginPage from "@/pages/user/Login";
import PasswordRecoveryPage from "@/pages/user/PasswordRecoveryPage";
import VerificationPage from "@/pages/user/VerificationPage";
import ProtectedRouterVerification from "@/utils/ProtectedRouteCode";
import UserDashboard from "@/pages/user/dashboard/UserDashboard";
import PasswordResetPage from "@/pages/user/PasswordResetPage";
import ProtectedRouterUser from "@/utils/ProtectedRRouterUser";
import ProtectedRouterAdmin from "@/utils/ProtectedRouterAdmin";
import HomePage from "@/pages/web/Home/HomePage";
import { useEffect } from "react";
import { getCompanyInfoApi } from "@/api/company";
import Policies from "@/pages/web/RegulatoryDocuments/Policies";
import Terms from "@/pages/web/RegulatoryDocuments/Terms";
import LegalBoundary from "@/pages/web/RegulatoryDocuments/LegalBoundary";
import ProductDetails from "@/pages/web/ProductDetails";
import ProductsSection from "@/pages/web/products/ProductsSection";
import PageNotFound from "@/pages/web/error/PageNotFound";
import Error500 from "@/pages/web/error/Error500";
import { Footer } from "@/components/web-components/Footer";
import AdminDashboard from "@/pages/employees/dashboard-admin/DashboardLayout";
import AboutPage from "@/pages/web/about/AboutPage";
import ScrollToTop from "./ScrollToTop";
import Error400 from "@/pages/web/error/Error400";
import ContactPage from "@/pages/web/contact/ContactPage";
import EmployeeDashboard from "@/pages/employees/employee/DashboardLayout";
import ProtectedRouterEmployee from "@/utils/ProtectedRouterEmpleado";
import Faq from "@/pages/web/faqs/Faqs";
const AppRoutes = () => {
  useEffect(() => {
    const getInfoPage = async () => {
      const res = getCompanyInfoApi();
      document.title = (await res).data[0]?.title;
    };
    getInfoPage();
  }, []);
  return (
    <>
      <div className="fixed w-full z-50 top-0">
        <NavBarUser />
      </div>
      <div className="container-bg">
        <ScrollToTop />

        <Routes>
          <Route path="/preguntas-frecuentes" element={<Faq />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/aviso-privacidad" element={<Policies />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/deslinde-legal" element={<LegalBoundary />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/registro" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/productos" element={<ProductsSection />} />
          <Route path="/producto/:id" element={<ProductDetails />} />
          <Route
            path="/recuperar-password"
            element={<PasswordRecoveryPage />}
          />
          <Route
            path="/restaurar-password/:token"
            element={<PasswordResetPage />}
          />
          <Route element={<ProtectedRouterEmployee />}>
            <Route path="/perfil-empleado" element={<EmployeeDashboard />} />
          </Route>
          <Route element={<ProtectedRouterAdmin />}>
            <Route path="/perfil-admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRouterUser />}>
            <Route path="/perfil-usuario" element={<UserDashboard />} />
          </Route>

          <Route element={<ProtectedRouterVerification />}>
            <Route path="/codigo-verificacion" element={<VerificationPage />} />
            <Route
              path="/codigo-verificacion-auth"
              element={<VerificationPage />}
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/500" element={<Error500 />} />
          <Route path="/400" element={<Error400 />} />
        </Routes>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </>
  );
};

export default AppRoutes;
