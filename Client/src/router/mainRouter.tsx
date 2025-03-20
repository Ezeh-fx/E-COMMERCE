import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SignUp from "../pages/Auth/SignUp";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/Auth/SignIn";

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
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default mainRoute;