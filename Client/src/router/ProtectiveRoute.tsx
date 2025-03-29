import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React, { PropsWithChildren, useMemo } from "react";
import { RootState } from "../global/store"; // Ensure correct import

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.user); // Corrected state path

  const isAuthenticated = useMemo(() => !!user, [user]);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;