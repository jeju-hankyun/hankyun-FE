import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkcationGroups } from '../../../auth/api';
import type { WorkcationGroupResponse, BaseResponse, CursorResponse } from '../../../auth/api/interfaces';

const PageContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  color: #1e293b;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const GroupListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const GroupCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const GroupName = styled.h3`
  margin: 0 0 12px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
`;

const GroupDetail = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 6px 0;
  line-height: 1.5;
  
  strong {
    color: #374151;
    font-weight: 600;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #dc2626;
  font-weight: 500;
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 32px auto;
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-top: 12px;
  margin-right: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ViewTripsButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-top: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const WorkcationGroupListPage: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const [workcationGroups, setWorkcationGroups] = useState<WorkcationGroupResponse[]>([]);
  const [cursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkcationGroups = async (currentCursor?: string) => {
    if (!organizationId) {
      setError('조직 ID가 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: BaseResponse<CursorResponse<WorkcationGroupResponse>> = await getWorkcationGroups(parseInt(organizationId, 10), currentCursor, 10); // 10개씩 로드
      
      // API 응답 구조를 유연하게 처리
      let groupsData = null;
      let hasNext = false;
      
      // response.data가 CursorResponse 구조인 경우
      if (response.data && response.data.values) {
        groupsData = response.data.values;
        hasNext = response.data.has_next || false;
      }
      // response 자체가 CursorResponse 구조인 경우 (직접 응답)
      else if ((response as any).values) {
        groupsData = (response as any).values;
        hasNext = (response as any).has_next || false;
      }
      // response.data가 직접 배열인 경우
      else if (Array.isArray(response.data)) {
        groupsData = response.data;
        hasNext = false;
      }
      
      if (groupsData && groupsData.length > 0) {
        setWorkcationGroups((prev) => {
          // 중복 제거: 기존 그룹 ID와 새로 받은 그룹 ID를 비교
          const existingIds = new Set(prev.map(group => group.workcation_group_id));
          const newGroups = groupsData.filter((group: WorkcationGroupResponse) => !existingIds.has(group.workcation_group_id));
          return [...prev, ...newGroups];
        });
        setHasMore(hasNext);
      } else {
        setError(response.message || '워케이션 그룹 목록을 불러오지 못했습니다.');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching workcation groups:', err);
      setError('워케이션 그룹 목록을 불러오는 중 오류가 발생했습니다.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchWorkcationGroups();
    }
  }, [organizationId]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchWorkcationGroups(cursor);
    }
  };

  if (!organizationId) {
    return <PageContainer><ErrorText>조직 ID가 URL에 제공되지 않았습니다.</ErrorText></PageContainer>;
  }

  return (
    <PageContainer>
      <PageTitle>워케이션 그룹 목록 (조직 ID: {organizationId})</PageTitle>
      {error && <ErrorText>{error}</ErrorText>}

      {loading ? (
        <LoadingText>워케이션 그룹 목록 로딩 중...</LoadingText>
      ) : workcationGroups.length === 0 ? (
        <p style={{ textAlign: 'center' }}>등록된 워케이션 그룹이 없습니다.</p>
      ) : (
        <GroupListContainer>
          {workcationGroups.map((group, index) => (
            <GroupCard key={`group-${group.workcation_group_id || index}-${index}`}>
              <GroupName>{group.place ? `${group.place} 워케이션` : '없음'}</GroupName>
              <GroupDetail><strong>ID:</strong> {group.workcation_group_id ? group.workcation_group_id : '없음'}</GroupDetail>
              <GroupDetail><strong>목적:</strong> {group.purpose ? group.purpose : '없음'}</GroupDetail>
              <GroupDetail><strong>예상 비용:</strong> {group.money ? `${group.money.toLocaleString()} 원` : '없음'}</GroupDetail>
              <GroupDetail><strong>기간:</strong> {group.start_date && group.end_date ? `${group.start_date.split('T')[0]} ~ ${group.end_date.split('T')[0]}` : '없음'}</GroupDetail>
              <GroupDetail><strong>매니저:</strong> {group.manager ? group.manager : '없음'}</GroupDetail>
              <ButtonContainer>
                <ActionButton onClick={() => navigate(`/workcation-groups/${group.workcation_group_id}/trips/create`)}>
                  Trip 생성
                </ActionButton>
                <ViewTripsButton onClick={() => navigate(`/workcation-groups/${group.workcation_group_id}/trips`)}>
                  Trip 목록
                </ViewTripsButton>
              </ButtonContainer>
            </GroupCard>
          ))}
        </GroupListContainer>
      )}
      
      {hasMore && !loading && (
        <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
          더 보기
        </LoadMoreButton>
      )}
    </PageContainer>
  );
};

export default WorkcationGroupListPage;