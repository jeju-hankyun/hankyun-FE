import React, { useState } from 'react';
import styled from 'styled-components';
import { uploadProgressReport } from '../../../auth/api';
import type { UploadReportRequest, BaseResponse, UploadResponse } from '../../../auth/api';

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
  input[type="number"],
  input[type="text"] {
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

const UploadReportPage: React.FC = () => {
  const [tripId, setTripId] = useState<string>('');
  const [matchId, setMatchId] = useState<string>('');
  const [documentId, setDocumentId] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId || !matchId || !documentId || !longitude || !latitude) {
      setMessage('모든 필드를 입력해주세요.');
      setIsError(true);
      return;
    }

    const data: UploadReportRequest = {
      trip_id: parseInt(tripId, 10),
      match_id: parseInt(matchId, 10),
      document_id: parseInt(documentId, 10),
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    };

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<UploadResponse> = await uploadProgressReport(data);
      if (response.data) {
        setMessage(`보고서가 성공적으로 업로드되었습니다. ID: ${response.data.workcation_cvc_upload_id}`);
        setIsError(false);
        // 폼 초기화
        setTripId('');
        setMatchId('');
        setDocumentId('');
        setLongitude('');
        setLatitude('');
      } else {
        setMessage(response.message || '보고서 업로드에 실패했습니다.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error uploading progress report:', error);
      setMessage('보고서 업로드 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionTitle>진행 보고서 업로드</SectionTitle>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="tripId">Trip ID:</label>
            <input
              id="tripId"
              type="number"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              disabled={loading}
              placeholder="Trip ID"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="matchId">Match ID:</label>
            <input
              id="matchId"
              type="number"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              disabled={loading}
              placeholder="Match ID"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="documentId">Document ID:</label>
            <input
              id="documentId"
              type="number"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              disabled={loading}
              placeholder="Document ID"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="longitude">경도:</label>
            <input
              id="longitude"
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              disabled={loading}
              placeholder="경도 (예: 126.978)"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="latitude">위도:</label>
            <input
              id="latitude"
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              disabled={loading}
              placeholder="위도 (예: 37.566)"
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '업로드 중...' : '보고서 업로드'}
          </SubmitButton>
          {message && <MessageText isError={isError}>{message}</MessageText>}
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default UploadReportPage;
