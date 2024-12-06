import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute() {
  const { authTokens } = React.useContext(AuthContext);
  return authTokens ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
