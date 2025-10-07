// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import axios from "axios";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const signupForm = () => {
    navigate("/signup");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!form.email.trim() || !form.email.includes("@")) {
      newErrors.email = "invalid email";
    }

    if (form.password.length < 8) newErrors.password = "invalid password";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      const response = await axios.get("http://localhost:5001/users");
      const users = response.data;
      const user = users.find((user) => user.email === form.email);
      if (!user) {
        setErrors({ general: "incorrect email or password" });
        return;
      }
      const matchesPassword = await bcrypt.compare(
        form.password,
        user.password
      );
      if (!matchesPassword) {
        setErrors({ general: "incorrect email or password" });
        return;
      }
      alert("login succesfully");
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      setErrors({ general: "something went wrong. Please try again" });
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">Log in.</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Email *
            </label>
            <input
              type="email"
              className="w-full px-3 py-2  border-b-2 border-gray-900  focus:outline-none "
              name="email"
              placeholder="enter your email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-sm text-red-800">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Password *
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border-b-2 border-gray-900  focus:outline-none"
              name="password"
              placeholder="enter your password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-sm text-red-800">{errors.password}</p>
            )}
          </div>
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-600 text-center">
                {errors.general}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-normal text-base"
          >
            Log in
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Don't have an account?</p>
          <button
            className="text-gray-900 hover:text-gray-700 underline font-normal text-base"
            onClick={signupForm}
          >
            Create One Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;
