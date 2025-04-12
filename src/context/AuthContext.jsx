// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Example: check if user is already logged in (optional)
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/check-auth", {
//           withCredentials: true,
//         });
//         setUser(res.data.user); // assumes backend sends user info
//       } catch (err) {
//         setUser(null);
//       }
//     };
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Custom hook to access auth context
// export const useAuth = () => useContext(AuthContext);
