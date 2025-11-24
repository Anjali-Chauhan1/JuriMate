import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
     const navigate = useNavigate();
     const [data, setData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://jurimate-1-s6az.onrender.com/api/login",
        data
      );

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      alert("Login successful");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
          Welcome Back to <span className="text-yellow-400">Jurimate</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-semibold opacity-80">Email Address</label>
            <input
              required
              type="email"
              className="mt-1 w-full p-3 bg-black/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="example@mail.com"
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold opacity-80">Password</label>
            <input
              required
              type="password"
              className="mt-1 w-full p-3 bg-black/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="••••••••"
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-yellow-500 text-black font-semibold text-lg hover:bg-yellow-400 transition-all shadow-lg"
         

          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <a href="/signup" className="text-yellow-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
