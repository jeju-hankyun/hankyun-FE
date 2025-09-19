import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OverviewPage from "./pages/overview";
import WorkationManagementPage from "./pages/workation-management";
import CompetitionPage from "./pages/competition";
import OfficeManagementPage from "./pages/office-management";
import PlanManagement from "./pages/plan-management";
import BattleResultsPage from "./pages/battle-results";
import CvcManagementPage from "./pages/cvc/CvcManagement";
import UploadReportPage from "./pages/cvc/UploadReport";
import OrganizationListPage from './pages/organizations/OrganizationList';
import type { SidebarItem, GlobalState } from "./shared/types";
import { logout, getAccessToken, getCvcStatus } from './auth/api';
import type { BaseResponse, CvcStatusResponse, MatchProgressResponse } from './auth/api/interfaces';

// 새로운 디자인 시스템 - 이미지 기반
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const MainLayout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 280px;
  background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 0 24px 24px 0;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 24px;
    background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%);
    border-radius: 0 0 24px 0;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
  
  .logo-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
    font-weight: 700;
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
  }
`;

const SidebarButton = styled.button<{ isActive?: boolean; iconColor?: string }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 8px;
  border: none;
  border-radius: 16px;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
  }
  
  .icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 600;
    background: ${props => props.iconColor || '#8b5cf6'};
    border-radius: 6px;
    color: white;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  background: #f8fafc;
  overflow-y: auto;
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const AuthButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const WorkationDashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [checkedInUsers, setCheckedInUsers] = useState(0);
  const [dDay, setDDay] = useState(0); // 임시 D-Day, 실제 API 연동 필요
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
    // 대시보드 데이터를 가져오는 함수
    const fetchDashboardData = async () => {
      try {
        const today = new Date();
        const targetDate = today.toISOString().split('T')[0];
        const response: BaseResponse<CvcStatusResponse> = await getCvcStatus(targetDate);

        if (response.data) {
          const totalProgress = response.data.progress.reduce((sum: number, p: MatchProgressResponse) => sum + p.progress, 0);
          setProgress(totalProgress / (response.data.progress.length || 1)); // 평균 진행도
          setCheckedInUsers(response.data.matches);
          // notifications는 is_completed가 0인 CVC 매치의 수를 임시로 사용
          setNotifications(response.data.is_completed === 0 ? 1 : 0); 

          // D-Day는 현재 API에서 직접 제공되지 않으므로 임시 값 사용
          // 백엔드에서 다음 워케이션 시작일 등의 정보가 필요합니다.
          setDDay(7); // 예시로 D-7일 설정
        } else {
          console.warn("CVC 상태 데이터를 불러오지 못했습니다.", response.message);
        }
      } catch (error) {
        console.error("대시보드 데이터 로딩 실패:", error);
      }
    };
    fetchDashboardData();
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

  const sidebarItems: SidebarItem[] = [
    { id: "overview", icon: "H", label: "홈", color: "#8b5cf6" },
    { id: "workation", icon: "W", label: "워케이션 관리", color: "#06b6d4" },
    { id: "create-workcation-group", icon: "G", label: "그룹 생성", color: "#ef4444" },
    { id: "plan-management", icon: "P", label: "계획서 관리", color: "#10b981" },
    { id: "cvc-management", icon: "C", label: "CVC 관리", color: "#f59e0b" },
    { id: "upload-report", icon: "R", label: "보고서 업로드", color: "#f97316" },
    { id: "competition", icon: "C", label: "경쟁 현황", color: "#ec4899" },
    { id: "battle-results", icon: "B", label: "대전 결과", color: "#6366f1" },
    { id: "office", icon: "O", label: "제주도 오피스", color: "#84cc16" },
  ];

  const globalState: GlobalState = {
    progress: progress || 0,
    checkedInUsers: checkedInUsers || 0,
    dDay: dDay || 0,
    activeTab,
    notifications: notifications || 0,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewPage globalState={globalState} onNavigate={setActiveTab} />;
      case "workation":
        return <WorkationManagementPage globalState={globalState} onNavigate={setActiveTab} />;
      case "create-workcation-group":
        return <OrganizationListPage />;
      case "plan-management":
        return <PlanManagement />;
      case "cvc-management":
        return <CvcManagementPage />;
      case "upload-report":
        return <UploadReportPage />;
      case "competition":
        return <CompetitionPage globalState={globalState} />;
      case "battle-results":
        return <BattleResultsPage />;
      case "office":
        return <OfficeManagementPage />;
      default:
        return <OverviewPage globalState={globalState} onNavigate={setActiveTab} />;
    }
  };

  return (
    <DashboardContainer>
      <MainLayout>
        <Sidebar>
          <Logo>
            <div className="logo-icon">H</div>
            <div className="logo-text">한켠</div>
          </Logo>
          
          {sidebarItems.map((item) => (
            <SidebarButton
              key={item.id}
              isActive={activeTab === item.id}
              iconColor={item.color}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="icon">{item.icon}</div>
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
    </DashboardContainer>
  );
};

export default WorkationDashboard;
