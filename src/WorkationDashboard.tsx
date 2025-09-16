import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OverviewPage from "./pages/overview";
import WorkationManagementPage from "./pages/workation-management";
import CompetitionPage from "./pages/competition";
import OfficeManagementPage from "./pages/office-management";
import PlanManagement from "./pages/plan-management";
import BattleResultsPage from "./pages/battle-results";
import {
  DashboardContainer,
  MainLayout,
  Sidebar,
  SidebarButton,
  SidebarIcon,
  MainContent,
  NotificationWidget,
} from "./shared/globalStyles";
import type { SidebarItem, GlobalState } from "./shared/types";
import { logout, getAccessToken } from './auth/api';

const SidebarFooter = styled.div`
  margin-top: auto; /* Push footer to the bottom */
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const AuthButton = styled.button`
  background-color: #4a90e2;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ae8;
  }
`;

const WorkationDashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(78);
  const [checkedInUsers] = useState(8);
  const [dDay] = useState(3);
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications] = useState(4);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      alert("로그아웃되었습니다.");
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const sidebarItems: SidebarItem[] = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "workation", icon: "✅", label: "워케이션 관리" },
    { id: "competition", icon: "🏆", label: "경쟁 현황" },
    { id: "battle-results", icon: "⚔️", label: "대전 결과" },
    { id: "office", icon: "🏢", label: "제주도 오피스" },
    { id: "plan", icon: "📋", label: "계획서 관리" },
  ];

  const globalState: GlobalState = {
    progress,
    checkedInUsers,
    dDay,
    activeTab,
    notifications,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewPage globalState={globalState} onNavigate={setActiveTab} />;
      case "workation":
        return <WorkationManagementPage globalState={globalState} onNavigate={setActiveTab} />;
      case "competition":
        return <CompetitionPage globalState={globalState} />;
      case "battle-results":
        return <BattleResultsPage />;
      case "office":
        return <OfficeManagementPage />;
      case "plan":
        return <PlanManagement />;
      default:
        return <OverviewPage globalState={globalState} onNavigate={setActiveTab} />;
    }
  };

  return (
    <DashboardContainer>
      <MainLayout>
        <Sidebar>
          {sidebarItems.map((item) => (
            <SidebarButton
              key={item.id}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            >
              <SidebarIcon>{item.icon}</SidebarIcon>
              {item.label}
            </SidebarButton>
          ))}
          <SidebarFooter>
            {isLoggedIn ? (
              <AuthButton onClick={handleLogoutClick}>로그아웃</AuthButton>
            ) : (
              <AuthButton onClick={handleLoginClick}>로그인</AuthButton>
            )}
          </SidebarFooter>
        </Sidebar>

        <MainContent>{renderContent()}</MainContent>
      </MainLayout>

      <NotificationWidget>🔔 {notifications} issues</NotificationWidget>
    </DashboardContainer>
  );
};

export default WorkationDashboard;
