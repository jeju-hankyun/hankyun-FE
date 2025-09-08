import styled from '@emotion/styled';

export const BattleResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const HeaderSection = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ffd700, #ff6b6b);
    background-size: 200% 100%;
    animation: battle-glow 3s linear infinite;
  }

  @keyframes battle-glow {
    0% { background-position: 0% 0; }
    100% { background-position: 200% 0; }
  }
`;

export const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #ff6b6b, #ffd700, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: title-pulse 2s ease-in-out infinite;

  @keyframes title-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

export const PageSubtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
`;

export const BattleSchedule = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

export const NextBattleTime = styled.div`
  font-size: 24px;
  color: #ff6b6b;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: '⏰';
    font-size: 28px;
    animation: tick 1s ease-in-out infinite;
  }

  @keyframes tick {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

export const ResultCard = styled.div<{ resultType: 'victory' | 'defeat' | 'draw' }>`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(20px);
  border: 2px solid ${props => {
    switch (props.resultType) {
      case 'victory': return '#4caf50';
      case 'defeat': return '#f44336';
      case 'draw': return '#ff9800';
    }
  }};
  box-shadow: 0 12px 40px ${props => {
    switch (props.resultType) {
      case 'victory': return 'rgba(76, 175, 80, 0.3)';
      case 'defeat': return 'rgba(244, 67, 54, 0.3)';
      case 'draw': return 'rgba(255, 152, 0, 0.3)';
    }
  }};
  position: relative;
  overflow: hidden;
  animation: ${props => {
    switch (props.resultType) {
      case 'victory': return 'victory-glow';
      case 'defeat': return 'defeat-pulse';
      case 'draw': return 'draw-shimmer';
    }
  }} 3s ease-in-out infinite;

  &::before {
    content: '${props => {
      switch (props.resultType) {
        case 'victory': return '🎉';
        case 'defeat': return '💪';
        case 'draw': return '🤝';
      }
    }}';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 32px;
    animation: float 2s ease-in-out infinite;
  }

  @keyframes victory-glow {
    0%, 100% { box-shadow: 0 12px 40px rgba(76, 175, 80, 0.3); }
    50% { box-shadow: 0 20px 60px rgba(76, 175, 80, 0.6); }
  }

  @keyframes defeat-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }

  @keyframes draw-shimmer {
    0%, 100% { border-color: #ff9800; }
    50% { border-color: #ffb74d; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }
`;

export const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const ResultTitle = styled.h2<{ resultType: 'victory' | 'defeat' | 'draw' }>`
  font-size: 32px;
  font-weight: 700;
  color: ${props => {
    switch (props.resultType) {
      case 'victory': return '#4caf50';
      case 'defeat': return '#f44336';
      case 'draw': return '#ff9800';
    }
  }};
  margin: 0 0 8px 0;
  text-shadow: 0 0 20px ${props => {
    switch (props.resultType) {
      case 'victory': return 'rgba(76, 175, 80, 0.5)';
      case 'defeat': return 'rgba(244, 67, 54, 0.5)';
      case 'draw': return 'rgba(255, 152, 0, 0.5)';
    }
  }};
`;

export const ResultSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

export const BattleComparison = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 40px;
  align-items: center;
  margin: 32px 0;
`;

export const TeamResult = styled.div<{ isWinner?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 2px solid ${props => props.isWinner ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
  position: relative;
  transition: all 0.3s ease;

  ${props => props.isWinner && `
    background: rgba(255, 215, 0, 0.1);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
    transform: scale(1.05);

    &::before {
      content: '👑';
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 28px;
      animation: crown-bounce 1s ease-in-out infinite;
    }
  `}

  @keyframes crown-bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
    40% { transform: translateX(-50%) translateY(-8px); }
    60% { transform: translateX(-50%) translateY(-4px); }
  }
`;

export const TeamName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
  text-align: center;
`;

export const ProgressDisplay = styled.div<{ isWinner?: boolean }>`
  font-size: 48px;
  font-weight: 700;
  color: ${props => props.isWinner ? '#ffd700' : '#ffffff'};
  margin-bottom: 12px;
  text-shadow: ${props => props.isWinner ? '0 0 20px #ffd700' : 'none'};
  animation: ${props => props.isWinner ? 'winner-glow' : 'none'} 2s ease-in-out infinite;

  @keyframes winner-glow {
    0%, 100% { text-shadow: 0 0 20px #ffd700; }
    50% { text-shadow: 0 0 40px #ffd700; }
  }
`;

export const ScoreDifference = styled.div<{ isPositive: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.isPositive ? '#4caf50' : '#f44336'};
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '${props => props.isPositive ? '↗️' : '↘️'}';
    font-size: 14px;
  }
`;

export const VSResult = styled.div`
  font-size: 64px;
  font-weight: 900;
  color: #ff6b6b;
  text-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
  animation: vs-pulse 2s ease-in-out infinite;
  position: relative;

  &::before {
    content: '⚔️';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    animation: sword-clash 1.5s ease-in-out infinite;
  }

  @keyframes vs-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes sword-clash {
    0%, 100% { opacity: 0.7; transform: translateX(-50%) rotate(0deg); }
    50% { opacity: 1; transform: translateX(-50%) rotate(10deg); }
  }
`;

export const BattleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 32px;
`;

export const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #4a90e2;
  margin-bottom: 8px;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

export const HistorySection = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HistoryItem = styled.div<{ result: 'victory' | 'defeat' | 'draw' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid ${props => {
    switch (props.result) {
      case 'victory': return '#4caf50';
      case 'defeat': return '#f44336';
      case 'draw': return '#ff9800';
    }
  }};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }
`;

export const HistoryDate = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

export const HistoryScore = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
`;

export const HistoryResult = styled.div<{ result: 'victory' | 'defeat' | 'draw' }>`
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch (props.result) {
      case 'victory': return '#4caf50';
      case 'defeat': return '#f44336';
      case 'draw': return '#ff9800';
    }
  }};
`;

export const CountdownTimer = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #ff6b6b;
  text-align: center;
  margin: 16px 0;
  padding: 12px 20px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: '⏳';
    font-size: 24px;
    animation: countdown-spin 2s linear infinite;
  }

  @keyframes countdown-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;