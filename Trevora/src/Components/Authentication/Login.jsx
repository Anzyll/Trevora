// src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const signupForm = () => {
    navigate("/signup");
  };
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">Log in.</h1>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Email *
            </label>
            <input
              type="email"
              className="w-full px-3 py-2  border-b-2 border-gray-900  focus:outline-none "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-900 mb-2">
              Password *
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border-b-2 border-gray-900  focus:outline-none"
              required
            />
          </div>

          <button
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
