import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/Auth/login", {
      email,
      password,
    });

    const data = response.data;

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    const userData = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (name, email, password) => {
    const response = await api.post("/Auth/register", {
      name,
      email,
      password,
    });

    const data = response.data;

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    const userData = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}