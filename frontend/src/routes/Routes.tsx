import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import { Home } from '../pages/Home';
import LoginPage from '../pages/Login';
import Homepage from '../pages/Homepage';
import React from 'react';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
