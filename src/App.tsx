import "./App.css";
import WorkationDashboard from "./WorkationDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import GoogleAuthCallback from "./auth/GoogleAuthCallback";
import React from 'react'; // React 임포트 추가
import { logout } from './auth/api'; // logout 함수 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

const WorkationDashboardWithLogout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      alert("로그아웃되었습니다.");
      navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <WorkationDashboard />
      <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px', cursor: 'pointer' }}>
        로그아웃
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkationDashboardWithLogout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        {/* 다른 페이지 라우트도 여기에 추가할 수 있습니다. */}
        <Route path="/overview" element={<WorkationDashboardWithLogout />} /> {/* overview도 WorkationDashboardWithLogout으로 연결 */}
      </Routes>
    </Router>
  );
}

export default App;
