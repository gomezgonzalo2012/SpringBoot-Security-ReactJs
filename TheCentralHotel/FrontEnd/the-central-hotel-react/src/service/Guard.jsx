

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import APIService from './APIService';


  const ProtectedRoute = ({ element : Component }) => {
  const location = useLocation();

  return APIService.isAuthenticated() ? (
    Component
  ) : (
    <Navigate to="/login" replace state={{ from: location }}/>
  );
};


  const AdminRoute = ({  element: Component }) => {
  const location = useLocation();

  return APIService.isAdmin() && APIService.isAuthenticated ? (
    Component
  ) : (
    <Navigate to="/login" replace state={{ from: location }}/>
  );
};


export {ProtectedRoute, AdminRoute}


