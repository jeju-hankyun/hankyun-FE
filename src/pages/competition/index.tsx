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
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
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
  // 현재 진행 중인 경쟁 데이터
  const currentBattle = {
    ourTeam: "우리팀",
    theirTeam: "테크컴퍼니B",
    ourProgress: 78,
    theirProgress: 100,
    battleTitle: "제주도 워케이션 챌린지",
  };
  const events: Event[] = [
    {
      id: 1,
      title: "🏆 경쟁 결과 업데이트",
      description:
        "오늘 테크컴퍼니B와의 경쟁에서 승리했습니다 (진행도: 95% vs 87%)",
      time: "방금 전",
      category: "경쟁현황",
    },
    {
      id: 2,
      title: "📝 새로운 계획서 PR",
      description: "김개발님이 내일 오후 일정에 대한 수정 요청을 보냈습니다",
      time: "15분 전",
      category: "계획서관리",
    },
    {
      id: 3,
      title: "✅ 활동 인증 완료",
      description: "오후 2시 업무 활동이 성공적으로 인증되었습니다",
      time: "1시간 전",
      category: "실시간보고",
    },
    {
      id: 4,
      title: "🎯 주간 목표 달성",
      description: "이번 주 워케이션 목표를 102% 달성했습니다",
      time: "2시간 전",
      category: "진행도관리",
    },
    {
      id: 5,
      title: "💬 팀 미팅 예약",
      description: "내일 오전 10시 전체 팀 미팅이 예약되었습니다",
      time: "3시간 전",
      category: "일정관리",
    },
  ];

  const competitions = [
    {
      id: 1,
      title: "우리팀 vs 테크컴퍼니B",
      status: "active" as const,
      ourProgress: 95,
      theirProgress: 87,
      ourTeam: "우리팀",
      theirTeam: "테크컴퍼니B",
      endDate: "2024-01-25",
    },
    {
      id: 2,
      title: "우리팀 vs 스타트업C",
      status: "completed" as const,
      ourProgress: 88,
      theirProgress: 92,
      ourTeam: "우리팀",
      theirTeam: "스타트업C",
      endDate: "2024-01-15",
    },
    {
      id: 3,
      title: "우리팀 vs 대기업D",
      status: "upcoming" as const,
      ourProgress: 0,
      theirProgress: 0,
      ourTeam: "우리팀",
      theirTeam: "대기업D",
      endDate: "2024-02-01",
    },
  ];

  const leaderboard = [
    { rank: 1, team: "테크이노베이터", wins: 12, losses: 2, points: 2847 },
    { rank: 2, team: "우리팀", wins: 10, losses: 4, points: 2654 },
    { rank: 3, team: "디지털노마드", wins: 9, losses: 5, points: 2432 },
    { rank: 4, team: "스마트워커", wins: 8, losses: 6, points: 2218 },
    { rank: 5, team: "제주크루", wins: 7, losses: 7, points: 2011 },
  ];

  const matchHistory = [
    {
      id: 1,
      ourTeam: "우리팀",
      theirTeam: "테크컴퍼니B",
      ourScore: 95,
      theirScore: 87,
      result: "win" as const,
      date: "2024-01-20",
    },
    {
      id: 2,
      ourTeam: "우리팀",
      theirTeam: "스타트업C",
      ourScore: 88,
      theirScore: 92,
      result: "lose" as const,
      date: "2024-01-15",
    },
    {
      id: 3,
      ourTeam: "우리팀",
      theirTeam: "글로벌팀",
      ourScore: 76,
      theirScore: 76,
      result: "draw" as const,
      date: "2024-01-10",
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

  // 배틀 상태 계산
  const getBattleStatus = () => {
    if (currentBattle.ourProgress > currentBattle.theirProgress)
      return "leading";
    if (currentBattle.ourProgress < currentBattle.theirProgress)
      return "losing";
    return "tie";
  };

  const getBattleStatusText = () => {
    const diff = Math.abs(
      currentBattle.ourProgress - currentBattle.theirProgress
    );
    switch (getBattleStatus()) {
      case "leading":
        return `${diff}% 앞서고 있습니다!`;
      case "losing":
        return `${diff}% 뒤처져 있습니다`;
      case "tie":
        return "동점입니다!";
    }
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
            🏆 워케이션 경쟁 현황<LiveIndicator>LIVE</LiveIndicator>
          </PageTitle>
          <PageSubtitle>
            다른 팀들과 경쟁하며 더 나은 워케이션 성과를 만들어보세요
          </PageSubtitle>

          {/* 떠다니는 경쟁 요소들 */}
          <CompetitiveBadge type="fire">🔥</CompetitiveBadge>
          <CompetitiveBadge type="lightning">⚡</CompetitiveBadge>
          <CompetitiveBadge type="star">⭐</CompetitiveBadge>
          <CompetitiveBadge type="trophy">🏆</CompetitiveBadge>
        </div>

        {/* 메인 VS 위젯 */}
        <DetailedSection>
          <DetailedSectionTitle>⚔️ 현재 경쟁 상황</DetailedSectionTitle>
          <BattleInfo>
            <BattleTitle>{currentBattle.battleTitle}</BattleTitle>
            <BattleStatus status={getBattleStatus()}>
              {getBattleStatusText()}
            </BattleStatus>
          </BattleInfo>

          <VSContainer>
            <CircularProgressComponent
              progress={currentBattle.ourProgress}
              teamName={currentBattle.ourTeam}
              isWinner={
                currentBattle.ourProgress >= currentBattle.theirProgress
              }
              color="#7c3aed"
              size={160}
            />

            <VSSymbol>VS</VSSymbol>

            <CircularProgressComponent
              progress={currentBattle.theirProgress}
              teamName={currentBattle.theirTeam}
              isWinner={
                currentBattle.theirProgress >= currentBattle.ourProgress
              }
              color="#e11d48"
              size={160}
            />
          </VSContainer>
        </DetailedSection>

        {/* 경쟁 통계 */}
        <DetailedSection>
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
        </DetailedSection>

        {/* 진행 중인 경쟁 */}
        <DetailedSection>
          <DetailedSectionTitle>⚡ 진행 중인 경쟁</DetailedSectionTitle>
          <CompetitionGrid>
            {competitions.map((comp) => (
              <CompetitionCard key={comp.id}>
                <CompetitionHeader>
                  <CompetitionTitle>{comp.title}</CompetitionTitle>
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
                    <TeamName>{comp.ourTeam}</TeamName>
                    <ProgressValue
                      isWinning={comp.ourProgress > comp.theirProgress}
                    >
                      {comp.ourProgress}%
                    </ProgressValue>
                  </ProgressHeader>
                  <ProgressBar>
                    <ProgressFill
                      progress={comp.ourProgress}
                      isWinning={comp.ourProgress > comp.theirProgress}
                    />
                  </ProgressBar>

                  <ProgressHeader>
                    <TeamName>{comp.theirTeam}</TeamName>
                    <ProgressValue
                      isWinning={comp.theirProgress > comp.ourProgress}
                    >
                      {comp.theirProgress}%
                    </ProgressValue>
                  </ProgressHeader>
                  <ProgressBar>
                    <ProgressFill
                      progress={comp.theirProgress}
                      isWinning={comp.theirProgress > comp.ourProgress}
                    />
                  </ProgressBar>
                </CompetitionProgress>

                <div
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
                >
                  마감일: {comp.endDate}
                </div>
              </CompetitionCard>
            ))}
          </CompetitionGrid>
        </DetailedSection>

        {/* 리더보드 */}
        <DetailedSection>
          <DetailedSectionTitle>🥇 리더보드</DetailedSectionTitle>
          <LeaderboardContainer>
            {leaderboard.map((item) => (
              <LeaderboardItem key={item.team} rank={item.rank}>
                <RankBadge rank={item.rank}>{item.rank}</RankBadge>
                <LeaderboardContent>
                  <TeamNameLarge>{item.team}</TeamNameLarge>
                  <TeamStats>
                    <span>{item.wins}승</span>
                    <span>{item.losses}패</span>
                    <span>{item.points}pt</span>
                  </TeamStats>
                </LeaderboardContent>
              </LeaderboardItem>
            ))}
          </LeaderboardContainer>
        </DetailedSection>

        {/* 경기 기록 */}
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
                    {match.ourTeam}
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}
                  >
                    vs {match.theirTeam}
                  </div>
                </div>
                <MatchScore>
                  {match.ourScore} - {match.theirScore}
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
                <MatchDate>{match.date}</MatchDate>
              </div>
            </MatchHistoryItem>
          ))}
        </DetailedSection>

        {/* 실시간 활동 */}
        <DetailedSection>
          <DetailedSectionTitle>📡 실시간 활동</DetailedSectionTitle>
          {events.map((event) => (
            <EventItemComponent key={event.id} event={event} />
          ))}
        </DetailedSection>
      </CompetitionPageContainer>
    );
  }

  // 위젯 뷰 (Overview 페이지용)
  return (
    <CompetitionContainer>
      <SectionHeader>
        <SectionTitle>
          최근 활동
          <ActivityBadge>5 new</ActivityBadge>
        </SectionTitle>
        <RefreshButton onClick={handleRefresh}>🔄</RefreshButton>
      </SectionHeader>

      {events.slice(0, 3).map((event) => (
        <EventItemComponent key={event.id} event={event} />
      ))}
    </CompetitionContainer>
  );
};

export default CompetitionPage;
