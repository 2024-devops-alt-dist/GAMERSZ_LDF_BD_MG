import { Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/Login';
import Homepage from '../pages/Homepage';
import React from 'react';
import SignupPage from '../pages/Signup';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/register" element={<SignupPage />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default Router;
