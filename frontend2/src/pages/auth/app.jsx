import React, { useState } from "react";
import "./app.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setUser } from "../../middleware/userSlice";
import { fetchClassrooms } from "../../middleware/classroomThunk";

export default function AuthForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validations
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields.");
        return;
      }
    } else {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all fields.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    const postData = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    const endpoint = isLogin
      ? "http://localhost:8000/api/auth/login"
      : "http://localhost:8000/api/auth/signup";

    try {
      const response = await axios.post(
        endpoint,
        JSON.stringify(postData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        const { token, name, id } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        // console.log("ldjfaljsd"+response.data);
        dispatch(setUser({ user: { name: name,id: id }, token }));

        dispatch(fetchClassrooms());

        navigate("/home");
      } else {
        setError(
          response.data.message || "Invalid credentials. Please try again."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          {isLogin ? "Sign in to your account" : "Sign up for an account"}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="inputs block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="inputs block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2 relative flex items-center">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="inputs block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                onChange={handleChange}
              />
              <span
                className="absolute right-3 cursor-pointer select-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2 relative flex items-center">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="inputs block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                  onChange={handleChange}
                />
                <span
                  className="absolute right-3 cursor-pointer select-none"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="submit-btn flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm text-gray-500">
            <span className="bg-white px-2">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="button"
            className="flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <img
              src="https://img.icons8.com/color/48/null/google-logo.png"
              alt="Google Logo"
              className="mr-2 h-4"
            />
            {isLogin ? "Sign In with Google" : "Sign Up with Google"}
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          {isLogin ? (
            <>
              Not a member?{" "}
              <a
                href="#signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
                onClick={(e) => {
                  e.preventDefault();
                  setError("");
                  setIsLogin(false);
                }}
              >
                Sign Up
              </a>
            </>
          ) : (
            <>
              Already a member?{" "}
              <a
                href="#login"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
                onClick={(e) => {
                  e.preventDefault();
                  setError("");
                  setIsLogin(true);
                }}
              >
                Sign In
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
