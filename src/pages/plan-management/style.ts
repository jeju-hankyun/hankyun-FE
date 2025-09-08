import styled from '@emotion/styled';

export const PlanManagementContainer = styled.div`
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
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
`;

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #4a90e2, #7b68ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PageSubtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  padding: 14px 28px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${props => props.isActive
    ? `
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `
    : `
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ContentSection = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
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

export const PRCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
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
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);

    &::before {
      opacity: 1;
    }
  }
`;

export const PRHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const PRTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.3;
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#ff9800';
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      default: return '#6b7280';
    }
  }};
  box-shadow: 0 4px 12px ${props => {
    switch (props.status) {
      case 'pending': return 'rgba(255, 152, 0, 0.3)';
      case 'approved': return 'rgba(76, 175, 80, 0.3)';
      case 'rejected': return 'rgba(244, 67, 54, 0.3)';
      default: return 'rgba(107, 114, 128, 0.3)';
    }
  }};
`;

export const PRMeta = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

export const PRDescription = styled.p`
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

export const PRActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #4a90e2, #357abd);
          color: white;
          box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(74, 144, 226, 0.4);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
          box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(244, 67, 54, 0.4);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          
          &:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;

export const FormContainer = styled.form`
  display: grid;
  gap: 24px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 14px;
`;

export const Input = styled.input`
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const Textarea = styled.textarea`
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #4a90e2, #357abd);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(74, 144, 226, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;