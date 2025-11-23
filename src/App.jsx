import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LawyerPage from "./pages/LawyerPage";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import './App.css'
import { AppProvider } from "./context/AppContext";

export default function App() {
  function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); 
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
 return (
    <AppProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={localStorage.getItem("token") ? <Home /> : <Navigate to="/signup" replace />} />
        <Route path="/lawyers" element={localStorage.getItem("token") ? <LawyerPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </AppProvider>
  )
}
