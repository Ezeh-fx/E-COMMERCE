import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SignUp from "../pages/Auth/SignUp";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/Auth/SignIn";
import Verify from "../pages/Auth/Verify";
import HomePage from "../pages/HomePage";
import AdminDashBoard from "../pages/DashBoard/AdminDashBoard";
import DashBoard from "../pages/DashBoard/DashBoard";
import Orders from "../pages/DashBoard/Order";
import ProtectedRoute from "./ProtectiveRoute"; // Fixed import
import ForgotPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import Product from "../pages/Product";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import AddProductModal from "../pages/DashBoard/AddProductModal";
import User from "../pages/DashBoard/User";
import Settings from "../pages/DashBoard/Setting";

const mainRoute = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/product",
        element: <Product />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/cart",
        element : <Cart />
      }, 
      {
        path: "/order",
        element: <Order />,
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashBoard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: "/admin/orders",
        element: <Orders />,
      },
      {
        path: "/admin/users",
        element: <User />,
      },
      {
        path: "/admin/settings",
        element: <Settings />,
      },
      {
        path: "/admin/products",
        element: <AddProductModal isOpen={true} onClose={() => {}} onAddProduct={(product) => { console.log(product); }} />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

export default mainRoute;
