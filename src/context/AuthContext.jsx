import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ensure this is true at first

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Safely parse the stored user data
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
    setLoading(false); // Set loading false only after reading localStorage
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children} {/* Block children until auth is ready */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
