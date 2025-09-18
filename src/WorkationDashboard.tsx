import styled from "@emotion/styled";
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
import { logout, getAccessToken, getCvcStatus } from './auth/api';
import type { BaseResponse, CvcStatusResponse, MatchProgressResponse } from './auth/api/interfaces';

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
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "workation", icon: "✅", label: "워케이션 관리" },
    { id: "create-workcation-group", icon: "➕", label: "그룹 생성" },
    { id: "plan-management", icon: "📋", label: "계획서 관리" },
    { id: "cvc-management", icon: "⚙️", label: "CVC 관리" },
    { id: "upload-report", icon: "📄", label: "보고서 업로드" },
    { id: "competition", icon: "🏆", label: "경쟁 현황" },
    { id: "battle-results", icon: "⚔️", label: "대전 결과" },
    { id: "office", icon: "🏢", label: "제주도 오피스" },
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
