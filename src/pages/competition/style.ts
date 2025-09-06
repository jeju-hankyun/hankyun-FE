import styled from '@emotion/styled';

export const CompetitionPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const CompetitionContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 50px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.12);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PageSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
`;

export const ActivityBadge = styled.span`
  background: #f44336;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  margin-left: 8px;
`;

export const RefreshButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const CompetitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

export const CompetitionCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  }
`;

export const CompetitionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const CompetitionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

export const CompetitionStatus = styled.div<{ status: 'active' | 'completed' | 'upcoming' }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: #4caf50;
          color: white;
        `;
      case 'completed':
        return `
          background: #9e9e9e;
          color: white;
        `;
      case 'upcoming':
        return `
          background: #ff9800;
          color: white;
        `;
      default:
        return `
          background: #4caf50;
          color: white;
        `;
    }
  }}
`;

export const CompetitionProgress = styled.div`
  margin-bottom: 16px;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const TeamName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

export const ProgressValue = styled.span<{ isWinning?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.isWinning ? '#4caf50' : '#ff9800'};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const ProgressFill = styled.div<{ progress: number; isWinning?: boolean }>`
  height: 100%;
  background: ${props => props.isWinning ? 
    'linear-gradient(90deg, #4caf50, #66bb6a)' : 
    'linear-gradient(90deg, #ff9800, #ffb74d)'
  };
  width: ${props => props.progress}%;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const EventItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-left: 3px solid #ff9800;
  padding-left: 20px;
  margin-bottom: 20px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    margin-left: -8px;
    padding-left: 28px;
  }
`;

export const EventIndicator = styled.div`
  width: 10px;
  height: 10px;
  background: #ff9800;
  border-radius: 50%;
  margin-right: 16px;
  margin-top: 8px;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ff9800;
    border-radius: 50%;
    top: 0;
    left: 0;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

export const EventContent = styled.div`
  flex: 1;
`;

export const EventTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
  color: #ffffff;
  font-size: 15px;
`;

export const EventDescription = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
  line-height: 1.4;
`;

export const EventMeta = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '•';
    color: #ff9800;
  }
`;

export const DetailedSection = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const DetailedSectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

export const LeaderboardContainer = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const LeaderboardItem = styled.div<{ rank: number }>`
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;

  ${props => props.rank <= 3 && `
    background: linear-gradient(90deg, 
      ${props.rank === 1 ? 'rgba(255, 215, 0, 0.1)' :
        props.rank === 2 ? 'rgba(192, 192, 192, 0.1)' :
        'rgba(205, 127, 50, 0.1)'}, 
      rgba(255, 255, 255, 0.02)
    );
    border-left: 3px solid ${
      props.rank === 1 ? '#ffd700' :
      props.rank === 2 ? '#c0c0c0' :
      '#cd7f32'
    };
  `}
`;

export const RankBadge = styled.div<{ rank: number }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
  font-size: 14px;

  ${props => {
    if (props.rank === 1) {
      return `
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #333;
      `;
    } else if (props.rank === 2) {
      return `
        background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
        color: #333;
      `;
    } else if (props.rank === 3) {
      return `
        background: linear-gradient(135deg, #cd7f32, #daa520);
        color: #fff;
      `;
    } else {
      return `
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
      `;
    }
  }}
`;

export const LeaderboardContent = styled.div`
  flex: 1;
`;

export const TeamNameLarge = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

export const TeamStats = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

export const MatchHistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const MatchTeams = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const MatchResult = styled.div<{ result: 'win' | 'lose' | 'draw' }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  
  ${props => {
    switch (props.result) {
      case 'win':
        return `
          background: #4caf50;
          color: white;
        `;
      case 'lose':
        return `
          background: #f44336;
          color: white;
        `;
      case 'draw':
        return `
          background: #ff9800;
          color: white;
        `;
      default:
        return `
          background: #9e9e9e;
          color: white;
        `;
    }
  }}
`;

export const MatchScore = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

export const MatchDate = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;