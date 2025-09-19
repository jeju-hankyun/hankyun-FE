import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import { getOrganizations } from '../../../auth/api';
import type { OrganizationResponse, BaseResponse, CursorResponse } from '../../../auth/api/interfaces';

const PageContainer = styled.div`
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
  color: #1e293b;
`;

const OrganizationListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
`;

const OrganizationCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
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
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const OrgLogo = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  font-weight: 700;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
`;

const OrgName = styled.h3`
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
`;

const OrgDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.5;
`;

const OrgDetail = styled.p`
  font-size: 12px;
  color: #94a3b8;
  margin: 4px 0;
  font-weight: 500;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 18px;
  color: red;
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 30px auto;
  background-color: #007bff;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #a0cbed;
    cursor: not-allowed;
  }
`;

const CreateOrgButton = styled.button`
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  width: auto;
  margin: 20px 0;
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

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const CreateGroupButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  margin-right: 8px;
  &:hover {
    background-color: #218838;
  }
  &:disabled {
    background-color: #94d3a2;
    cursor: not-allowed;
  }
`;

const ViewGroupButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #a0cbed;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const OrganizationListPage: React.FC = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const [cursorId, setCursorId] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async (currentCursorId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response: BaseResponse<CursorResponse<OrganizationResponse>> = await getOrganizations(currentCursorId, 10); // 10개씩 로드
      
      const data = response.data; // response.data를 별도 변수에 할당하여 null 체크
      if (data && data.values) {
        setOrganizations((prev) => {
          // 중복 제거: 기존 조직 ID와 새로 받은 조직 ID를 비교
          const existingIds = new Set(prev.map(org => org.organization_id));
          const newOrganizations = data.values!.filter(org => !existingIds.has(org.organization_id));
          return [...prev, ...newOrganizations];
        });
        setHasMore(data.has_next || false);
        // 다음 커서 ID는 마지막 조직의 ID로 설정 (백엔드 구현에 따라 달라질 수 있음)
        if (data.values.length > 0) {
          setCursorId(data.values[data.values.length - 1].organization_id);
        }
      } else {
        setError(response.message || '조직 목록을 불러오지 못했습니다.');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('조직 목록을 불러오는 중 오류가 발생했습니다.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchOrganizations(cursorId);
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <PageTitle>조직 목록</PageTitle>
        <CreateOrgButton onClick={() => navigate('/organizations/add')}>
          + 새 조직 생성
        </CreateOrgButton>
      </HeaderSection>
      
      {error && <ErrorText>{error}</ErrorText>}
      
      {organizations.length === 0 && !loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🏢</div>
          <p style={{ color: '#64748b', marginBottom: '12px', fontSize: '16px', fontWeight: '500' }}>
            등록된 조직이 없습니다
          </p>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
            새로운 조직을 생성하여 워케이션을 시작해보세요
          </p>
        </div>
      ) : (
        <OrganizationListContainer>
          {organizations.map((org, index) => (
            <OrganizationCard key={`org-${org.organization_id || index}-${index}`}>
              <OrgLogo>O</OrgLogo>
              <OrgName>{org.name ? org.name : '없음'}</OrgName>
              <OrgDescription>{org.description ? org.description : '없음'}</OrgDescription>
              <OrgDetail>유형: {org.type ? org.type : '없음'}</OrgDetail>
              <OrgDetail>ID: {org.organization_id ? org.organization_id : '없음'}</OrgDetail>
              <ButtonContainer>
                <CreateGroupButton onClick={() => navigate(`/organizations/${org.organization_id}/workcation-groups/create`)}>
                  그룹 생성
                </CreateGroupButton>
                <ViewGroupButton onClick={() => navigate(`/organizations/${org.organization_id}/workcation-groups`)}>
                  그룹 목록
                </ViewGroupButton>
              </ButtonContainer>
            </OrganizationCard>
          ))}
        </OrganizationListContainer>
      )}
      
      {loading && <LoadingText>조직 목록 로딩 중...</LoadingText>}
      {hasMore && (
        <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
          더 보기
        </LoadMoreButton>
      )}
    </PageContainer>
  );
};

export default OrganizationListPage;
