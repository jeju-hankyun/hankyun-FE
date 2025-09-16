import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getOrganizations } from '../../../auth/api';
import type { OrganizationResponse, BaseResponse, CursorResponse } from '../../../auth/api';

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

const OrganizationListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const OrganizationCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const OrgLogo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 1px solid #eee;
`;

const OrgName = styled.h3`
  margin: 10px 0 5px 0;
  color: #333;
`;

const OrgDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
`;

const OrgDetail = styled.p`
  font-size: 13px;
  color: #888;
  margin: 2px 0;
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

const OrganizationListPage: React.FC = () => {
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
      if (response.data && response.data.values) {
        setOrganizations((prev) => [...prev, ...response.data.values!]);
        setHasMore(response.data.has_next || false);
        // 다음 커서 ID는 마지막 조직의 ID로 설정 (백엔드 구현에 따라 달라질 수 있음)
        if (response.data.values.length > 0) {
          setCursorId(response.data.values[response.data.values.length - 1].organization_id);
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
      <SectionTitle>조직 목록</SectionTitle>
      {error && <ErrorText>{error}</ErrorText>}
      {organizations.length === 0 && !loading && !error ? (
        <p style={{ textAlign: 'center' }}>등록된 조직이 없습니다.</p>
      ) : (
        <OrganizationListContainer>
          {organizations.map((org) => (
            <OrganizationCard key={org.organization_id}>
              <OrgLogo src={org.logo || "https://via.placeholder.com/80?text=Logo"} alt={org.name + " logo"} />
              <OrgName>{org.name}</OrgName>
              <OrgDescription>{org.description}</OrgDescription>
              <OrgDetail>유형: {org.type}</OrgDetail>
              <OrgDetail>ID: {org.organization_id}</OrgDetail>
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
