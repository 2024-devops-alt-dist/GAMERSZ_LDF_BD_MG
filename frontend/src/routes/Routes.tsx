import { Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/Login';
import Homepage from '../pages/Homepage';
import React from 'react';

const Router: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default Router;
