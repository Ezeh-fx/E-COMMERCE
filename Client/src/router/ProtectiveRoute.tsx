import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React, { PropsWithChildren, useMemo } from "react";
import { Rootstate } from "../global/store";

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const user  = useSelector((state: Rootstate) => state.change.user);
   
  const isAuthenticated = useMemo(() => !!user, [user]);

  return isAuthenticated ? <>{children}</> : <Navigate to="/Login" replace />;
};

export default ProtectedRoute;