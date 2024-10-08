import {Routes, Route} from "react-router-dom";
import NavBarUser from '../components/web-components/NavBarUser';
import Footer from "@/components/web-components/Footer";
import SignUpPage from "@/pages/user/SignUp";
const AppRoutes = () => {
  return (
    <>
        <div className="fixed w-full z-50 top-0">
           <NavBarUser/> 
        </div>
        <div className="mt-12 container-bg">
            <Routes>
                <Route path='sign-up' element={<SignUpPage/>}/>
            </Routes>
        </div>
        <div className="w-full">
          <Footer/>
        </div>
    </>
  )
}

export default AppRoutes