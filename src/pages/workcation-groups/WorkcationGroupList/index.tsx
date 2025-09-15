import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getWorkcationGroups, WorkcationGroupResponse, BaseResponse, CursorResponse } from '../../../auth/api';

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

const GroupListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const GroupCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const GroupName = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`;

const GroupDetail = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  strong {
    color: #555;
  }
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

const WorkcationGroupListPage: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [workcationGroups, setWorkcationGroups] = useState<WorkcationGroupResponse[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
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
      if (response.data && response.data.values) {
        setWorkcationGroups((prev) => [...prev, ...response.data.values!]);
        setHasMore(response.data.has_next || false);
        // 다음 커서 값은 백엔드 응답에서 next_cursor 필드로 받아야 함 (현재 OpenAPI 스펙에는 없음)
        // 임시로 마지막 그룹의 ID를 사용하거나, 백엔드에서 cursor 값을 반환하도록 수정 필요
        // 여기서는 `next_cursor` 필드가 `CursorResponse`에 없으므로 구현하지 않음. 백엔드 스펙에 따라 수정 필요.
        // setCursor(response.data.next_cursor); // 예시
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
      <SectionTitle>워케이션 그룹 목록 (조직 ID: {organizationId})</SectionTitle>
      {error && <ErrorText>{error}</ErrorText>}
      {workcationGroups.length === 0 && !loading && !error ? (
        <p style={{ textAlign: 'center' }}>등록된 워케이션 그룹이 없습니다.</p>
      ) : (
        <GroupListContainer>
          {workcationGroups.map((group) => (
            <GroupCard key={group.workcation_group_id}>
              <GroupName>{group.place} 워케이션</GroupName>
              <GroupDetail><strong>ID:</strong> {group.workcation_group_id}</GroupDetail>
              <GroupDetail><strong>목적:</strong> {group.purpose}</GroupDetail>
              <GroupDetail><strong>예상 비용:</strong> {group.money} 원</GroupDetail>
              <GroupDetail><strong>기간:</strong> {group.start_date} ~ {group.end_date}</GroupDetail>
              <GroupDetail><strong>매니저:</strong> {group.manager}</GroupDetail>
            </GroupCard>
          ))}
        </GroupListContainer>
      )}
      {loading && <LoadingText>워케이션 그룹 목록 로딩 중...</LoadingText>}
      {hasMore && (
        <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
          더 보기
        </LoadMoreButton>
      )}
    </PageContainer>
  );
};

export default WorkcationGroupListPage;
