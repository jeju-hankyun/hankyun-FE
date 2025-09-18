import type { Event, GlobalState } from "../../shared/types";
import {
  CompetitionPageContainer,
  CompetitionContainer,
  SectionHeader,
  SectionTitle,
  PageTitle,
  PageSubtitle,
  ActivityBadge,
  RefreshButton,
  CompetitionGrid,
  CompetitionCard,
  CompetitionHeader,
  CompetitionTitle,
  CompetitionStatus,
  CompetitionProgress,
  ProgressHeader,
  TeamName,
  ProgressValue,
  ProgressBar,
  ProgressFill,
  EventItem,
  EventIndicator,
  EventContent,
  EventTitle,
  EventDescription,
  EventMeta,
  DetailedSection,
  DetailedSectionTitle,
  LeaderboardContainer,
  LeaderboardItem,
  RankBadge,
  LeaderboardContent,
  TeamNameLarge,
  TeamStats,
  MatchHistoryItem,
  MatchTeams,
  MatchResult,
  MatchScore,
  MatchDate,
  VSContainer,
  ProgressCircleContainer,
  CircularProgress,
  ProgressLabel,
  ProgressPercentage,
  ProgressTeamName,
  VSSymbol,
  BattleInfo,
  BattleTitle,
  BattleStatus,
  CompetitiveBadge,
  LiveIndicator,
} from "./style";
import { useState, useEffect } from "react";

interface EventItemComponentProps {
  event: Event;
}

const EventItemComponent: React.FC<EventItemComponentProps> = ({ event }) => (
  <EventItem>
    <EventIndicator />
    <EventContent>
      <EventTitle>{event.title}</EventTitle>
      <EventDescription>{event.description}</EventDescription>
      <EventMeta>
        {event.time} • {event.category}
      </EventMeta>
    </EventContent>
  </EventItem>
);

interface CircularProgressComponentProps {
  progress: number;
  teamName: string;
  isWinner: boolean;
  color?: string;
  size?: number;
}

const CircularProgressComponent: React.FC<CircularProgressComponentProps> = ({
  progress,
  teamName,
  isWinner,
  color = "#7c3aed",
  size = 140,
}) => {
  const radius = size / 2 - 8;

  return (
    <ProgressCircleContainer isWinner={isWinner}>
      <CircularProgress progress={progress} size={size} color={color}>
        <svg>
          <circle
            className="progress-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
          <circle
            className="progress-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
        </svg>
        <ProgressLabel>
          <ProgressPercentage isWinner={isWinner}>
            {progress}%
          </ProgressPercentage>
        </ProgressLabel>
      </CircularProgress>
      <ProgressTeamName>{teamName}</ProgressTeamName>
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
  const [currentBattle, setCurrentBattle] = useState<any>(null); // API에서 가져올 데이터
  const [events, setEvents] = useState<Event[]>([]); // API에서 가져올 데이터
  const [competitions, setCompetitions] = useState<any[]>([]); // API에서 가져올 데이터
  const [leaderboard, setLeaderboard] = useState<any[]>([]); // API에서 가져올 데이터
  const [matchHistory, setMatchHistory] = useState<any[]>([]); // API에서 가져올 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: 실제 API 호출을 통해 데이터를 가져오는 useEffect 추가 필요
  useEffect(() => {
    // 예시: CVC 상태 API 호출 (아직 API가 정의되지 않았으므로 로딩만)
    const fetchCompetitionData = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: 실제 API 호출 (예: getCvcStatus, getEvents, getCompetitions 등)
        // const battleResponse = await getCvcStatus();
        // setCurrentBattle(battleResponse.data);

        // 임시 로딩 완료 처리
        setTimeout(() => {
          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error("경쟁 페이지 데이터 로딩 실패:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };
    fetchCompetitionData();
  }, []);

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    target.style.transform = "rotate(360deg)";
    target.style.transition = "transform 0.5s ease";
    setTimeout(() => {
      target.style.transform = "";
    }, 500);
    // TODO: 새로고침 시 API 데이터 다시 불러오기
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
            🏆 워케이션 경쟁 현황{currentBattle && <LiveIndicator>LIVE</LiveIndicator>}
          </PageTitle>
          <PageSubtitle>
            다른 팀들과 경쟁하며 더 나은 워케이션 성과를 만들어보세요
          </PageSubtitle>

          {/* 떠다니는 경쟁 요소들은 API 데이터와 무관하므로 유지 */}
          <CompetitiveBadge type="fire">🔥</CompetitiveBadge>
          <CompetitiveBadge type="lightning">⚡</CompetitiveBadge>
          <CompetitiveBadge type="star">⭐</CompetitiveBadge>
          <CompetitiveBadge type="trophy">🏆</CompetitiveBadge>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>경쟁 데이터 로딩 중...</p>}

        {!loading && !error && currentBattle ? (
          <>
            {/* 메인 VS 위젯 */}
            <DetailedSection>
              <DetailedSectionTitle>⚔️ 현재 경쟁 상황</DetailedSectionTitle>
              <BattleInfo>
                <BattleTitle>{currentBattle.battleTitle || '정보 없음'}</BattleTitle>
                <BattleStatus status={getBattleStatus(currentBattle.ourProgress, currentBattle.theirProgress)}>
                  {getBattleStatusText(currentBattle.ourProgress, currentBattle.theirProgress)}
                </BattleStatus>
              </BattleInfo>

              <VSContainer>
                <CircularProgressComponent
                  progress={currentBattle.ourProgress || 0}
                  teamName={currentBattle.ourTeam || '우리팀'}
                  isWinner={
                    (currentBattle.ourProgress || 0) >= (currentBattle.theirProgress || 0)
                  }
                  color="#7c3aed"
                  size={160}
                />

                <VSSymbol>VS</VSSymbol>

                <CircularProgressComponent
                  progress={currentBattle.theirProgress || 0}
                  teamName={currentBattle.theirTeam || '상대팀'}
                  isWinner={
                    (currentBattle.theirProgress || 0) >= (currentBattle.ourProgress || 0)
                  }
                  color="#e11d48"
                  size={160}
                />
              </VSContainer>
            </DetailedSection>
          </>
        ) : (!loading && !error && <p>현재 진행 중인 경쟁이 없습니다.</p>)}

        {/* 경쟁 통계는 더미 데이터이므로 삭제합니다. */}
        {/* <DetailedSection>
          <DetailedSectionTitle>📈 경쟁 통계</DetailedSectionTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>14</StatValue>
              <StatLabel>총 경쟁 수</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>8</StatValue>
              <StatLabel>승리</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>4</StatValue>
              <StatLabel>패배</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>2</StatValue>
              <StatLabel>무승부</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>67%</StatValue>
              <StatLabel>승률</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>2,654</StatValue>
              <StatLabel>총 포인트</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>#2</StatValue>
              <StatLabel>현재 순위</StatLabel>
            </StatCard>
          </StatsGrid>
        </DetailedSection> */}

        {/* 진행 중인 경쟁 (API 연동 필요) */}
        {!loading && !error && competitions.length > 0 ? (
          <DetailedSection>
            <DetailedSectionTitle>⚡ 진행 중인 경쟁</DetailedSectionTitle>
            <CompetitionGrid>
              {competitions.map((comp) => (
                <CompetitionCard key={comp.id}>
                  <CompetitionHeader>
                    <CompetitionTitle>{comp.title || '정보 없음'}</CompetitionTitle>
                    <CompetitionStatus status={comp.status}>
                      {comp.status === "active"
                        ? "진행중"
                        : comp.status === "completed"
                        ? "완료"
                        : "예정"}
                    </CompetitionStatus>
                  </CompetitionHeader>

                  <CompetitionProgress>
                    <ProgressHeader>
                      <TeamName>{comp.ourTeam || '우리팀'}</TeamName>
                      <ProgressValue
                        isWinning={(comp.ourProgress || 0) > (comp.theirProgress || 0)}
                      >
                        {comp.ourProgress || 0}%
                      </ProgressValue>
                    </ProgressHeader>
                    <ProgressBar>
                      <ProgressFill
                        progress={comp.ourProgress || 0}
                        isWinning={(comp.ourProgress || 0) > (comp.theirProgress || 0)}
                      />
                    </ProgressBar>

                    <ProgressHeader>
                      <TeamName>{comp.theirTeam || '상대팀'}</TeamName>
                      <ProgressValue
                        isWinning={(comp.theirProgress || 0) > (comp.ourProgress || 0)}
                      >
                        {comp.theirProgress || 0}%
                      </ProgressValue>
                    </ProgressHeader>
                    <ProgressBar>
                      <ProgressFill
                        progress={comp.theirProgress || 0}
                        isWinning={(comp.theirProgress || 0) > (comp.ourProgress || 0)}
                      />
                    </ProgressBar>
                  </CompetitionProgress>

                  <div
                    style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
                  >
                    마감일: {comp.endDate || '정보 없음'}
                  </div>
                </CompetitionCard>
              ))}
            </CompetitionGrid>
          </DetailedSection>
        ) : (!loading && !error && <p style={{ textAlign: 'center' }}>진행 중인 경쟁이 없습니다.</p>)}

        {/* 리더보드 (API 연동 필요) */}
        {!loading && !error && leaderboard.length > 0 ? (
          <DetailedSection>
            <DetailedSectionTitle>🥇 리더보드</DetailedSectionTitle>
            <LeaderboardContainer>
              {leaderboard.map((item) => (
                <LeaderboardItem key={item.team} rank={item.rank}>
                  <RankBadge rank={item.rank}>{item.rank || '-'}</RankBadge>
                  <LeaderboardContent>
                    <TeamNameLarge>{item.team || '팀 이름 없음'}</TeamNameLarge>
                    <TeamStats>
                      <span>{item.wins || 0}승</span>
                      <span>{item.losses || 0}패</span>
                      <span>{item.points || 0}pt</span>
                    </TeamStats>
                  </LeaderboardContent>
                </LeaderboardItem>
              ))}
            </LeaderboardContainer>
          </DetailedSection>
        ) : (!loading && !error && <p style={{ textAlign: 'center' }}>리더보드 정보가 없습니다.</p>)}

        {/* 경기 기록 (API 연동 필요) */}
        {!loading && !error && matchHistory.length > 0 ? (
          <DetailedSection>
            <DetailedSectionTitle>📋 최근 경기 기록</DetailedSectionTitle>
            {matchHistory.map((match) => (
              <MatchHistoryItem key={match.id}>
                <MatchTeams>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#fff",
                        marginBottom: "4px",
                      }}
                    >
                      {match.ourTeam || '우리팀'}
                    </div>
                    <div
                      style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}
                    >
                      vs {match.theirTeam || '상대팀'}
                    </div>
                  </div>
                  <MatchScore>
                    {(match.ourScore || 0)} - {(match.theirScore || 0)}
                  </MatchScore>
                </MatchTeams>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px",
                  }}
                >
                  <MatchResult result={match.result}>
                    {match.result === "win"
                      ? "승리"
                      : match.result === "lose"
                      ? "패배"
                      : "무승부"}
                  </MatchResult>
                  <MatchDate>{match.date || '날짜 정보 없음'}</MatchDate>
                </div>
              </MatchHistoryItem>
            ))}
          </DetailedSection>
        ) : (!loading && !error && <p style={{ textAlign: 'center' }}>경기 기록이 없습니다.</p>)}

        {/* 실시간 활동 (API 연동 필요) */}
        {!loading && !error && events.length > 0 ? (
          <DetailedSection>
            <DetailedSectionTitle>📡 실시간 활동</DetailedSectionTitle>
            {events.map((event) => (
              <EventItemComponent key={event.id} event={event} />
            ))}
          </DetailedSection>
        ) : (!loading && !error && <p style={{ textAlign: 'center' }}>활동 내역이 없습니다.</p>)}
      </CompetitionPageContainer>
    );
  }

  // 위젯 뷰 (Overview 페이지용)
  return (
    <CompetitionContainer>
      <SectionHeader>
        <SectionTitle>
          최근 활동
          {/* ActivityBadge는 API 데이터가 없으면 표시하지 않음 */}
          {events.length > 0 && <ActivityBadge>{events.length} new</ActivityBadge>}
        </SectionTitle>
        <RefreshButton onClick={handleRefresh}>🔄</RefreshButton>
      </SectionHeader>

      {loading && <p>활동 로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && events.length > 0 ? (
        events.slice(0, 3).map((event) => (
          <EventItemComponent key={event.id} event={event} />
        ))
      ) : (!loading && !error && <p>최근 활동이 없습니다.</p>)}
    </CompetitionContainer>
  );
};

// 헬퍼 함수들을 컴포넌트 밖으로 이동 또는 제거
const getBattleStatus = (ourProgress: number, theirProgress: number) => {
  if (ourProgress > theirProgress) return "leading";
  if (ourProgress < theirProgress) return "losing";
  return "tie";
};

const getBattleStatusText = (ourProgress: number, theirProgress: number) => {
  const diff = Math.abs(ourProgress - theirProgress);
  switch (getBattleStatus(ourProgress, theirProgress)) {
    case "leading":
      return `${diff}% 앞서고 있습니다!`;
    case "losing":
      return `${diff}% 뒤처져 있습니다`;
    case "tie":
      return "동점입니다!";
  }
  return ""; // 기본 반환값 추가
};

export default CompetitionPage;
