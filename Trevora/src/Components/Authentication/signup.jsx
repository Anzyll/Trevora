// src/pages/Signup.jsx
import React from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  //state to hold form input values
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
  });
  const [error, setError] = useState({}); //state to hold validation errors
  const navigate = useNavigate();
  const loginForm = () => {
    navigate("/login");
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate form input before submitting
  const validateSignup = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "name is required";
    if (!form.email.includes("@")) newErrors.email = "invalid email";
    if (form.password.length < 8) {
      newErrors.password = "password must be atleast 8 charecters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password =
        "Password must include at least one uppercase letter";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password =
        "Password must include at least one uppercase letter";
    } else if (!/\d/.test(form.password)) {
      newErrors.password = "Password must include at least one number";
    } else if (!/[@#$%&*]/.test(form.password)) {
      newErrors.password =
        "Password must include at least one special charecter";
    }
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "password do not match";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateSignup();
    setError(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // If no validation errors, proceed
      try {
        const existingUsers = await axios.get("http://localhost:3001/users");
        if (existingUsers.data.some((user) => user.email === form.email)) {
          setError({ email: "Email already exists" });
          return;
        }

        const hashedPassword = await bcrypt.hash(form.password, 10); // Hash password before saving
        const newUser = {
          fullName: form.fullName,
          email: form.email,
          password: hashedPassword,
          cart:[],
        };
        // Send POST request to store new user
        const response = await axios.post(
          "http://localhost:3001/users",
          newUser
        );
        alert("registered succesfully");
        setError({});
        navigate("/login");
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">
          Create an Account.
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border-b-2 border-gray-900  focus:outline-none placeholder:text-sm"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {error.fullName && (
              <p className="text-red-800 text-sm">{error.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border-b-2 border-gray-900  focus:outline-none placeholder:text-sm"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
            {error.email && (
              <p className="text-red-800 text-sm">{error.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border-b-2 border-gray-900  focus:outline-none placeholder:text-sm"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter new Password"
            />
            {error.password && (
              <p className="text-red-800 text-sm">{error.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border-b-2 border-gray-900 focus:outline-none placeholder:text-sm"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="confirm your new Password"
            />
            {error.confirmPassword && (
              <p className="text-red-800 text-sm">{error.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-normal text-base"
            onClick={handleSubmit}
          >
            Create Account
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <button
              className="text-gray-900 hover:text-gray-700 underline font-normal text-base"
              onClick={loginForm}
            >
              Login Now
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Signup;
