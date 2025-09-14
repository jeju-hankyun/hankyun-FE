import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import GoogleAuthCallback from './auth/GoogleAuthCallback';
import WorkationDashboard from './WorkationDashboard';
import { setNavigateFunction } from './auth/api';

const AuthRouter: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<WorkationDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
      {/* 다른 페이지 라우트도 여기에 추가할 수 있습니다. */}
      <Route path="/overview" element={<WorkationDashboard />} />
    </Routes>
  );
};

export default AuthRouter;
