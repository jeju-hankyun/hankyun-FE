import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCvcStatus } from '../../../auth/api';
import type { CvcStatusResponse, BaseResponse } from '../../../auth/api/interfaces';

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

const CvcStatusCard = styled.div`
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
    content: '📊';
    font-size: 18px;
  }
`;

const CvcDetail = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 8px 0;
  line-height: 1.5;
  
  strong {
    color: #374151;
    font-weight: 600;
  }
`;

const ProgressList = styled.div`
  margin-top: 20px;
`;

const ProgressItem = styled.div<{ isWinner?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 15px;
  color: #64748b;
  font-weight: ${props => props.isWinner ? '600' : '500'};
  background: ${props => props.isWinner ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#f8fafc'};
  border: 1px solid ${props => props.isWinner ? '#bbf7d0' : '#e2e8f0'};
  margin-bottom: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  
  input {
    flex: 1;
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
  }
  
  button {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
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
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #dc2626;
  font-weight: 500;
`;

const CvcStatusPage: React.FC = () => {
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cvcStatus, setCvcStatus] = useState<CvcStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCvcStatus = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const response: BaseResponse<CvcStatusResponse> = await getCvcStatus(date);
      if (response.data) {
        setCvcStatus(response.data);
      } else {
        setCvcStatus(null);
        setError(response.message || 'CVC 현황을 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error('Error fetching CVC status:', err);
      setError('CVC 현황을 불러오는 중 오류가 발생했습니다.');
      setCvcStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvcStatus(targetDate);
  }, [targetDate]);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>CVC 현황 조회</PageTitle>
        <PageSubtitle>일일 CVC 진행 상황을 확인하세요</PageSubtitle>
      </PageHeader>
      <CvcStatusCard>
        <InputGroup>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={loading}
          />
          <button onClick={() => fetchCvcStatus(targetDate)} disabled={loading}>
            {loading ? '조회 중...' : '현황 조회'}
          </button>
        </InputGroup>

        {error && <ErrorText>{error}</ErrorText>}
        {loading ? (
          <LoadingText>CVC 현황 로딩 중...</LoadingText>
        ) : cvcStatus ? (
          <>
            <CvcDetail><strong>CVC ID:</strong> {cvcStatus.cvc_id ? cvcStatus.cvc_id : '없음'}</CvcDetail>
            <CvcDetail><strong>날짜:</strong> {cvcStatus.cvc_date ? cvcStatus.cvc_date : '없음'}</CvcDetail>
            <CvcDetail><strong>완료 여부:</strong> {cvcStatus.is_completed !== null ? (cvcStatus.is_completed === 1 ? '완료' : '진행 중') : '정보 없음'}</CvcDetail>
            <CvcDetail><strong>총 매치 수:</strong> {cvcStatus.matches ? cvcStatus.matches : '없음'}</CvcDetail>
            {cvcStatus.winner && <CvcDetail><strong>승자 그룹 ID:</strong> {cvcStatus.winner} 🏆</CvcDetail>}
            
            <h4 style={{ marginTop: '20px', color: '#333' }}>팀별 진행률:</h4>
            {cvcStatus.progress && cvcStatus.progress.length > 0 ? (
              <ProgressList>
                {cvcStatus.progress
                  .sort((a, b) => b.progress - a.progress) // 진행률 높은 순으로 정렬
                  .map((teamProgress, index) => (
                    <ProgressItem key={teamProgress.group_id} isWinner={cvcStatus.winner === teamProgress.group_id}>
                      <span>그룹 ID: {teamProgress.group_id ? teamProgress.group_id : '없음'}</span>
                      <span>진행률: {teamProgress.progress ? teamProgress.progress : '없음'}</span>
                    </ProgressItem>
                  ))}
              </ProgressList>
            ) : (
              <p style={{ textAlign: 'center', color: '#777' }}>팀별 진행률 정보가 없습니다.</p>
            )}
          </>
        ) : (
          <p style={{ textAlign: 'center' }}>선택된 날짜의 CVC 현황이 없습니다.</p>
        )}
      </CvcStatusCard>
    </PageContainer>
  );
};

export default CvcStatusPage;
