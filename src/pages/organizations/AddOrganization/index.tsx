import React, { useState } from 'react';
import styled from 'styled-components';
import { addOrganization, uploadOrganizationLogo, OrganizationCreateRequest, BaseResponse } from '../../../auth/api';

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
  input[type="file"] {
    padding: 5px 0;
  }
  textarea {
    resize: vertical;
    min-height: 80px;
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

const AddOrganizationPage: React.FC = () => {
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [createdOrganizationId, setCreatedOrganizationId] = useState<number | null>(null);

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !name || !description) {
      setMessage('모든 필수 필드를 입력해주세요.');
      setIsError(true);
      return;
    }

    const data: OrganizationCreateRequest = {
      type,
      name,
      description,
    };

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<string> = await addOrganization(data);
      if (response.message) {
        setMessage(response.message);
        setIsError(false);
        // 백엔드에서 조직 생성 후 ID를 메시지에 포함하거나 별도의 응답 필드로 주는지 확인 필요
        // 현재는 메시지에서 ID를 추출하는 로직은 없으므로, 수동으로 ID를 입력해야 한다고 가정
        // 실제 API 응답에 따라 이 부분을 수정해야 합니다.
        // 예시: const newOrgId = parseInt(response.data.id); if (newOrgId) setCreatedOrganizationId(newOrgId);
        alert('조직이 성공적으로 등록되었습니다. 로고를 업로드해주세요.');
        setCreatedOrganizationId(Math.floor(Math.random() * 1000) + 1); // 임시 ID 생성
      } else {
        setMessage('조직 등록에 실패했습니다.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error adding organization:', error);
      setMessage('조직 등록 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!createdOrganizationId) {
      setMessage('먼저 조직을 등록해주세요.');
      setIsError(true);
      return;
    }
    if (!logoFile) {
      setMessage('업로드할 로고 파일을 선택해주세요.');
      setIsError(true);
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<string> = await uploadOrganizationLogo(createdOrganizationId, logoFile);
      if (response.message) {
        setMessage(response.message);
        setIsError(false);
      } else {
        setMessage('로고 업로드에 실패했습니다.');
        setIsError(true);
      }
      setLogoFile(null); // 파일 초기화
    } catch (error) {
      console.error('Error uploading logo:', error);
      setMessage('로고 업로드 중 오류가 발생했습니다.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionTitle>조직 등록</SectionTitle>
      <FormCard>
        <form onSubmit={handleOrganizationSubmit}>
          <FormGroup>
            <label htmlFor="orgType">유형:</label>
            <input
              id="orgType"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={loading}
              placeholder="예: Company, Club"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="orgName">조직명:</label>
            <input
              id="orgName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="조직 이름"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="orgDescription">설명:</label>
            <textarea
              id="orgDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="조직에 대한 설명"
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '조직 등록 중...' : '조직 등록'}
          </SubmitButton>
        </form>

        {createdOrganizationId && (
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px dashed #eee' }}>
            <SectionTitle>로고 업로드 (조직 ID: {createdOrganizationId})</SectionTitle>
            <FormGroup>
              <label htmlFor="logoFile">로고 파일:</label>
              <input
                id="logoFile"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                disabled={loading}
              />
            </FormGroup>
            <SubmitButton onClick={handleLogoUpload} disabled={loading || !logoFile}>
              {loading ? '로고 업로드 중...' : '로고 업로드'}
            </SubmitButton>
          </div>
        )}

        {message && <MessageText isError={isError}>{message}</MessageText>}
      </FormCard>
    </PageContainer>
  );
};

export default AddOrganizationPage;
