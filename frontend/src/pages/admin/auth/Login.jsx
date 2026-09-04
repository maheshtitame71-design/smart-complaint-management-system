import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      if (response.data.success) {
        // Save token
        localStorage.setItem("token", response.data.token);

        // Save user information
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        // Get user role
        const role = response.data.user.role;

        console.log("ROLE:", role);

        // Navigate according to role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "staff") {
          navigate("/staff/dashboard");
        } else if (role === "user") {
          navigate("/user/dashboard");
        } else {
          console.log("Unknown role:", role);
        }
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">

      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">

        {/* Heading */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Login Form */}
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >

          <div className="space-y-4 rounded-md">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>

        </form>

        {/* Register Link */}
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;