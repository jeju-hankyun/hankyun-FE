import React, { useState } from 'react';
import styled from 'styled-components';
import { postWorker } from '../../auth/api';
import type { WorkerCreateRequest, BaseResponse } from '../../auth/api/interfaces';

const PageContainer = styled.div`
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
  color: #1e293b;
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

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }
  
  input {
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
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-top: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
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

const WorkerRegistrationPage: React.FC = () => {
  const [companyId, setCompanyId] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [rank, setRank] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !jobTitle || !rank) {
      setMessage('모든 필드를 입력해주세요.');
      setIsError(true);
      return;
    }

    const data: WorkerCreateRequest = {
      company_id: parseInt(companyId, 10),
      job_title: jobTitle,
      rank: rank,
    };

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<string> = await postWorker(data);
      if (response.message) {
        setMessage(response.message || '근로자 정보가 성공적으로 등록되었습니다.');
        setIsError(false);
      } else {
        setMessage('근로자 정보 등록에 실패했습니다.');
        setIsError(true);
      }
      // 폼 초기화 (성공 시)
      setCompanyId('');
      setJobTitle('');
      setRank('');
    } catch (error) {
      console.error('Error registering worker:', error);
      setMessage('근로자 정보 등록 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>근로자 정보 등록</PageTitle>
        <PageSubtitle>새로운 근로자 정보를 등록하세요</PageSubtitle>
      </PageHeader>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="companyId">회사 ID:</label>
            <input
              id="companyId"
              type="number"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="jobTitle">직업:</label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="rank">직급:</label>
            <input
              id="rank"
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '등록 중...' : '등록'}
          </SubmitButton>
          {message && <MessageText isError={isError}>{message}</MessageText>}
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default WorkerRegistrationPage;
