import React, { useState } from 'react';
import styled from 'styled-components';
import { createTripDescriptionPR, approvePR, rejectPR } from '../../../auth/api';
import type { CreateTripDescriptionPRRequest, BaseResponse, TripDescriptionPRResponse } from '../../../auth/api/interfaces';

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

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '📝';
    font-size: 16px;
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
  textarea {
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
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ActionButton = styled.button<{ bgColor?: string }>`
  background: ${props => props.bgColor ? `linear-gradient(135deg, ${props.bgColor}, ${props.bgColor}dd)` : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-right: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

const TripDescriptionPrListPage: React.FC = () => {
  const [tripDescriptionId, setTripDescriptionId] = useState<string>('');
  const [writerId, setWriterId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [prIdToAct, setPrIdToAct] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleCreatePR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripDescriptionId || !writerId || !description) {
      setMessage('모든 PR 생성 필드를 입력해주세요.');
      setIsError(true);
      return;
    }

    const data: CreateTripDescriptionPRRequest = {
      writer_id: parseInt(writerId, 10),
      description,
    };

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<TripDescriptionPRResponse> = await createTripDescriptionPR(parseInt(tripDescriptionId, 10), data);
      if (response.data) {
        setMessage(`PR \'${response.data.trip_description_pr_id}\'이 성공적으로 생성되었습니다.`);
        setIsError(false);
        setTripDescriptionId('');
        setWriterId('');
        setDescription('');
      } else {
        setMessage(response.message || 'PR 생성에 실패했습니다.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error creating PR:', error);
      setMessage('PR 생성 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePR = async () => {
    if (!prIdToAct) {
      setMessage('승인할 PR ID를 입력해주세요.');
      setIsError(true);
      return;
    }
    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<TripDescriptionPRResponse> = await approvePR(parseInt(prIdToAct, 10));
      if (response.data) {
        setMessage(`PR \'${response.data.trip_description_pr_id}\'이 성공적으로 승인되었습니다.`);
        setIsError(false);
      } else {
        setMessage(response.message || 'PR 승인에 실패했습니다.');
        setIsError(true);
      }
      setPrIdToAct('');
    } catch (error) {
      console.error('Error approving PR:', error);
      setMessage('PR 승인 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPR = async () => {
    if (!prIdToAct) {
      setMessage('거절할 PR ID를 입력해주세요.');
      setIsError(true);
      return;
    }
    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<TripDescriptionPRResponse> = await rejectPR(parseInt(prIdToAct, 10));
      if (response.data) {
        setMessage(`PR \'${response.data.trip_description_pr_id}\'이 성공적으로 거절되었습니다.`);
        setIsError(false);
      } else {
        setMessage(response.message || 'PR 거절에 실패했습니다.');
        setIsError(true);
      }
      setPrIdToAct('');
    } catch (error) {
      console.error('Error rejecting PR:', error);
      setMessage('PR 거절 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Trip Description PR 관리</PageTitle>
        <PageSubtitle>워케이션 계획서 PR을 생성하고 관리하세요</PageSubtitle>
      </PageHeader>

      <FormCard>
        <CardTitle>PR 생성</CardTitle>
        <form onSubmit={handleCreatePR}>
          <FormGroup>
            <label htmlFor="tripDescriptionId">Trip Description ID:</label>
            <input
              id="tripDescriptionId"
              type="number"
              value={tripDescriptionId}
              onChange={(e) => setTripDescriptionId(e.target.value)}
              disabled={loading}
              placeholder="Trip Description ID"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="writerId">작성자 ID:</label>
            <input
              id="writerId"
              type="number"
              value={writerId}
              onChange={(e) => setWriterId(e.target.value)}
              disabled={loading}
              placeholder="작성자 ID"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="description">설명:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="PR 설명"
            />
          </FormGroup>
          <ActionButton type="submit" disabled={loading}>
            {loading ? '생성 중...' : 'PR 생성'}
          </ActionButton>
        </form>
      </FormCard>

      <FormCard>
        <CardTitle>PR 승인/거절</CardTitle>
        <FormGroup>
          <label htmlFor="prIdToAct">PR ID:</label>
          <input
            id="prIdToAct"
            type="number"
            value={prIdToAct}
            onChange={(e) => setPrIdToAct(e.target.value)}
            disabled={loading}
            placeholder="승인/거절할 PR ID"
          />
        </FormGroup>
        <ActionButton onClick={handleApprovePR} disabled={loading} bgColor="#28a745">
          {loading ? '승인 중...' : '승인'}
        </ActionButton>
        <ActionButton onClick={handleRejectPR} disabled={loading} bgColor="#dc3545">
          {loading ? '거절 중...' : '거절'}
        </ActionButton>
        {message && <MessageText isError={isError}>{message}</MessageText>}
      </FormCard>
    </PageContainer>
  );
};

export default TripDescriptionPrListPage;
