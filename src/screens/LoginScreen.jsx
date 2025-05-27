import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../hooks/service/userService";
import { fetchUserEmail } from "../hooks/data/userData";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setError("");

    const userRequest = await fetchUserEmail(email);
    if (!userRequest.success) {
      setError(userRequest.message);
      setLoading(false);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }

    const response = await loginUser(email.trim(), password.trim());
    setLoading(false);

    if (response.success) {
      navigate("/dashboard");
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center font-inter justify-center bg-[#ed1c24]">
      <form
        onSubmit={handleLogin}
        className="w-md h-auto gap-4 flex flex-col p-8 bg-white rounded-lg shadow-xl"
      >
        <div className="w-full flex flex-col items-center justify-center gap-4">
          {/* TODO: Replace with your actual logo image */}
          <div className="w-48 h-24 bg-black/5 rounded-lg flex items-center justify-center">
            <img
              className="max-h-full max-w-full object-contain"
              src="./AvailioL.png"
              alt="Logo"
            />
          </div>
          <label className="text-2xl font-semibold text-black">Admin Login</label>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium">Email</label>
          <input
            className="border px-4 py-2 rounded-md border-gray-300 focus:border-[#ed1c24] focus:outline-none transition-colors duration-300"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="Enter your email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-black font-medium">Password</label>
          <input
            className="border px-4 py-2 rounded-md border-gray-300 focus:border-[#ed1c24] focus:outline-none transition-colors duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex justify-center">
          {error && (
            <p className="text-[#ed1c24] bg-red-50 px-4 py-2 rounded-md text-sm">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-10 rounded-md text-white font-semibold transition-colors duration-300 ${
            loading ? "bg-gray-400" : "bg-[#ed1c24] hover:bg-[#ed1c24]/90"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
