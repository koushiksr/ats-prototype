// PrivateRoute.tsx
import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { authState } from "../store/authState";
import Navbar from "./Navbar";

const PrivateRoute: React.FC<{
  children: JSX.Element;
  role: string;
}> = ({ children, role }) => {
  const auth = useRecoilValue(authState);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (auth.role !== role) {
    return <Navigate to="/" />;
  }

  return <Navbar>{children}</Navbar>;
};

export default PrivateRoute;
