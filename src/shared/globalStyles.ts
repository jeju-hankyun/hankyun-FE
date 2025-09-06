import styled from '@emotion/styled';

export const DashboardContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  min-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
`;

export const MainLayout = styled.div`
  display: flex;
  min-height: calc(100vh - 32px);
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const Sidebar = styled.nav`
  width: 220px;
  background: rgba(255, 255, 255, 0.08);
  padding: 24px 0;
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  height: fit-content;
  position: sticky;
  top: 0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 45px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 1024px) {
    width: 180px;
  }

  @media (max-width: 768px) {
    width: 160px;
    padding: 16px 0;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const SidebarButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  color: ${props => props.isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)"};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: ${props => props.isActive ? "3px solid #4a90e2" : "3px solid transparent"};
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }
`;

export const SidebarIcon = styled.span`
  margin-right: 12px;
  font-size: 16px;
`;

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 32px);
`;

export const NotificationWidget = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, #ff4757, #ff3838);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: pulse 2s infinite;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 35px rgba(255, 71, 87, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;