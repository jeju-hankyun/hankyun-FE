import type { GlobalState } from "../../shared/types";
import {
  CompetitionPageContainer,
  CompetitionContainer,
  SectionHeader,
  SectionTitle,
  PageTitle,
  PageSubtitle,
  ActivityBadge,
  RefreshButton,
  DetailedSection,
  DetailedSectionTitle,
  VSContainer,
  ProgressCircleContainer,
  CircularProgress,
  ProgressLabel,
  ProgressPercentage,
  ProgressTeamName,
  BattleInfo,
  BattleTitle,
  BattleStatus,
  CompetitiveBadge,
  LiveIndicator,
} from "./style";
import { useState, useEffect } from "react";
import { getCvcStatus } from "../../auth/api";
import type { CvcStatusResponse } from "../../auth/api/interfaces";


interface CircularProgressComponentProps {
  progress: number;
  teamName: string;
  isWinner: boolean;
  color: string;
  size: number;
}

const CircularProgressComponent: React.FC<CircularProgressComponentProps> = ({
  progress,
  teamName,
  isWinner,
  color,
  size
}) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <ProgressCircleContainer>
      <CircularProgress progress={progress} size={size}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
              filter: isWinner ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' : 'none'
            }}
          />
        </svg>
        <ProgressLabel>
          <ProgressPercentage>{progress}%</ProgressPercentage>
          <ProgressTeamName>{teamName}</ProgressTeamName>
        </ProgressLabel>
      </CircularProgress>
    </ProgressCircleContainer>
  );
};

interface CompetitionPageProps {
  globalState?: GlobalState;
  isDetailView?: boolean;
}

const CompetitionPage: React.FC<CompetitionPageProps> = ({
  globalState,
  isDetailView = false,
}) => {
  const [cvcData, setCvcData] = useState<CvcStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CVC 상태 데이터 가져오기
  useEffect(() => {
    const fetchCvcData = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date();
        const targetDate = today.toISOString().split('T')[0];
        const response = await getCvcStatus(targetDate);
        
        if (response.data) {
          setCvcData(response.data);
        } else {
          setError(response.message || 'CVC 데이터를 불러오지 못했습니다.');
        }
      } catch (err) {
        console.error("CVC 데이터 로딩 실패:", err);
        setError("CVC 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCvcData();
  }, []);

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    target.style.transform = "rotate(360deg)";
    target.style.transition = "transform 0.5s ease";
    setTimeout(() => {
      target.style.transform = "";
    }, 500);
    
    // CVC 데이터 다시 불러오기
    const fetchCvcData = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date();
        const targetDate = today.toISOString().split('T')[0];
        const response = await getCvcStatus(targetDate);
        
        if (response.data) {
          setCvcData(response.data);
        } else {
          setError(response.message || 'CVC 데이터를 불러오지 못했습니다.');
        }
      } catch (err) {
        console.error("CVC 데이터 로딩 실패:", err);
        setError("CVC 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCvcData();
  };

  // 상세 페이지인 경우
  if (
    isDetailView ||
    (globalState && globalState.activeTab === "competition")
  ) {
    return (
      <CompetitionPageContainer>
        <div style={{ position: "relative" }}>
          <PageTitle>
            🏆 CVC 매칭 현황{cvcData && <LiveIndicator>LIVE</LiveIndicator>}
          </PageTitle>
          <PageSubtitle>
            CVC 매칭을 통해 다른 팀들과 경쟁하며 더 나은 워케이션 성과를 만들어보세요
          </PageSubtitle>

          {/* 떠다니는 경쟁 요소들 */}
          <CompetitiveBadge type="fire">🔥</CompetitiveBadge>
          <CompetitiveBadge type="lightning">⚡</CompetitiveBadge>
          <CompetitiveBadge type="star">⭐</CompetitiveBadge>
          <CompetitiveBadge type="trophy">🏆</CompetitiveBadge>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>CVC 데이터 로딩 중...</p>}

        {!loading && !error && cvcData ? (
          <>
            {/* 메인 VS 위젯 */}
            <DetailedSection>
              <DetailedSectionTitle>⚔️ CVC 매칭 현황</DetailedSectionTitle>
              <BattleInfo>
                <BattleTitle>CVC ID: {cvcData.cvc_id} - {cvcData.cvc_date}</BattleTitle>
                <BattleStatus status={cvcData.is_completed ? "leading" : "tie"}>
                  {cvcData.is_completed ? "완료" : "진행중"}
                </BattleStatus>
              </BattleInfo>

              <VSContainer>
                {cvcData.progress.map((match, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <CircularProgressComponent
                      progress={match.progress}
                      teamName={`그룹 ${match.group_id}`}
                      isWinner={match.progress >= 50}
                      color="#7c3aed"
                      size={120}
                    />
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>VS</div>
                    <CircularProgressComponent
                      progress={100 - match.progress}
                      teamName="상대팀"
                      isWinner={match.progress < 50}
                      color="#ef4444"
                      size={120}
                    />
                  </div>
                ))}
              </VSContainer>
            </DetailedSection>
          </>
        ) : (!loading && !error && <p>현재 진행 중인 CVC 매칭이 없습니다.</p>)}
      </CompetitionPageContainer>
    );
  }

  // 위젯 뷰 (Overview 페이지용)
  return (
    <CompetitionContainer>
      <SectionHeader>
        <SectionTitle>
          CVC 매칭 현황
          {cvcData && <ActivityBadge>LIVE</ActivityBadge>}
        </SectionTitle>
        <RefreshButton onClick={handleRefresh}>🔄</RefreshButton>
      </SectionHeader>

      {loading && <p>CVC 데이터 로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && cvcData ? (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <strong>CVC ID: {cvcData.cvc_id}</strong>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {cvcData.cvc_date} | {cvcData.is_completed ? '완료' : '진행중'}
            </div>
          </div>
          {cvcData.progress.slice(0, 2).map((match, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <span>그룹 {match.group_id}</span>
              <span style={{ fontWeight: 'bold' }}>{match.progress}%</span>
            </div>
          ))}
        </div>
      ) : (!loading && !error && <p>현재 CVC 매칭이 없습니다.</p>)}
    </CompetitionContainer>
  );
};

export default CompetitionPage;