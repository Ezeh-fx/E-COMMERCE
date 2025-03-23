import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SignUp from "../pages/Auth/SignUp";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/Auth/SignIn";
import Verify from "../pages/Auth/Verify";

const mainRoute = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <SignUp />,
      },
      {
        path: "/Login",
        element: <SignIn />,
      },
      {
        path: "/Verify",
        element: <Verify />,
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default mainRoute;