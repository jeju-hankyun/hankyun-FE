import React, { useState } from 'react';
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
  FormRow,
  Label,
  Input,
  Textarea,
  SubmitButton,
} from './style';

interface PR {
  id: string;
  title: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  description: string;
}

interface Plan {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: string[];
  location: string;
}

const PlanManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prs' | 'create'>('prs');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    participants: '',
    location: ''
  });

  const mockPRs: PR[] = [
    {
      id: '1',
      title: '제주도 워케이션 계획서 - Q2 2024',
      author: '김워케이션',
      status: 'pending',
      createdAt: '2024-03-15',
      description: '제주도에서 진행할 2분기 워케이션 계획서입니다. 총 10명의 팀원이 참여 예정입니다.'
    },
    {
      id: '2',
      title: '부산 해운대 워케이션 제안',
      author: '이바다',
      status: 'approved',
      createdAt: '2024-03-10',
      description: '부산 해운대에서 진행할 3일간의 워케이션 계획입니다.'
    },
    {
      id: '3',
      title: '강릉 워케이션 기획안',
      author: '박산바다',
      status: 'rejected',
      createdAt: '2024-03-05',
      description: '강릉에서 진행할 워케이션 기획안입니다. 예산 조정이 필요합니다.'
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('계획서 제출:', formData);
    alert('계획서가 성공적으로 제출되었습니다!');
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      participants: '',
      location: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '검토중';
      case 'approved': return '승인';
      case 'rejected': return '반려';
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
            {mockPRs.map((pr) => (
              <PRCard key={pr.id}>
                <PRHeader>
                  <PRTitle>{pr.title}</PRTitle>
                  <StatusBadge status={pr.status}>
                    {getStatusText(pr.status)}
                  </StatusBadge>
                </PRHeader>
                <PRMeta>
                  작성자: {pr.author} | 작성일: {pr.createdAt}
                </PRMeta>
                <PRDescription>
                  {pr.description}
                </PRDescription>
                <PRActions>
                  <ActionButton variant="primary">
                    상세보기
                  </ActionButton>
                  {pr.status === 'pending' && (
                    <>
                      <ActionButton variant="success">
                        승인
                      </ActionButton>
                      <ActionButton variant="danger">
                        반려
                      </ActionButton>
                    </>
                  )}
                </PRActions>
              </PRCard>
            ))}
          </div>
        ) : (
          <div>
            <SectionTitle>새 워케이션 계획서 작성</SectionTitle>
            <FormContainer onSubmit={handleFormSubmit}>
              <FormGroup>
                <Label>계획서 제목</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="예: 제주도 워케이션 계획서 - 2024 Q2"
                  required
                />
              </FormGroup>

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

              <FormRow>
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
              </FormGroup>

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