import React, { useState } from 'react';
import styled from 'styled-components';
import { createTripDescriptionPR, approvePR, rejectPR } from '../../../auth/api';
import type { CreateTripDescriptionPRRequest, BaseResponse, TripDescriptionPRResponse } from '../../../auth/api';

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

const FormCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  input[type="text"],
  textarea {
    width: calc(100% - 22px); // padding 고려
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ActionButton = styled.button<{ bgColor?: string }>`
  background-color: ${props => props.bgColor || '#007bff'};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    background-color: #a0cbed;
    cursor: not-allowed;
  }
`;

const MessageText = styled.p<{ isError?: boolean }>`
  margin-top: 15px;
  color: ${props => (props.isError ? 'red' : 'green')};
  font-weight: bold;
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
      <SectionTitle>Trip Description PR 관리</SectionTitle>

      <FormCard>
        <h3>PR 생성</h3>
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
        <h3>PR 승인/거절</h3>
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
