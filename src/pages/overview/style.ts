import styled from '@emotion/styled';

export const OverviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const StatusCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4a90e2, #7b68ee, #ff6b9d);
    border-radius: 20px 20px 0 0;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.12);
  }
`;

export const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const StatusTitle = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

export const StatusIcon = styled.span`
  width: 24px;
  height: 24px;
  opacity: 0.7;
`;

export const StatusValue = styled.div<{ colorClass: string }>`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  
  &.online { color: #4caf50; }
  &.progress { color: #2196f3; }
  &.memory { color: #9c27b0; }
  &.uptime { color: #ff9800; }
`;

export const StatusSubtitle = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;