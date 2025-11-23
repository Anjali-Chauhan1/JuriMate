import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
const navigate = useNavigate();
const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://jurimate-1-s6az.onrender.com/api/signup",
        data
      );

      alert("Signup successful! Please login now.");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
          Create Your <span className="text-yellow-400">Jurimate</span> Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className="text-sm font-semibold opacity-80">Full Name</label>
            <input
              required
              className="mt-1 w-full p-3 bg-black/40 border border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="John Doe"
              onChange={(e) =>
                setData({ ...data, name: e.target.value })
              }
            />
          </div>

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
             onClick={() => navigate('/login')}
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
