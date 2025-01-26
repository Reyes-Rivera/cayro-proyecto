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
import Contact from "@/pages/web/Contact";
import ProductDetails from "@/pages/web/ProductDetails";
import ProductsSection from "@/pages/web/products/ProductsSection";
import PageNotFound from "@/pages/web/error/PageNotFound";
import Error500 from "@/pages/web/error/Error500";
import { Footer } from "@/components/web-components/Footer";
import AdminDashboard from "@/pages/employees/dashboard-admin/DashboardLayout";
import AboutPage from "@/pages/web/about/AboutPage";
import ScrollToTop from "./ScrollToTop";
import Error400 from "@/pages/web/error/Error400";
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
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<Policies />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/legal" element={<LegalBoundary />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsSection />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
          <Route
            path="/reset-password/:token"
            element={<PasswordResetPage />}
          />

          <Route element={<ProtectedRouterAdmin />}>
            <Route path="/admin-profile" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRouterUser />}>
            <Route path="/user-profile" element={<UserDashboard />} />
          </Route>

          <Route element={<ProtectedRouterVerification />}>
            <Route path="/verification-code" element={<VerificationPage />} />
            <Route
              path="/verification-code-auth"
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
