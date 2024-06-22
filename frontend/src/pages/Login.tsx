// Login.tsx
import { useEffect, useState } from "react";
import { login } from "../services/authService";
import { useRecoilState } from "recoil";
import { authState } from "../store/authState";
import { Navigate, Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";

const Login = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const storedAuthState = localStorage.getItem("authState");
    if (storedAuthState) {
      const authState = JSON.parse(storedAuthState);
      setAuth(authState);
    }
  }, [setAuth]);
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        const response = await login(
          values.email,
          values.password || "Koushik@123"
        );
        setAuth({
          isAuthenticated: true,
          role: response.role,
          token: response.token,
          username: response.user,
          email: response.email,
        });
        localStorage.setItem(
          "authState",
          JSON.stringify({
            isAuthenticated: true,
            role: response.role,
            token: response.token,
            username: response.user,
            email: response.email,
          })
        );
        localStorage.setItem("email", response.email);
      } catch (error: any) {
        setError(error.message);
      }
    },
  });

  if (auth.isAuthenticated) {
    return <Navigate to="/protected-route" />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-lg ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-lg ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-150 mb-4"
          >
            Login
          </button>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
        </form>
        <div className="text-center mt-4">
          <Link to="/register" className="text-blue-500 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
