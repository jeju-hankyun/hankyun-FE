import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { createTrip } from '../../../auth/api';
import type { CreateTripRequest, BaseResponse, TripResponse } from '../../../auth/api';

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
  input[type="date"] {
    width: calc(100% - 22px); // padding 고려
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-top: 10px;
  &:hover {
    background-color: #218838;
  }
  &:disabled {
    background-color: #94d3a2;
    cursor: not-allowed;
  }
`;

const MessageText = styled.p<{ isError?: boolean }>`
  margin-top: 15px;
  color: ${props => (props.isError ? 'red' : 'green')};
  font-weight: bold;
`;

const CreateTripPage: React.FC = () => {
  const { workcationGroupId } = useParams<{ workcationGroupId: string }>();
  const [place, setPlace] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workcationGroupId) {
      setMessage('워케이션 그룹 ID가 필요합니다.');
      setIsError(true);
      return;
    }
    if (!place || !startDate || !endDate) {
      setMessage('모든 필드를 입력해주세요.');
      setIsError(true);
      return;
    }

    const data: CreateTripRequest = {
      place,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<TripResponse> = await createTrip(parseInt(workcationGroupId, 10), data);
      if (response.data) {
        setMessage(`Trip \'${response.data.trip_id}\'가 성공적으로 생성되었습니다.`);
        setIsError(false);
        // 폼 초기화 (성공 시)
        setPlace('');
        setStartDate('');
        setEndDate('');
      } else {
        setMessage(response.message || 'Trip 생성에 실패했습니다.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      setMessage('Trip 생성 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionTitle>Trip 생성 (워케이션 그룹 ID: {workcationGroupId})</SectionTitle>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="place">목적지:</label>
            <input
              id="place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              disabled={loading}
              placeholder="예: 제주도, 서울"
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
            {loading ? '생성 중...' : 'Trip 생성'}
          </SubmitButton>
          {message && <MessageText isError={isError}>{message}</MessageText>}
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default CreateTripPage;
