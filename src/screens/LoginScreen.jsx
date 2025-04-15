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
    <div className="w-screen h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-md h-[448px] border-gray-400 border rounded-md"
      >
        <input
          className="border border-gray-400"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <input
          className="border border-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
          type="password"
        />
        {error && <p className="error-message">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-10 rounded-lg  text-white font-semibold font-roboto mt-5 cursor-pointer ${
            loading ? "bg-gray-400" : "bg-[#2E709E]"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
