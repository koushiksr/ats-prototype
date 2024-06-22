import axios from "axios";

export const register = async (
  username: string,
  email: string,
  password: string,
  role: string
): Promise<any> => {
  try {
    const response = await axios.post("/api/auth/register", {
      username,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<any> => {
  const response = await axios.post("/api/auth/login", { email, password });
  return {
    role: response.data.role,
    username: response.data.username,
    token: response.data.token,
    email: response.data.email,
    id: response.data.id,
  };
};

export const validateToken = async (token: string): Promise<any> => {
  try {
    const response = await axios.post("/api/validateToken", {
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Error validating token:", error);
    throw error;
  }
};
