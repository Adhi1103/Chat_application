import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Signup } from './pages/signup.tsx';
import { Signin } from './pages/signin.tsx';
import { Friend } from './pages/friends.tsx';
import { AddFriend } from './pages/add_friends.tsx';
import { Message } from './pages/message.tsx';
import LandingPage from './pages/landing.tsx';
import { Testing } from './pages/testing.tsx';

function App() {
  // State to manage authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  // Check for token on initial load and set the authentication status
  useEffect(() => {
    const token = localStorage.getItem("JWT");
    setIsAuthenticated(!!token);
  }, []);

   const  handleLogin = () => {
    const token = localStorage.getItem("JWT");
    setIsAuthenticated(!!token); // Update auth state after login
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
        <Route path="/signin" element={<Signin onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/friends"
          element={isAuthenticated ? <Friend selectedFriend='?' /> : <LandingPage />}
        />
        <Route
          path="/add/friends"
          element={isAuthenticated ? <AddFriend /> : <LandingPage />}
        />
        <Route
          path="/message/:username"
          element={isAuthenticated ? <Message /> : <LandingPage />}
        />

        {/* Landing Page Route */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to={"/friends"}/> : <LandingPage />}
        />
        <Route path="/landing" element={<LandingPage/>}></Route>
        <Route path="/testing" element={<Testing></Testing>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
