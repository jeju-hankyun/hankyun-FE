import React, { useState } from 'react';
import styled from 'styled-components';
import { uploadProgressReport } from '../../../auth/api';
import type { UploadReportRequest, BaseResponse, UploadResponse } from '../../../auth/api/interfaces';

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


const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }
  
  input[type="number"],
  input[type="text"] {
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
      <PageHeader>
        <PageTitle>진행 보고서 업로드</PageTitle>
        <PageSubtitle>워케이션 진행 상황을 업로드하세요</PageSubtitle>
      </PageHeader>
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
