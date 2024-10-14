import {Routes, Route} from "react-router-dom";
import NavBarUser from '../components/web-components/NavBarUser';
import Footer from "@/components/web-components/Footer";
import SignUpPage from "@/pages/user/SignUp";
import LoginPage from "@/pages/user/Login";
import PasswordRecoveryPage from "@/pages/user/PasswordRecoveryPage";
import VerificationPage from "@/pages/user/VerificationPage";
import ProtectedRouterVerification from "@/utils/ProtectedRouteCode";
import UserDashboard from "@/pages/user/dashboard/UserDashboard";
import ProtectedRouterAdmin from "@/utils/ProtectedRRouterUser";
const AppRoutes = () => {
  return (
    <>
        <div className="fixed w-full z-50 top-0">
           <NavBarUser/> 
        </div>
        <div className="mt-12 container-bg">
            <Routes>
                <Route path='/sign-up' element={<SignUpPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/password-recovery' element={<PasswordRecoveryPage/>}/>
                <Route element={<ProtectedRouterAdmin/>}>
                  <Route path="/user-profile" element={<UserDashboard/>}/>
                </Route>
                <Route element={<ProtectedRouterVerification/>}>
                  <Route path="/verification-code" element={<VerificationPage/>}/>
                  <Route path="/verification-code-auth" element={<VerificationPage/>}/>
                </Route>
            </Routes>
        </div>
        <div className="w-full">
          <Footer/>
        </div>
    </>
  )
}

export default AppRoutes