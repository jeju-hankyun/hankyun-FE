import styled from "styled-components";
import type { GlobalState } from "../../shared/types";
import WorkationManagementPage from "../workation-management";
import CompetitionPage from "../competition";
import OfficeManagementPage from "../office-management";

// 새로운 디자인 시스템 - 이미지 기반
const OverviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatusCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatusTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

const StatusIcon = styled.div<{ bgColor?: string }>`
  width: 40px;
  height: 40px;
  background: ${props => props.bgColor || 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  font-weight: 600;
`;

const StatusValue = styled.div<{ colorClass?: string }>`
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  
  &.progress {
    color: #8b5cf6;
  }
  
  &.memory {
    color: #06b6d4;
  }
  
  &.uptime {
    color: #10b981;
  }
`;

const StatusSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const UserCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  grid-column: span 1;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  font-weight: 700;
  margin-bottom: 16px;
`;

const UserName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
`;

const UserRole = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
`;

const UserCompany = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #8b5cf6;
  margin: 0 0 16px 0;
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const UserStat = styled.div`
  text-align: center;
`;

const UserStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const UserStatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ProgressCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProgressCircle = styled.div<{ progress: number }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#8b5cf6 0deg ${props => props.progress * 3.6}deg, #f1f5f9 ${props => props.progress * 3.6}deg 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
  
  &::before {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
  }
`;

const ProgressText = styled.div`
  position: relative;
  z-index: 1;
  font-size: 24px;
  font-weight: 700;
  color: #8b5cf6;
`;

const NewWorkationButton = styled.button`
  position: fixed;
  top: 32px;
  right: 32px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
  }
`;

interface StatusCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  colorClass: string;
  iconColor?: string;
}

const StatusCardComponent: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorClass,
  iconColor,
}) => (
  <StatusCard>
    <StatusHeader>
      <StatusTitle>{title}</StatusTitle>
      <StatusIcon bgColor={iconColor}>{icon}</StatusIcon>
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
      icon: "P",
      colorClass: "progress",
      iconColor: "#8b5cf6",
    },
    {
      title: "참가 인원",
      value: `${checkedInUsers}/12 명`,
      subtitle: "현재 체크인",
      icon: "U",
      colorClass: "memory",
      iconColor: "#06b6d4",
    },
    {
      title: "워케이션 D-Day",
      value: `D-${dDay}`,
      subtitle: "남은 기간",
      icon: "D",
      colorClass: "uptime",
      iconColor: "#10b981",
    },
  ];

  return (
    <>
      <NewWorkationButton>
        새로운 워케이션
      </NewWorkationButton>
      
      {/* 메인 대시보드 카드들 */}
      <OverviewContainer>
        {/* 사용자 프로필 카드 */}
        <UserCard>
          <StatusTitle>사용자</StatusTitle>
          <UserAvatar>U</UserAvatar>
          <UserName>서정현</UserName>
          <UserRole>신입사원</UserRole>
          <UserCompany>카카오</UserCompany>
          <UserStats>
            <UserStat>
              <UserStatValue>1년 미만</UserStatValue>
              <UserStatLabel>경력</UserStatLabel>
            </UserStat>
            <UserStat>
              <UserStatValue>8회</UserStatValue>
              <UserStatLabel>워케이션</UserStatLabel>
            </UserStat>
            <UserStat>
              <UserStatValue>18세</UserStatValue>
              <UserStatLabel>나이</UserStatLabel>
            </UserStat>
          </UserStats>
        </UserCard>
        
        {/* 진행도 카드 */}
        <ProgressCard>
          <StatusTitle>진행도</StatusTitle>
          <ProgressCircle progress={progress}>
            <ProgressText>{progress}%</ProgressText>
          </ProgressCircle>
        </ProgressCard>
        
        {/* 기타 상태 카드들 */}
        {statusCards.slice(1).map((card, index) => (
          <StatusCardComponent key={index} {...card} iconColor={card.iconColor} />
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