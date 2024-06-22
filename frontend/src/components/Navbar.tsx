// Navbar.tsx
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../store/authState";

const Navbar: React.FC = ({ children }) => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null, role: "" });
    localStorage.removeItem("authState");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gray-800 p-2  flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <h1 className="text-white text-lg font-bold">
            Job Portal - {auth.role}
          </h1>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white text-sm py-2 px-6 rounded-lg hover:bg-red-700 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
      {children}
    </>
  );
};

export default Navbar;
