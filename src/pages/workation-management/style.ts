import styled from '@emotion/styled';

export const WorkationManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const ManagementContainer = styled.div`
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
  background: linear-gradient(135deg, #4a90e2, #7b68ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PageSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
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

export const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

export const ToolItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);

    &::before {
      opacity: 1;
    }
  }
`;

export const ToolIcon = styled.div<{ gradient: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  margin-right: 20px;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  background: ${props => props.gradient};

  ${ToolItem}:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  }
`;

export const ToolInfo = styled.div`
  flex: 1;
`;

export const ToolName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #ffffff;
`;

export const ToolDescription = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
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