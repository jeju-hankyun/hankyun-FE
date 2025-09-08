import { useState, useEffect } from "react";
import OverviewPage from "./pages/overview";
import WorkationManagementPage from "./pages/workation-management";
import CompetitionPage from "./pages/competition";
import OfficeManagementPage from "./pages/office-management";
import PlanManagement from "./pages/plan-management";
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

const WorkationDashboard = () => {
  const [progress, setProgress] = useState(78);
  const [checkedInUsers] = useState(8);
  const [dDay] = useState(3);
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications] = useState(4);

  // 실시간 진행률 업데이트 시뮬레이션
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
        </Sidebar>

        <MainContent>{renderContent()}</MainContent>
      </MainLayout>

      <NotificationWidget>🔔 {notifications} issues</NotificationWidget>
    </DashboardContainer>
  );
};

export default WorkationDashboard;
