// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/helper/ProtectedRoute";
import Navbar from './components/helper/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import MyCalendar from "./components/MyCalendar";
import SharedCalendar from "./components/SharedCalendar";
import Conflicts from "./components/Conflicts";
import Requests from "./components/Requests";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/my-cal" element={<ProtectedRoute element={<MyCalendar />} />} />
          <Route path="/shared-cal" element={<ProtectedRoute element={<SharedCalendar />} />} />
          <Route path="/conflicts" element={<ProtectedRoute element={<Conflicts />} />} />
          <Route path="/requests" element={<ProtectedRoute element={<Requests />} />} />
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;