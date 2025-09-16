import React, { useState } from 'react';
import styled from 'styled-components';
import { postClubMember } from '../../auth/api';
import type { ClubMemberCreateRequest, BaseResponse } from '../../auth/api';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
  color: #333;
`;

const FormCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #007bff;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  input {
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

const ClubMemberRegistrationPage: React.FC = () => {
  const [clubId, setClubId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) {
      setMessage('클럽 ID를 입력해주세요.');
      setIsError(true);
      return;
    }

    const data: ClubMemberCreateRequest = {
      club_id: parseInt(clubId, 10),
    };

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<string> = await postClubMember(data);
      if (response.message) {
        setMessage(response.message || '클럽 멤버 정보가 성공적으로 등록되었습니다.');
        setIsError(false);
      } else {
        setMessage('클럽 멤버 정보 등록에 실패했습니다.');
        setIsError(true);
      }
      // 폼 초기화 (성공 시)
      setClubId('');
    } catch (error) {
      console.error('Error registering club member:', error);
      setMessage('클럽 멤버 정보 등록 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionTitle>클럽 멤버 정보 등록</SectionTitle>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="clubId">클럽 ID:</label>
            <input
              id="clubId"
              type="number"
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
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

export default ClubMemberRegistrationPage;
