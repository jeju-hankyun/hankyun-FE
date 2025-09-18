import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  createDailyCvc,
  updateUploadState,
  completeDailyCvc,
  WORKCATION_CVC_UPLOAD_STATE_SUCCESS,
  WORKCATION_CVC_UPLOAD_STATE_FAILED,
} from '../../../auth/api';
import type {
  CreateDailyCvcRequest,
  UpdateUploadStateRequest,
  WorkcationCvcUploadState,
  BaseResponse,
} from '../../../auth/api/interfaces';

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
  input[type="date"],
  input[type="number"],
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
  margin-top: 10px;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    background-color: #a0cbed;
    cursor: not-allowed;
  }
`;

const MessageText = styled.p<{ $isError?: boolean }>`
  margin-top: 15px;
  color: ${props => (props.$isError ? 'red' : 'green')};
  font-weight: bold;
`;

const CvcManagementPage: React.FC = () => {
  // 일일 CVC 생성 상태
  const [dailyCvcDate, setDailyCvcDate] = useState<string>('');
  const [dailyCvcGroupIds, setDailyCvcGroupIds] = useState<string>(''); // 콤마로 구분된 ID
  const [createCvcLoading, setCreateCvcLoading] = useState(false);
  const [createCvcMessage, setCreateCvcMessage] = useState<string | null>(null);
  const [createCvcError, setCreateCvcError] = useState(false);

  // 업로드 상태 업데이트 상태
  const [uploadId, setUploadId] = useState<string>('');
  const [uploadState, setUploadState] = useState<WorkcationCvcUploadState>(WORKCATION_CVC_UPLOAD_STATE_SUCCESS);
  const [updateUploadLoading, setUpdateUploadLoading] = useState(false);
  const [updateUploadMessage, setUpdateUploadMessage] = useState<string | null>(null);
  const [updateUploadError, setUpdateUploadError] = useState(false);

  // 일일 CVC 완료 상태
  const [completeCvcId, setCompleteCvcId] = useState<string>('');
  const [completeCvcLoading, setCompleteCvcLoading] = useState(false);
  const [completeCvcMessage, setCompleteCvcMessage] = useState<string | null>(null);
  const [completeCvcError, setCompleteCvcError] = useState(false);

  // 현재 날짜를 기본값으로 설정
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDailyCvcDate(today);
  }, []);

  const handleCreateDailyCvc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyCvcDate || !dailyCvcGroupIds) {
      setCreateCvcMessage('날짜와 그룹 ID를 입력해주세요.');
      setCreateCvcError(true);
      return;
    }
    const groupIdsArray = dailyCvcGroupIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id) && id > 0);
    if (groupIdsArray.length < 2) {
      setCreateCvcMessage('최소 2개 이상의 유효한 그룹 ID를 콤마로 구분하여 입력해주세요.');
      setCreateCvcError(true);
      return;
    }

    const data: CreateDailyCvcRequest = {
      target_date: dailyCvcDate,
      group_ids: groupIdsArray,
    };

    try {
      setCreateCvcLoading(true);
      setCreateCvcMessage(null);
      setCreateCvcError(false);
      const response: BaseResponse<string> = await createDailyCvc(data);
      if (response.message) {
        setCreateCvcMessage(response.message || '일일 CVC가 성공적으로 생성되었습니다.');
        setCreateCvcError(false);
      } else {
        setCreateCvcMessage('일일 CVC 생성에 실패했습니다.');
        setCreateCvcError(true);
      }
    } catch (error) {
      console.error('Error creating daily CVC:', error);
      setCreateCvcMessage('일일 CVC 생성 중 오류가 발생했습니다.');
      setCreateCvcError(true);
    } finally {
      setCreateCvcLoading(false);
    }
  };

  const handleUpdateUploadState = async () => {
    if (!uploadId) {
      setUpdateUploadMessage('업로드 ID를 입력해주세요.');
      setUpdateUploadError(true);
      return;
    }
    const data: UpdateUploadStateRequest = {
      state: uploadState,
    };
    try {
      setUpdateUploadLoading(true);
      setUpdateUploadMessage(null);
      setUpdateUploadError(false);
      const response: BaseResponse<string> = await updateUploadState(parseInt(uploadId, 10), data);
      if (response.message) {
        setUpdateUploadMessage(response.message || '업로드 상태가 성공적으로 업데이트되었습니다.');
        setUpdateUploadError(false);
      } else {
        setUpdateUploadMessage('업로드 상태 업데이트에 실패했습니다.');
        setUpdateUploadError(true);
      }
    } catch (error) {
      console.error('Error updating upload state:', error);
      setUpdateUploadMessage('업로드 상태 업데이트 중 오류가 발생했습니다.');
      setUpdateUploadError(true);
    } finally {
      setUpdateUploadLoading(false);
    }
  };

  const handleCompleteDailyCvc = async () => {
    if (!completeCvcId) {
      setCompleteCvcMessage('CVC ID를 입력해주세요.');
      setCompleteCvcError(true);
      return;
    }
    try {
      setCompleteCvcLoading(true);
      setCompleteCvcMessage(null);
      setCompleteCvcError(false);
      const response: BaseResponse<string> = await completeDailyCvc(parseInt(completeCvcId, 10));
      if (response.message) {
        setCompleteCvcMessage(response.message || '일일 CVC가 성공적으로 완료되었습니다.');
        setCompleteCvcError(false);
      } else {
        setCompleteCvcMessage('일일 CVC 완료에 실패했습니다.');
        setCompleteCvcError(true);
      }
    } catch (error) {
      console.error('Error completing daily CVC:', error);
      setCompleteCvcMessage('일일 CVC 완료 중 오류가 발생했습니다.');
      setCompleteCvcError(true);
    } finally {
      setCompleteCvcLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionTitle>CVC 관리</SectionTitle>

      <FormCard>
        <h3>일일 CVC 생성</h3>
        <form onSubmit={handleCreateDailyCvc}>
          <FormGroup>
            <label htmlFor="dailyCvcDate">날짜 (YYYY-MM-DD):</label>
            <input
              id="dailyCvcDate"
              type="date"
              value={dailyCvcDate}
              onChange={(e) => setDailyCvcDate(e.target.value)}
              disabled={createCvcLoading}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="dailyCvcGroupIds">그룹 ID (콤마로 구분):</label>
            <input
              id="dailyCvcGroupIds"
              type="text"
              value={dailyCvcGroupIds}
              onChange={(e) => setDailyCvcGroupIds(e.target.value)}
              disabled={createCvcLoading}
              placeholder="예: 1,2,3,4"
            />
          </FormGroup>
          <ActionButton type="submit" disabled={createCvcLoading}>
            {createCvcLoading ? '생성 중...' : '일일 CVC 생성'}
          </ActionButton>
          {createCvcMessage && <MessageText $isError={createCvcError}>{createCvcMessage}</MessageText>}
        </form>
      </FormCard>

      <FormCard>
        <h3>업로드 상태 업데이트</h3>
        <FormGroup>
          <label htmlFor="uploadId">업로드 ID:</label>
          <input
            id="uploadId"
            type="number"
            value={uploadId}
            onChange={(e) => setUploadId(e.target.value)}
            disabled={updateUploadLoading}
            placeholder="업로드 기록 ID"
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="uploadState">상태:</label>
          <select
            id="uploadState"
            value={uploadState}
            onChange={(e) => setUploadState(parseInt(e.target.value, 10) as WorkcationCvcUploadState)}
            disabled={updateUploadLoading}
          >
            <option value={WORKCATION_CVC_UPLOAD_STATE_SUCCESS}>SUCCESS</option>
            <option value={WORKCATION_CVC_UPLOAD_STATE_FAILED}>FAILED</option>
          </select>
        </FormGroup>
        <ActionButton onClick={handleUpdateUploadState} disabled={updateUploadLoading} bgColor="#ffc107">
          {updateUploadLoading ? '업데이트 중...' : '상태 업데이트'}
        </ActionButton>
        {updateUploadMessage && <MessageText $isError={updateUploadError}>{updateUploadMessage}</MessageText>}
      </FormCard>

      <FormCard>
        <h3>일일 CVC 완료</h3>
        <FormGroup>
          <label htmlFor="completeCvcId">CVC ID:</label>
          <input
            id="completeCvcId"
            type="number"
            value={completeCvcId}
            onChange={(e) => setCompleteCvcId(e.target.value)}
            disabled={completeCvcLoading}
            placeholder="완료할 CVC ID"
          />
        </FormGroup>
        <ActionButton onClick={handleCompleteDailyCvc} disabled={completeCvcLoading} bgColor="#6f42c1">
          {completeCvcLoading ? '완료 중...' : 'CVC 완료'}
        </ActionButton>
        {completeCvcMessage && <MessageText $isError={completeCvcError}>{completeCvcMessage}</MessageText>}
      </FormCard>
    </PageContainer>
  );
};

export default CvcManagementPage;
