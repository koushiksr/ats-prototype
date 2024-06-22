import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../store/authState";
import Home from "./Home";

const HomePage = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthState = localStorage.getItem("authState");
    if (storedAuthState) {
      setAuth(JSON.parse(storedAuthState));
    }
  }, [setAuth]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const roleToPathMap: { [key: string]: string } = {
      Coordinator: "/coordinator",
      Candidate: "/candidate",
      Recruiter: "/recruiter",
      Employer: "/employer",
    };

    const path = roleToPathMap[auth.role];
    if (path) {
      navigate(path);
    }
  }, [auth, navigate]);

  return auth.isAuthenticated ? null : <Home />;
};

export default HomePage;
