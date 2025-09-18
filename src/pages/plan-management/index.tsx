import React, { useState, useEffect } from 'react';
import {
  PlanManagementContainer,
  HeaderSection,
  PageTitle,
  PageSubtitle,
  TabContainer,
  TabButton,
  ContentSection,
  SectionTitle,
  PRCard,
  PRHeader,
  PRTitle,
  StatusBadge,
  PRMeta,
  PRDescription,
  PRActions,
  ActionButton,
  FormContainer,
  FormGroup,
  Label,
  Textarea,
  SubmitButton,
} from './style';
import {
  createTripDescriptionPR,
  approvePR,
  rejectPR,
  getTripDescriptionPRs,
} from '../../auth/api/tripDescriptionPR';
import type { BaseResponse, CursorResponse, TripDescriptionPRResponse, CreateTripDescriptionPRRequest } from '../../auth/api/interfaces';

const PlanManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prs' | 'create'>('prs');
  const [prs, setPrs] = useState<TripDescriptionPRResponse[]>([]);
  const [cursorId, setCursorId] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTripDescriptionPRRequest>({
    writer_id: 1, // 임시 writer_id
    description: '',
  });

  const fetchPRs = async (currentCursorId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response: BaseResponse<CursorResponse<TripDescriptionPRResponse>> = await getTripDescriptionPRs(currentCursorId, 10);
      const data = response.data;
      if (data && data.values) {
        setPrs((prev) => [...prev, ...data.values!]);
        setHasMore(data.has_next || false);
        if (data.values.length > 0) {
          setCursorId(data.values[data.values.length - 1].trip_description_pr_id);
        }
      } else {
        setError(response.message || 'PR 목록을 불러오지 못했습니다.');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching PRs:', err);
      setError('PR 목록을 불러오는 중 오류가 발생했습니다.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRs();
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchPRs(cursorId);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 임시 tripDescriptionId (백엔드와 연동 시 실제 ID 사용)
    const dummyTripDescriptionId = 1;
    try {
      const response = await createTripDescriptionPR(dummyTripDescriptionId, formData);
      if (response.data) {
        alert('계획서가 성공적으로 제출되었습니다!');
        setFormData({
          writer_id: 1, // 다시 임시 ID 설정
          description: '',
        });
        // PR 목록 새로고침
        setPrs([]); // 기존 PR 초기화
        setCursorId(undefined); // 커서 초기화
        setHasMore(true); // 다시 더 로드 가능하도록 설정
        fetchPRs();
      } else {
        alert(response.message || '계획서 제출에 실패했습니다.');
      }
    } catch (error) {
      console.error('계획서 제출 실패:', error);
      alert('계획서 제출 중 오류가 발생했습니다.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApprovePR = async (prId: number) => {
    try {
      const response = await approvePR(prId);
      if (response.data) {
        alert('PR이 승인되었습니다.');
        // PR 목록 새로고침
        setPrs([]);
        setCursorId(undefined);
        setHasMore(true);
        fetchPRs();
      } else {
        alert(response.message || 'PR 승인에 실패했습니다.');
      }
    } catch (error) {
      console.error('PR 승인 실패:', error);
      alert('PR 승인 중 오류가 발생했습니다.');
    }
  };

  const handleRejectPR = async (prId: number) => {
    try {
      const response = await rejectPR(prId);
      if (response.data) {
        alert('PR이 반려되었습니다.');
        // PR 목록 새로고침
        setPrs([]);
        setCursorId(undefined);
        setHasMore(true);
        fetchPRs();
      } else {
        alert(response.message || 'PR 반려에 실패했습니다.');
      }
    } catch (error) {
      console.error('PR 반려 실패:', error);
      alert('PR 반려 중 오류가 발생했습니다.');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '검토중';
      case 'APPROVED': return '승인';
      case 'REJECTED': return '반려';
      default: return '알 수 없음';
    }
  };

  return (
    <PlanManagementContainer>
      <HeaderSection>
        <PageTitle>📋 계획서 관리</PageTitle>
        <PageSubtitle>
          워케이션 계획서를 관리하고 새로운 계획을 작성하세요
        </PageSubtitle>
      </HeaderSection>

      <TabContainer>
        <TabButton
          isActive={activeTab === 'prs'}
          onClick={() => setActiveTab('prs')}
        >
          📄 PR 확인
        </TabButton>
        <TabButton
          isActive={activeTab === 'create'}
          onClick={() => setActiveTab('create')}
        >
          ✍️ 계획서 작성
        </TabButton>
      </TabContainer>

      <ContentSection>
        {activeTab === 'prs' ? (
          <div>
            <SectionTitle>제출된 계획서 PR 목록</SectionTitle>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {prs.length === 0 && !loading && !error ? (
              <p style={{ textAlign: 'center' }}>제출된 계획서 PR이 없습니다.</p>
            ) : (
              <>
                {prs.map((pr) => (
                  <PRCard key={pr.trip_description_pr_id}>
                    <PRHeader>
                      <PRTitle>PR ID: {pr.trip_description_pr_id}</PRTitle>
                      <StatusBadge status={pr.state}>
                        {getStatusText(pr.state)}
                      </StatusBadge>
                    </PRHeader>
                    <PRMeta>
                      작성자 ID: {pr.writer_id} | 작성일: 없음 {/* created_at 필드가 없어 임시 처리 */}
                    </PRMeta>
                    <PRDescription>
                      {pr.description ? pr.description : '설명 없음'}
                    </PRDescription>
                    <PRActions>
                      <ActionButton variant="primary">
                        상세보기
                      </ActionButton>
                      {pr.state === 'PENDING' && (
                        <>
                          <ActionButton variant="success" onClick={() => handleApprovePR(pr.trip_description_pr_id)}>
                            승인
                          </ActionButton>
                          <ActionButton variant="danger" onClick={() => handleRejectPR(pr.trip_description_pr_id)}>
                            반려
                          </ActionButton>
                        </>
                      )}
                    </PRActions>
                  </PRCard>
                ))}
                {loading && <p>로딩 중...</p>}
                {hasMore && (
                  <ActionButton onClick={handleLoadMore} disabled={loading}>
                    더 불러오기
                  </ActionButton>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            <SectionTitle>새 워케이션 계획서 작성</SectionTitle>
            <FormContainer onSubmit={handleFormSubmit}>
              {/* <FormGroup>
                <Label>계획서 제목</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="예: 제주도 워케이션 계획서 - 2024 Q2"
                  required
                />
              </FormGroup> */}

              <FormGroup>
                <Label>계획 설명</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="워케이션 계획에 대한 자세한 설명을 입력하세요..."
                  required
                />
              </FormGroup>

              {/* <FormRow>
                <FormGroup>
                  <Label>시작일</Label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>종료일</Label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>참여자 (쉼표로 구분)</Label>
                <Input
                  type="text"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  placeholder="홍길동, 김철수, 이영희"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>장소</Label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="예: 제주도 서귀포시"
                  required
                />
              </FormGroup> */}

              <SubmitButton type="submit">
                계획서 제출
              </SubmitButton>
            </FormContainer>
          </div>
        )}
      </ContentSection>
    </PlanManagementContainer>
  );
};

export default PlanManagement;