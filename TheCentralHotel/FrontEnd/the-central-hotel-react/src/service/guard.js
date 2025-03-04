

// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import APIService from './APIService';


//   const ProtectedRoute = ({ element : Component }) => {
//   const location = useLocation();

//   return APIService.isAuthenticated() ? (
//     Component
//   ) : (
//     <Navigate to="/login" replace state={{ from: location }}/>
//   );
// };


//   const AdminRoute = ({  element: Component }) => {
//   const location = useLocation();

//   return APIService.isAdmin() ? (
//     Component
//   ) : (
//     <Navigate to="/login" replace state={{ from: location }}/>
//   );
// };


// export {ProtectedRoute, AdminRoute}



import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import APIService from './APIService';
import { jsx as _jsx } from "react/jsx-runtime";
const ProtectedRoute = ({
  element: Component
}) => {
  const location = useLocation();
  return APIService.isAuthenticated() ? Component : /*#__PURE__*/_jsx(Navigate, {
    to: "/login",
    replace: true,
    state: {
      from: location
    }
  });
};
const AdminRoute = ({
  element: Component
}) => {
  const location = useLocation();
  return APIService.isAdmin() ? Component : /*#__PURE__*/_jsx(Navigate, {
    to: "/login",
    replace: true,
    state: {
      from: location
    }
  });
};
export { ProtectedRoute, AdminRoute };