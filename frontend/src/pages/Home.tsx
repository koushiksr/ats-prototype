import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../store/authState";
// import Home from "../pages/Home";

const Home = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthState = localStorage.getItem("authState");
    if (storedAuthState) {
      const authState = JSON.parse(storedAuthState);
      setAuth(authState);
    }
  }, [setAuth]);
  useEffect(() => {
    if (auth.isAuthenticated) {
      // Conditional redirection based on user role
      const timer = setTimeout(() => {
        switch (auth.role) {
          case "admin":
            navigate("/admin");
            break;
          case "coordinator":
            navigate("/coordinator");
            break;
          case "candidate":
            navigate("/candidate");
            break;
          case "recruiter":
            navigate("/recruiter");
            break;
          case "employer":
            navigate("/employer");
            break;
          default:
            navigate("/");
        }
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [auth, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="flex flex-col justify-center items-center gap-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          <span className="mr-2 text-blue-500"></span> Job Portal
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Find your dream job or hire the perfect candidate.
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <Link to="/login">
          <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Login
            <svg
              className="ml-2 -mr-1 w-4 h-4 inline-block"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 16l-4-4v10h10v-10z" fill="currentColor"></path>
            </svg>
          </button>
        </Link>
        <Link to="/register">
          <button className="w-full py-2 px-4 border border-teal-500 text-teal-500 rounded-md hover:bg-teal-100 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            Register
            <svg
              className="ml-2 -mr-1 w-4 h-4 inline-block"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 0-2-2V8a2 2 0 0 1 2-2zM10 13v-2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
