import { Outlet, Navigate } from 'react-router-dom'

export const ProtectedRoutes = () => {
  const user = sessionStorage.getItem('user');
  return user ? <Outlet/> : <Navigate to="/login"></Navigate>
}

export const PublicRoutes = () => {
  const user = sessionStorage.getItem('user');
  return user ? <Navigate to="/home"></Navigate> : <Outlet />;
};
