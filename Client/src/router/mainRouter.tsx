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

const mainRoute = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
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
      { index: true, element: <DashBoard /> },
      { path : "/orders", element: <Orders /> },
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
]);

export default mainRoute;