import React, { useState, useEffect } from 'react';
import {
  BattleResultsContainer,
  HeaderSection,
  PageTitle,
  PageSubtitle,
  BattleSchedule,
  NextBattleTime,
  CountdownTimer,
  ResultCard,
  ResultHeader,
  ResultTitle,
  ResultSubtitle,
  BattleComparison,
  TeamResult,
  TeamName,
  ProgressDisplay,
  ScoreDifference,
  VSResult,
  BattleStats,
  StatItem,
  StatValue,
  StatLabel,
  HistorySection,
  SectionTitle,
  HistoryList,
  HistoryItem,
  HistoryDate,
  HistoryScore,
  HistoryResult,
} from './style';

interface BattleResult {
  id: string;
  date: string;
  ourScore: number;
  theirScore: number;
  result: 'victory' | 'defeat' | 'draw';
  ourTeam: string;
  theirTeam: string;
  battleType: string;
}

const BattleResultsPage: React.FC = () => {
  const [timeUntilNextBattle, setTimeUntilNextBattle] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 가장 최근 대전 결과 (오늘 오전 6시 결과)
  const todayResult: BattleResult = {
    id: 'today',
    date: '2024-01-21',
    ourScore: 78,
    theirScore: 100,
    result: 'defeat',
    ourTeam: '우리팀',
    theirTeam: '경쟁 회사 진행도',
    battleType: '일일 진행도 대전'
  };

  // 대전 히스토리
  const battleHistory: BattleResult[] = [
    {
      id: '1',
      date: '2024-01-20',
      ourScore: 95,
      theirScore: 87,
      result: 'victory',
      ourTeam: '우리팀',
      theirTeam: '테크컴퍼니B',
      battleType: '일일 진행도 대전'
    },
    {
      id: '2',
      date: '2024-01-19',
      ourScore: 82,
      theirScore: 82,
      result: 'draw',
      ourTeam: '우리팀',
      theirTeam: '스타트업C',
      battleType: '일일 진행도 대전'
    },
    {
      id: '3',
      date: '2024-01-18',
      ourScore: 91,
      theirScore: 88,
      result: 'victory',
      ourTeam: '우리팀',
      theirTeam: '글로벌팀',
      battleType: '일일 진행도 대전'
    },
    {
      id: '4',
      date: '2024-01-17',
      ourScore: 76,
      theirScore: 89,
      result: 'defeat',
      ourTeam: '우리팀',
      theirTeam: '대기업D',
      battleType: '일일 진행도 대전'
    },
    {
      id: '5',
      date: '2024-01-16',
      ourScore: 94,
      theirScore: 91,
      result: 'victory',
      ourTeam: '우리팀',
      theirTeam: '이노베이터E',
      battleType: '일일 진행도 대전'
    }
  ];

  // 다음 대전까지 남은 시간 계산
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(6, 0, 0, 0); // 내일 오전 6시

      const timeDiff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeUntilNextBattle(`${hours}시간 ${minutes}분 ${seconds}초`);
      setCurrentTime(now);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // 통계 계산
  const victories = battleHistory.filter(battle => battle.result === 'victory').length;
  const defeats = battleHistory.filter(battle => battle.result === 'defeat').length;
  const draws = battleHistory.filter(battle => battle.result === 'draw').length;
  const winRate = Math.round((victories / battleHistory.length) * 100);
  const averageScore = Math.round(
    battleHistory.reduce((sum, battle) => sum + battle.ourScore, 0) / battleHistory.length
  );

  const getResultText = (result: 'victory' | 'defeat' | 'draw') => {
    switch (result) {
      case 'victory': return '승리';
      case 'defeat': return '패배';
      case 'draw': return '무승부';
    }
  };

  const getResultDescription = (result: 'victory' | 'defeat' | 'draw') => {
    switch (result) {
      case 'victory': return '축하합니다! 오늘 대전에서 승리했습니다!';
      case 'defeat': return '아쉽게 패배했습니다. 내일 더 열심히 해봅시다!';
      case 'draw': return '무승부입니다. 박빙의 승부였네요!';
    }
  };

  const scoreDifference = Math.abs(todayResult.ourScore - todayResult.theirScore);

  return (
    <BattleResultsContainer>
      {/* 헤더 */}
      <HeaderSection>
        <PageTitle>⚔️ 대전 결과</PageTitle>
        <PageSubtitle>매일 오전 6시, 진행도를 비교하여 승부가 결정됩니다</PageSubtitle>
        
        <BattleSchedule>
          <NextBattleTime>다음 대전까지</NextBattleTime>
          <CountdownTimer>{timeUntilNextBattle}</CountdownTimer>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            매일 오전 6:00 AM에 자동으로 대전 결과가 공개됩니다
          </div>
        </BattleSchedule>
      </HeaderSection>

      {/* 오늘의 대전 결과 */}
      <ResultCard resultType={todayResult.result}>
        <ResultHeader>
          <ResultTitle resultType={todayResult.result}>
            {getResultText(todayResult.result)}!
          </ResultTitle>
          <ResultSubtitle>
            {getResultDescription(todayResult.result)}
          </ResultSubtitle>
        </ResultHeader>

        <BattleComparison>
          <TeamResult isWinner={todayResult.result === 'victory'}>
            <TeamName>{todayResult.ourTeam}</TeamName>
            <ProgressDisplay isWinner={todayResult.result === 'victory'}>
              {todayResult.ourScore}%
            </ProgressDisplay>
            <ScoreDifference isPositive={todayResult.result === 'victory'}>
              {todayResult.result === 'victory' ? `+${scoreDifference}%` : `-${scoreDifference}%`}
            </ScoreDifference>
          </TeamResult>

          <VSResult>VS</VSResult>

          <TeamResult isWinner={todayResult.result === 'defeat'}>
            <TeamName>{todayResult.theirTeam}</TeamName>
            <ProgressDisplay isWinner={todayResult.result === 'defeat'}>
              {todayResult.theirScore}%
            </ProgressDisplay>
            <ScoreDifference isPositive={todayResult.result === 'defeat'}>
              {todayResult.result === 'defeat' ? `+${scoreDifference}%` : `-${scoreDifference}%`}
            </ScoreDifference>
          </TeamResult>
        </BattleComparison>

        <BattleStats>
          <StatItem>
            <StatValue>{todayResult.date}</StatValue>
            <StatLabel>대전 날짜</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{scoreDifference}%</StatValue>
            <StatLabel>점수 차이</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>06:00</StatValue>
            <StatLabel>대전 시간</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{todayResult.battleType}</StatValue>
            <StatLabel>대전 유형</StatLabel>
          </StatItem>
        </BattleStats>
      </ResultCard>

      {/* 통계 요약 */}
      <HistorySection>
        <SectionTitle>📊 대전 통계</SectionTitle>
        <BattleStats>
          <StatItem>
            <StatValue>{victories}</StatValue>
            <StatLabel>총 승리</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{defeats}</StatValue>
            <StatLabel>총 패배</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{draws}</StatValue>
            <StatLabel>무승부</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{winRate}%</StatValue>
            <StatLabel>승률</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{averageScore}%</StatValue>
            <StatLabel>평균 점수</StatLabel>
          </StatItem>
        </BattleStats>
      </HistorySection>

      {/* 대전 히스토리 */}
      <HistorySection>
        <SectionTitle>📜 대전 히스토리</SectionTitle>
        <HistoryList>
          {battleHistory.map((battle) => (
            <HistoryItem key={battle.id} result={battle.result}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <HistoryDate>{battle.date}</HistoryDate>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  vs {battle.theirTeam}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <HistoryScore>
                  {battle.ourScore}% - {battle.theirScore}%
                </HistoryScore>
                <HistoryResult result={battle.result}>
                  {getResultText(battle.result)}
                </HistoryResult>
              </div>
            </HistoryItem>
          ))}
        </HistoryList>
      </HistorySection>
    </BattleResultsContainer>
  );
};

export default BattleResultsPage;