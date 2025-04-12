import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Link from "./pages/Link";
import Redirect from "./pages/Redirect";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ✅ Optional Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/link/:id",
        element: <Link />,
      },
      {
        path: "/:id",
        element: <Redirect />,
      },
    ],
  },
]);

function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading app...</div>;
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
