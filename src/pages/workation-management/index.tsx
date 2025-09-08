import type { Tool, GlobalState } from "../../shared/types";
import {
  WorkationManagementContainer,
  ManagementContainer,
  SectionHeader,
  SectionTitle,
  PageTitle,
  PageSubtitle,
  RefreshButton,
  ToolGrid,
  ToolItem,
  ToolIcon,
  ToolInfo,
  ToolName,
  ToolDescription,
  ToolStatus,
  Badge,
  StatusText,
  DetailedSection,
  DetailedSectionTitle,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  TaskList,
  TaskItem,
  TaskStatus,
  TaskContent,
  TaskTitle,
  TaskDescription,
  TaskMeta,
  TaskAssignee,
  TaskDueDate,
} from "./style";

interface ToolItemComponentProps {
  tool: Tool;
  onClick?: () => void;
}

const ToolItemComponent: React.FC<ToolItemComponentProps> = ({ tool, onClick }) => (
  <ToolItem onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <ToolIcon gradient={tool.gradient}>{tool.icon}</ToolIcon>
    <ToolInfo>
      <ToolName>{tool.name}</ToolName>
      <ToolDescription>{tool.description}</ToolDescription>
    </ToolInfo>
    <ToolStatus>
      <Badge status={tool.status}>{tool.badgeText}</Badge>
      <StatusText>{tool.statusText}</StatusText>
    </ToolStatus>
  </ToolItem>
);

interface WorkationManagementPageProps {
  globalState: GlobalState;
  isDetailView?: boolean;
  onNavigate?: (tabId: string) => void;
}

const WorkationManagementPage: React.FC<WorkationManagementPageProps> = ({
  globalState,
  isDetailView = false,
  onNavigate,
}) => {
  const { progress, activeTab } = globalState;

  const tools: Tool[] = [
    {
      id: "group",
      name: "그룹 생성",
      description: "워케이션 그룹 & 일정 관리",
      icon: "G",
      gradient: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
      status: "success",
      statusText: "3개 그룹 관리중",
      badgeText: "Active",
    },
    {
      id: "plan",
      name: "계획서 관리",
      description: "워케이션 계획서 작성 & PR 관리",
      icon: "P",
      gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)",
      status: "warning",
      statusText: "승인 필요",
      badgeText: "5 PR 대기",
    },
    {
      id: "cvc",
      name: "CVC 매칭",
      description: "기업간 워케이션 경쟁 시스템",
      icon: "C",
      gradient: "linear-gradient(135deg, #a8e6cf, #88d8a3)",
      status: "success",
      statusText: "vs 테크컴퍼니B",
      badgeText: "매칭 완료",
    },
    {
      id: "report",
      name: "실시간 보고",
      description: "활동 업로드 & 진행도 추적",
      icon: "R",
      gradient: "linear-gradient(135deg, #ffd93d, #ff9800)",
      status: "success",
      statusText: `${progress}% 달성`,
      badgeText: "실시간",
    },
  ];

  const tasks = [
    {
      id: 1,
      title: "제주도 숙소 예약 확정",
      description: "한라산 뷰 펜션 예약 및 결제 완료",
      status: "completed" as const,
      assignee: "김워케",
      dueDate: "2024-01-15",
    },
    {
      id: 2,
      title: "팀 빌딩 활동 계획 수립",
      description: "해변 바베큐 및 서핑 체험 일정 조율",
      status: "in-progress" as const,
      assignee: "박여행",
      dueDate: "2024-01-18",
    },
    {
      id: 3,
      title: "업무 공간 설정",
      description: "코워킹 스페이스 예약 및 장비 준비",
      status: "in-progress" as const,
      assignee: "이일해",
      dueDate: "2024-01-20",
    },
    {
      id: 4,
      title: "교통편 예약",
      description: "항공편 및 렌터카 예약",
      status: "pending" as const,
      assignee: "최이동",
      dueDate: "2024-01-22",
    },
    {
      id: 5,
      title: "워케이션 가이드라인 작성",
      description: "업무 시간 및 휴식 시간 규칙 정리",
      status: "pending" as const,
      assignee: "정규칙",
      dueDate: "2024-01-25",
    },
  ];

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    target.style.transform = "rotate(360deg)";
    target.style.transition = "transform 0.5s ease";
    setTimeout(() => {
      target.style.transform = "";
    }, 500);
  };

  const handleToolClick = (toolId: string) => {
    if (toolId === "plan" && onNavigate) {
      onNavigate("plan");
    }
  };

  // 상세 페이지인 경우
  if (isDetailView || activeTab === "workation") {
    return (
      <WorkationManagementContainer>
        <div>
          <PageTitle>🏖️ 워케이션 관리 시스템</PageTitle>
          <PageSubtitle>
            팀의 워케이션을 체계적으로 관리하고 성공적인 경험을 만들어보세요
          </PageSubtitle>
        </div>

        {/* 통계 대시보드 */}
        <DetailedSection>
          <DetailedSectionTitle>📊 워케이션 현황</DetailedSectionTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>12</StatValue>
              <StatLabel>총 참여 인원</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>4</StatValue>
              <StatLabel>활성 프로젝트</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>85%</StatValue>
              <StatLabel>만족도</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>7일</StatValue>
              <StatLabel>평균 기간</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>3</StatValue>
              <StatLabel>완료된 워케이션</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>₩2.1M</StatValue>
              <StatLabel>총 예산</StatLabel>
            </StatCard>
          </StatsGrid>
        </DetailedSection>

        {/* 관리 도구 */}
        <DetailedSection>
          <DetailedSectionTitle>🛠️ 관리 도구</DetailedSectionTitle>
          <ToolGrid>
            {tools.map((tool) => (
              <ToolItemComponent key={tool.id} tool={tool} onClick={() => handleToolClick(tool.id)} />
            ))}
          </ToolGrid>
        </DetailedSection>

        {/* 진행 중인 작업 */}
        <DetailedSection>
          <DetailedSectionTitle>📋 작업 현황</DetailedSectionTitle>
          <TaskList>
            {tasks.map((task) => (
              <TaskItem key={task.id}>
                <TaskStatus status={task.status} />
                <TaskContent>
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                </TaskContent>
                <TaskMeta>
                  <TaskAssignee>담당: {task.assignee}</TaskAssignee>
                  <TaskDueDate>마감: {task.dueDate}</TaskDueDate>
                </TaskMeta>
              </TaskItem>
            ))}
          </TaskList>
        </DetailedSection>

        {/* 그룹 관리 상세 */}
        <DetailedSection>
          <DetailedSectionTitle>👥 그룹 관리</DetailedSectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            <StatCard style={{ textAlign: "left", padding: "24px" }}>
              <h4 style={{ color: "#4a90e2", marginBottom: "12px" }}>🌊 제주 서핑팀</h4>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                5명 • 진행중 • 서귀포
              </p>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                2024.01.15 - 2024.01.22
              </div>
            </StatCard>
            <StatCard style={{ textAlign: "left", padding: "24px" }}>
              <h4 style={{ color: "#ff6b6b", marginBottom: "12px" }}>🏔️ 한라산 트래킹팀</h4>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                4명 • 계획중 • 제주시
              </p>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                2024.02.01 - 2024.02.07
              </div>
            </StatCard>
            <StatCard style={{ textAlign: "left", padding: "24px" }}>
              <h4 style={{ color: "#4ecdc4", marginBottom: "12px" }}>🎯 집중 개발팀</h4>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                3명 • 완료 • 중문
              </p>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                2023.12.10 - 2023.12.17
              </div>
            </StatCard>
          </div>
        </DetailedSection>
      </WorkationManagementContainer>
    );
  }

  // 위젯 뷰 (Overview 페이지용)
  return (
    <ManagementContainer>
      <SectionHeader>
        <SectionTitle>워케이션 관리 도구</SectionTitle>
        <RefreshButton onClick={handleRefresh}>🔄</RefreshButton>
      </SectionHeader>

      {tools.map((tool) => (
        <ToolItemComponent key={tool.id} tool={tool} onClick={() => handleToolClick(tool.id)} />
      ))}
    </ManagementContainer>
  );
};

export default WorkationManagementPage;