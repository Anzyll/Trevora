import React from "react";
import Header from "./components/Header";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/signup";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};

export default App;
