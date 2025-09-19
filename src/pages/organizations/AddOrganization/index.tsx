import React, { useState } from 'react';
import styled from 'styled-components';
import { addOrganization, uploadOrganizationLogo } from '../../../auth/api';
import type { OrganizationCreateRequest, BaseResponse } from '../../../auth/api/interfaces';

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

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🏢';
    font-size: 18px;
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
  
  input[type="file"] {
    padding: 8px 0;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    background: #f9fafb;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #7c3aed;
      background: #f3f4f6;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-top: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
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
      <PageHeader>
        <PageTitle>조직 등록</PageTitle>
        <PageSubtitle>새로운 조직을 생성하고 워케이션을 시작하세요</PageSubtitle>
      </PageHeader>
      
      <FormCard>
        <CardTitle>조직 정보 입력</CardTitle>
        <form onSubmit={handleOrganizationSubmit}>
          <FormGroup>
            <label htmlFor="orgType">유형</label>
            <input
              id="orgType"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={loading}
              placeholder="예: Company, Club, Team"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="orgName">조직명</label>
            <input
              id="orgName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="조직 이름을 입력하세요"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="orgDescription">설명</label>
            <textarea
              id="orgDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="조직에 대한 설명을 입력하세요"
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '조직 등록 중...' : '조직 등록하기'}
          </SubmitButton>
        </form>

        {createdOrganizationId && (
          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '2px dashed #e2e8f0' 
          }}>
            <CardTitle>로고 업로드</CardTitle>
            <p style={{ 
              color: '#64748b', 
              fontSize: '14px', 
              marginBottom: '16px' 
            }}>
              조직 ID: {createdOrganizationId}
            </p>
            <FormGroup>
              <label htmlFor="logoFile">로고 파일</label>
              <input
                id="logoFile"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                disabled={loading}
              />
            </FormGroup>
            <SubmitButton onClick={handleLogoUpload} disabled={loading || !logoFile}>
              {loading ? '로고 업로드 중...' : '로고 업로드하기'}
            </SubmitButton>
          </div>
        )}

        {message && <MessageText isError={isError}>{message}</MessageText>}
      </FormCard>
    </PageContainer>
  );
};

export default AddOrganizationPage;
