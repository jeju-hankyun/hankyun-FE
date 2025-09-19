import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom'; // useParams 임포트
import { createWorkcationGroup } from '../../../auth/api';
import type { CreateWorkcationGroupRequest, BaseResponse, WorkcationGroupResponse } from '../../../auth/api/interfaces';

const PageContainer = styled.div`
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
  color: #1e293b;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

const FormCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
  }
`;

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🏖️';
    font-size: 18px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }
  
  input[type="text"],
  input[type="number"],
  input[type="date"] {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.2s ease;
    background: #ffffff;
    
    &:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-top: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const MessageText = styled.p<{ isError?: boolean }>`
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  background: ${props => props.isError ? '#fef2f2' : '#f0fdf4'};
  color: ${props => props.isError ? '#dc2626' : '#16a34a'};
  border: 1px solid ${props => props.isError ? '#fecaca' : '#bbf7d0'};
`;

const CreateWorkcationGroupPage: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>(); // URL에서 organizationId 가져오기
  const [place, setPlace] = useState<string>('');
  const [money, setMoney] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) {
      setMessage('조직 ID가 필요합니다.');
      setIsError(true);
      return;
    }
    if (!place || !money || !purpose || !startDate || !endDate) {
      setMessage('모든 필드를 입력해주세요.');
      setIsError(true);
      return;
    }

    const data: CreateWorkcationGroupRequest = {
      place,
      money: parseFloat(money),
      purpose,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<WorkcationGroupResponse> = await createWorkcationGroup(parseInt(organizationId, 10), data);
      if (response.data) {
        setMessage(`워케이션 그룹 \'${response.data.workcation_group_id}\'가 성공적으로 생성되었습니다.`);
        setIsError(false);
        // 폼 초기화 (성공 시)
        setPlace('');
        setMoney('');
        setPurpose('');
        setStartDate('');
        setEndDate('');
      } else {
        setMessage(response.message || '워케이션 그룹 생성에 실패했습니다.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error creating workcation group:', error);
      setMessage('워케이션 그룹 생성 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>워케이션 그룹 생성</PageTitle>
        <PageSubtitle>조직 ID: {organizationId}</PageSubtitle>
      </PageHeader>
      
      <FormCard>
        <CardTitle>그룹 정보 입력</CardTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="place">목적지:</label>
            <input
              id="place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              disabled={loading}
              placeholder="예: 제주도, 부산"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="money">예상 비용 (1인당):</label>
            <input
              id="money"
              type="number"
              value={money}
              onChange={(e) => setMoney(e.target.value)}
              disabled={loading}
              placeholder="예: 500000 (원)"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="purpose">목적:</label>
            <input
              id="purpose"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              disabled={loading}
              placeholder="예: 팀 빌딩, 프로젝트 완료"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="startDate">시작일:</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="endDate">종료일:</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '생성 중...' : '그룹 생성'}
          </SubmitButton>
          {message && <MessageText isError={isError}>{message}</MessageText>}
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default CreateWorkcationGroupPage;
