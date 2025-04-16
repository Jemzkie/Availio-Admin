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
    <div className="w-screen h-screen flex items-center font-inter justify-center">
      <form
        onSubmit={handleLogin}
        className="w-md h-auto gap-2 flex flex-col p-5 border-gray-400 border rounded-md"
      >
        <div className="w-full flex flex-col items-center justify-center">
          <img
            className="w-[50%] h-24 object-contain pointer-events-none"
            src="./AvailioL.png"
          />
          <label className="text-2xl">Admin Login</label>
        </div>
        <div className="flex flex-col gap-1">
          <label>Email</label>
          <input
            className="border px-4 py-2 rounded-sm border-gray-400"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Password</label>
          <input
            className="border px-4 py-2 rounded-sm border-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            type="password"
          />
        </div>

        <div className="flex justify-center">
          {error && (
            <p className="text-red-600 bg-red-100 px-2 rounded-md py-1">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-10 rounded-lg hover:bg-[#E60000] duration-300 text-white font-semibold font-roboto cursor-pointer ${
            loading ? "bg-gray-400" : "bg-[#141414]"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
