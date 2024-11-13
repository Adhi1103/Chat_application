import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 animate-fade-in">
          Welcome to <span className="text-yellow-300">ChatApp</span>
        </h1>
        <p className="text-lg max-w-md mx-auto animate-fade-in delay-100">
          Stay connected with your loved ones and make new friends around the world!
        </p>
      </div>
      <div className="mt-10 flex space-x-6 animate-fade-in delay-200">
       <Link to={"/signin"}> <button className="px-8 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105">
          Sign In
        </button></Link>
        <Link to={"/signup"}><button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105">
          Sign Up
        </button></Link>
      </div>
    </div>
  );
};

export default LandingPage;
