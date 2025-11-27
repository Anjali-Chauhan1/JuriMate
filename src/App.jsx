import { BrowserRouter, Routes, Route,useLocation , Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LawyerPage from "./pages/LawyerPage";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import './App.css'
import { AppProvider } from "./context/AppContext";

export default function App() {
  function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken"); 
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (!token && !isAuthPage) {
    return <Navigate to="/login" replace />;  
  }

  if (token && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return children;
}

 return (
    <AppProvider>
      <BrowserRouter>
     <Routes>
  {/* PUBLIC ROUTES */}
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />

  {/* PROTECTED ROUTES */}
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    }
  />

  <Route
    path="/lawyers"
    element={
      <ProtectedRoute>
        <LawyerPage />
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<NotFound />} />
</Routes>
    </BrowserRouter>
    </AppProvider>
  )
}
