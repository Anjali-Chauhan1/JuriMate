import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Login() {
     const navigate = useNavigate();
     const [data, setData] = useState({ email: "", password: "" });
     const [loading, setLoading] = useState(false);
     const { login } = useApp();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://jurimate-1-s6az.onrender.com/api/login",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      login(res.data.accessToken, res.data.refreshToken, res.data.user);

      alert("Login successful");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

        
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
          Welcome Back to <span className="text-white">JuriMate</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          
          <div>
            <label className="text-sm font-semibold opacity-80">Email Address</label>
            <input
              required
              type="email"
              className="mt-1 w-full p-3 bg-black/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 outline-none"
              placeholder="example@mail.com"
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-semibold opacity-80">Password</label>
            <input
              required
              type="password"
              className="mt-1 w-full p-3 bg-black/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 outline-none"
              placeholder="••••••••"
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
            />
          </div>

         
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
