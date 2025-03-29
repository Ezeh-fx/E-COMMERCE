import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SignUp from "../pages/Auth/SignUp";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/Auth/SignIn";
import Verify from "../pages/Auth/Verify";
import HomePage from "../pages/HomePage";
import AdminDashBoard from "../pages/DashBoard/AdminDashBoard";
import DashBoard from "../pages/DashBoard/DashBoard";
// import Orders from "../pages/DashBoard/Order";
import ProtectedRoute from "./ProtectiveRoute";

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
      // <ProtectedRoute>
      <AdminDashBoard />
      // </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashBoard /> }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/Login",
    element: <SignIn />,
  },
  {
    path: "/Verify",
    element: <Verify />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },
]);

export default mainRoute;