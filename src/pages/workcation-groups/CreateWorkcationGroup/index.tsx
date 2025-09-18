import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom'; // useParams 임포트
import { createWorkcationGroup } from '../../../auth/api';
import type { CreateWorkcationGroupRequest, BaseResponse, WorkcationGroupResponse } from '../../../auth/api/interfaces';

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
  input[type="number"],
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
      <SectionTitle>워케이션 그룹 생성 (조직 ID: {organizationId})</SectionTitle>
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
