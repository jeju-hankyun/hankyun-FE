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
  LoadingText,
  ErrorText,
} from './style';
import { getCvcStatus } from '../../auth/api';
import type { BaseResponse, CvcStatusResponse } from '../../auth/api/interfaces';

interface BattleResult {
  id: string; // cvc_id
  date: string; // cvc_date
  ourScore: number; // progress[0].progress
  theirScore: number; // progress[1].progress
  result: 'victory' | 'defeat' | 'draw';
  ourTeam: string; // 임시값 또는 실제 그룹명
  theirTeam: string; // 임시값 또는 실제 그룹명
  battleType: string; // "일일 진행도 대전"
}

const mapCvcStatusToBattleResult = (cvcStatus: CvcStatusResponse): BattleResult => {
  const ourScore = cvcStatus.progress?.[0]?.progress || 0;
  const theirScore = cvcStatus.progress?.[1]?.progress || 0;
  let result: 'victory' | 'defeat' | 'draw' = 'draw';

  if (cvcStatus.is_completed === 1) {
    if (cvcStatus.winner === cvcStatus.progress?.[0]?.group_id) {
      result = 'victory';
    } else if (cvcStatus.winner === cvcStatus.progress?.[1]?.group_id) {
      result = 'defeat';
    } else if (cvcStatus.winner === null && ourScore === theirScore) {
      result = 'draw'; // 백엔드에서 winner가 null이고 점수가 같으면 무승부
    } else if (cvcStatus.winner === null && ourScore !== theirScore) {
      // winner가 null인데 점수가 다르면, 점수 비교로 승패 결정 (백엔드 로직에 따라 다를 수 있음)
      result = ourScore > theirScore ? 'victory' : 'defeat';
    }
  } else {
    // 아직 완료되지 않은 대전은 무승부로 표시
    result = 'draw';
  }

  return {
    id: String(cvcStatus.cvc_id),
    date: cvcStatus.cvc_date || '없음',
    ourScore: ourScore,
    theirScore: theirScore,
    result: result,
    ourTeam: '우리팀', // 임시값
    theirTeam: '상대팀', // 임시값
    battleType: '일일 진행도 대전',
  };
};

const BattleResultsPage: React.FC = () => {
  const [timeUntilNextBattle, setTimeUntilNextBattle] = useState('');
  const [latestBattleResult, setLatestBattleResult] = useState<BattleResult | null>(null);
  const [battleHistory, setBattleHistory] = useState<BattleResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBattleResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const datesToFetch: string[] = [];
      for (let i = 0; i < 7; i++) { // 최근 7일간의 CVC 상태를 가져옵니다.
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        datesToFetch.push(d.toISOString().split('T')[0]);
      }

      const results: BattleResult[] = [];
      for (const date of datesToFetch) {
        try {
          const response: BaseResponse<CvcStatusResponse> = await getCvcStatus(date);
          if (response.data) {
            results.push(mapCvcStatusToBattleResult(response.data));
          }
        } catch (dailyError) {
          console.warn(`Error fetching CVC status for ${date}:`, dailyError);
        }
      }

      if (results.length > 0) {
        setLatestBattleResult(results[0]); // 가장 최근 결과
        setBattleHistory(results.slice(1)); // 나머지 히스토리
      } else {
        setError('대전 결과를 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error('Error fetching battle results:', err);
      setError('대전 결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattleResults();
  }, []);

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
    battleHistory.reduce((sum, battle) => sum + battle.ourScore, 0) / (battleHistory.length || 1)
  );

  const getResultText = (result: 'victory' | 'defeat' | 'draw') => {
    switch (result) {
      case 'victory': return '승리';
      case 'defeat': return '패배';
      case 'draw': return '무승부';
      default: return '알 수 없음';
    }
  };

  const getResultDescription = (result: 'victory' | 'defeat' | 'draw') => {
    switch (result) {
      case 'victory': return '축하합니다! 오늘 대전에서 승리했습니다!';
      case 'defeat': return '아쉽게 패배했습니다. 내일 더 열심히 해봅시다!';
      case 'draw': return '무승부입니다. 박빙의 승부였네요!';
      default: return '현재 대전 정보 없음';
    }
  };

  const scoreDifference = Math.abs((latestBattleResult?.ourScore || 0) - (latestBattleResult?.theirScore || 0));

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

      {error && <ErrorText>{error}</ErrorText>}
      {loading && <LoadingText>대전 결과를 로딩 중...</LoadingText>}

      {latestBattleResult && !loading && !error ? (
        <ResultCard resultType={latestBattleResult.result}>
          <ResultHeader>
            <ResultTitle resultType={latestBattleResult.result}>
              {getResultText(latestBattleResult.result)}!
            </ResultTitle>
            <ResultSubtitle>
              {getResultDescription(latestBattleResult.result)}
            </ResultSubtitle>
          </ResultHeader>

          <BattleComparison>
            <TeamResult isWinner={latestBattleResult.result === 'victory'}>
              <TeamName>{latestBattleResult.ourTeam}</TeamName>
              <ProgressDisplay isWinner={latestBattleResult.result === 'victory'}>
                {latestBattleResult.ourScore}%
              </ProgressDisplay>
              <ScoreDifference isPositive={latestBattleResult.result === 'victory'}>
                {latestBattleResult.result === 'victory' ? `+${scoreDifference}%` : `-${scoreDifference}%`}
              </ScoreDifference>
            </TeamResult>

            <VSResult>VS</VSResult>

            <TeamResult isWinner={latestBattleResult.result === 'defeat'}>
              <TeamName>{latestBattleResult.theirTeam}</TeamName>
              <ProgressDisplay isWinner={latestBattleResult.result === 'defeat'}>
                {latestBattleResult.theirScore}%
              </ProgressDisplay>
              <ScoreDifference isPositive={latestBattleResult.result === 'defeat'}>
                {latestBattleResult.result === 'defeat' ? `+${scoreDifference}%` : `-${scoreDifference}%`}
              </ScoreDifference>
            </TeamResult>
          </BattleComparison>

          <BattleStats>
            <StatItem>
              <StatValue>{latestBattleResult.date}</StatValue>
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
              <StatValue>{latestBattleResult.battleType}</StatValue>
              <StatLabel>대전 유형</StatLabel>
            </StatItem>
          </BattleStats>
        </ResultCard>
      ) : (
        !loading && !error && <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>오늘의 대전 결과가 없습니다.</p>
      )}

      {/* 통계 요약 */}
      {!loading && !error && battleHistory.length > 0 && (
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
              <StatValue>{isNaN(winRate) ? 'N/A' : winRate}%</StatValue>
              <StatLabel>승률</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{isNaN(averageScore) ? 'N/A' : averageScore}%</StatValue>
              <StatLabel>평균 점수</StatLabel>
            </StatItem>
          </BattleStats>
        </HistorySection>
      )}
      {!loading && !error && battleHistory.length === 0 && <p style={{ textAlign: 'center', fontSize: '16px', color: '#888' }}>대전 통계가 없습니다.</p>}

      {/* 대전 히스토리 */}
      {!loading && !error && battleHistory.length > 0 && (
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
      )}
      {!loading && !error && battleHistory.length === 0 && <p style={{ textAlign: 'center', fontSize: '16px', color: '#888' }}>대전 히스토리가 없습니다.</p>}
    </BattleResultsContainer>
  );
};

export default BattleResultsPage;