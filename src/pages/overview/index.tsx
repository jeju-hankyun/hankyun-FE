import type { GlobalState } from "../../shared/types";
import {
  OverviewContainer,
  StatusCard,
  StatusHeader,
  StatusTitle,
  StatusIcon,
  StatusValue,
  StatusSubtitle,
} from "./style";
import WorkationManagementPage from "../workation-management";
import CompetitionPage from "../competition";
import OfficeManagementPage from "../office-management";

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  colorClass: string;
}

const StatusCardComponent: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorClass,
}) => (
  <StatusCard>
    <StatusHeader>
      <StatusTitle>{title}</StatusTitle>
      <StatusIcon>{icon}</StatusIcon>
    </StatusHeader>
    <StatusValue colorClass={colorClass} className={colorClass}>
      {value}
    </StatusValue>
    <StatusSubtitle>{subtitle}</StatusSubtitle>
  </StatusCard>
);

interface OverviewPageProps {
  globalState: GlobalState;
  onNavigate?: (tabId: string) => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ globalState, onNavigate }) => {
  const { progress, checkedInUsers, dDay } = globalState;

  const statusCards = [
    {
      title: "전체 진행률",
      value: `${progress}%`,
      subtitle: "목표 대비",
      icon: "⚡",
      colorClass: "progress",
    },
    {
      title: "참가 인원",
      value: `${checkedInUsers}/12 명`,
      subtitle: "현재 체크인",
      icon: "👥",
      colorClass: "memory",
    },
    {
      title: "워케이션 D-Day",
      value: `D-${dDay}`,
      subtitle: "남은 기간",
      icon: "🕐",
      colorClass: "uptime",
    },
  ];

  return (
    <>
      {/* 상태 카드들 */}
      <OverviewContainer>
        {statusCards.map((card, index) => (
          <StatusCardComponent key={index} {...card} />
        ))}
      </OverviewContainer>

      {/* 워케이션 관리 위젯 */}
      <WorkationManagementPage globalState={globalState} onNavigate={onNavigate} />

      {/* 경쟁 현황 위젯 */}
      <CompetitionPage />

      {/* 오피스 관리 위젯 */}
      <OfficeManagementPage />
    </>
  );
};

export default OverviewPage;