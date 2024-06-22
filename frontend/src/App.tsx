import { Routes, Route, Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "./store/authState";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute";

import CoordinatorComponent from "./components/Coordinator";
import RecruitersComponent from "./components/Recruiters";
import Employer from "./components/Employer";
import Candidate from "./components/Candidate";
import axios from "axios";

function App() {
  const [auth, setAuth] = useRecoilState(authState);
  const token = JSON.parse(localStorage.getItem("authState") || "{}").token;
  axios.defaults.headers.common["Authorization"] = token;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login setAuth={setAuth} />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/coordinator"
        element={
          <PrivateRoute role="Coordinator">
            <CoordinatorComponent />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter"
        element={
          <PrivateRoute role="Recruiter">
            <RecruitersComponent />
          </PrivateRoute>
        }
      />
      <Route
        path="/employer"
        element={
          <PrivateRoute role="Employer">
            <Employer />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidate"
        element={
          <PrivateRoute role="Candidate">
            <Candidate />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
