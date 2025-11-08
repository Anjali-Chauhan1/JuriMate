import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LawyerPage from "./pages/LawyerPage";
import NotFound from "./pages/NotFound";
import './App.css'
import { AppProvider } from "./context/AppContext";

export default function App() {

  return (
    <AppProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lawyers" element={<LawyerPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </AppProvider>
  )
}
