import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ user, allowed, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  
  const tipoNormalizado = user.tipo?.toUpperCase(); 
  
  if (!allowed.includes(tipoNormalizado)) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
