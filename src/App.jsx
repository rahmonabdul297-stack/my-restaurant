import { BrowserRouter, Link, Route, Routes } from "react-router";
import GeneralLayout from "./layouts/GeneralLayout";
import HomePage from "./pages/home";
import Signup from "./pages/signup";

import { ToastContainer } from "react-toastify";
import Signin from "./pages/signin";
import AboutPage from "./pages/about";
import { useContext } from "react";
import { ThemeContext } from "./context/context";
import TeamPage from "./pages/order";
import OrderFoodPage from "./pages/order";
import FoodPage from "./pages/food";
import OrdersPage from "./Admin/orders";
import Foods from "./Admin/foods";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./Admin/dashboard";
import AdminMenu from "./Admin/menu";
import Adminlogin from "./pages/adminlogin";
import AuthLayout from "./layouts/AuthLayout";
import AdminUsers from "./Admin/users";
import Aboutadmin from "./Admin/aboutadmin";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaAngleDoubleUp } from "react-icons/fa";
import ProfilePage from "./pages/profile";

function App() {
  const { dark } = useContext(ThemeContext);
  return (
    <>
      <div
        className={
          dark
            ? "bg-AppGray overflow-x-hidden "
            : "bg-AppWhite overflow-x-hidden"
        }
      >
        <BrowserRouter>
          <div>
            <Link to="/">
              <FaAngleDoubleUp
                size={20}
                className="fixed bottom-20 right-7 lg:right-12  z-50 text-AppRed mb-2 animate-bounce"
              />
            </Link>
            <Link
              to="https://wa.me/+2347089136508"
              className="fixed bottom-10 right-5 lg:right-10  z-50 bg-AppWhite p-1  border border-AppRed shadow-AppRed rounded-[50%] text-green-500 animate-pulse"
            >
              {" "}
              <IoLogoWhatsapp size={30} />
            </Link>
          </div>

          <ToastContainer
            theme={dark ? "dark" : "light"}
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            width={50}
          />
          <Routes>
            {/* Auth  */}
            <Route element={<AuthLayout />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="adminlogin" element={<Adminlogin />} />
            </Route>
            {/* Admin Dashboard */}
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/foods" element={<Foods />} />
              <Route path="/menu" element={<AdminMenu />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/aboutadmin" element={<Aboutadmin />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
            </Route>
            <Route element={<GeneralLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/food" element={<FoodPage />} />
              <Route path="/order" element={<OrderFoodPage />} />
              <Route path="/order-food" element={<OrderFoodPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
