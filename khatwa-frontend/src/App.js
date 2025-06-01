import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ChallengeForm from './pages/ChallengeForm';
import ChallengeList from './pages/ChallengeList';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div>
        <h1>Khatwa App</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/challenges" element={token ? <ChallengeList /> : <Navigate to="/login" />} />
          <Route path="/create-challenge" element={token ? <ChallengeForm /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
