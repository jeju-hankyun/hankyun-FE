import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCvcStatus } from '../../../auth/api';
import type { CvcStatusResponse, BaseResponse } from '../../../auth/api/interfaces';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
  color: #333;
`;

const SectionTitle = styled.h2`
  color: #007bff;
  margin-bottom: 20px;
`;

const CvcStatusCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const CvcDetail = styled.p`
  font-size: 16px;
  color: #666;
  margin: 5px 0;
  strong {
    color: #333;
  }
`;

const ProgressList = styled.div`
  margin-top: 15px;
`;

const ProgressItem = styled.div<{ isWinner?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
  font-size: 15px;
  color: #555;
  font-weight: ${props => props.isWinner ? 'bold' : 'normal'};
  background-color: ${props => props.isWinner ? '#e6ffe6' : 'transparent'};
  &:last-child {
    border-bottom: none;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 18px;
  color: red;
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
      <SectionTitle>CVC 현황 조회</SectionTitle>
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
