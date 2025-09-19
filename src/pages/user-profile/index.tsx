import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getUserProfile, getUserProfileById } from '../../auth/api';
import type { UserResponse, BaseResponse } from '../../auth/api/interfaces';

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

const ProfileCard = styled.div`
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
    content: '👤';
    font-size: 18px;
  }
`;

const ProfileItem = styled.p`
  margin: 12px 0;
  font-size: 16px;
  line-height: 1.5;
  
  strong {
    color: #374151;
    font-weight: 600;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  
  input {
    flex: 1;
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
  
  button {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
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
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  font-weight: 500;
`;

const UserProfilePage: React.FC = () => {
  const [myProfile, setMyProfile] = useState<UserResponse | null>(null);
  const [otherUserId, setOtherUserId] = useState<string>('');
  const [otherUserProfile, setOtherUserProfile] = useState<UserResponse | null>(null);
  const [loadingMyProfile, setLoadingMyProfile] = useState(true);
  const [loadingOtherProfile, setLoadingOtherProfile] = useState(false);
  const [myProfileError, setMyProfileError] = useState<string | null>(null);
  const [otherProfileError, setOtherProfileError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        setLoadingMyProfile(true);
        const response: BaseResponse<UserResponse> = await getUserProfile();
        if (response.data) {
          setMyProfile(response.data);
        } else {
          setMyProfileError(response.message || '내 프로필을 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('Error fetching my profile:', error);
        setMyProfileError('내 프로필을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoadingMyProfile(false);
      }
    };
    fetchMyProfile();
  }, []);

  const handleFetchOtherProfile = async () => {
    if (!otherUserId) {
      setOtherProfileError('사용자 ID를 입력해주세요.');
      setOtherUserProfile(null);
      return;
    }

    try {
      setLoadingOtherProfile(true);
      setOtherProfileError(null);
      const userIdNum = parseInt(otherUserId, 10);
      if (isNaN(userIdNum)) {
        setOtherProfileError('유효한 숫자 ID를 입력해주세요.');
        setOtherUserProfile(null);
        return;
      }
      const response: BaseResponse<UserResponse> = await getUserProfileById(userIdNum);
      if (response.data) {
        setOtherUserProfile(response.data);
      } else {
        setOtherProfileError(response.message || '다른 사용자 프로필을 찾을 수 없습니다.');
        setOtherUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching other profile:', error);
      setOtherProfileError('다른 사용자 프로필을 불러오는 중 오류가 발생했습니다.');
      setOtherUserProfile(null);
    } finally {
      setLoadingOtherProfile(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>사용자 프로필</PageTitle>
        <PageSubtitle>내 프로필과 다른 사용자 정보를 확인하세요</PageSubtitle>
      </PageHeader>
      <ProfileCard>
        {loadingMyProfile ? (
          <p>내 프로필 로딩 중...</p>
        ) : myProfileError ? (
          <ErrorText>{myProfileError}</ErrorText>
        ) : myProfile ? (
          <>
            <ProfileItem><strong>ID:</strong> {myProfile.user_id ? myProfile.user_id : '없음'}</ProfileItem>
            <ProfileItem><strong>이름:</strong> {myProfile.name ? myProfile.name : '없음'}</ProfileItem>
            <ProfileItem><strong>이메일:</strong> {myProfile.email ? myProfile.email : '없음'}</ProfileItem>
            <ProfileItem><strong>프로필:</strong> {myProfile.profile ? myProfile.profile : '없음'}</ProfileItem>
            <ProfileItem><strong>역할:</strong> {myProfile.role ? myProfile.role : '없음'}</ProfileItem>
          </>
        ) : (
          <p>로그인 후 프로필을 확인할 수 있습니다.</p>
        )}
      </ProfileCard>

      <CardTitle>다른 사용자 프로필 조회</CardTitle>
      <ProfileCard>
        <InputGroup>
          <input
            type="text"
            placeholder="조회할 사용자 ID 입력"
            value={otherUserId}
            onChange={(e) => setOtherUserId(e.target.value)}
          />
          <button onClick={handleFetchOtherProfile} disabled={loadingOtherProfile}>
            {loadingOtherProfile ? '조회 중...' : '조회'}
          </button>
        </InputGroup>
        {otherProfileError && <ErrorText>{otherProfileError}</ErrorText>}
        {loadingOtherProfile ? (
          <p>다른 사용자 프로필 로딩 중...</p>
        ) : otherUserProfile ? (
          <>
            <ProfileItem><strong>ID:</strong> {otherUserProfile.user_id ? otherUserProfile.user_id : '없음'}</ProfileItem>
            <ProfileItem><strong>이름:</strong> {otherUserProfile.name ? otherUserProfile.name : '없음'}</ProfileItem>
            <ProfileItem><strong>이메일:</strong> {otherUserProfile.email ? otherUserProfile.email : '없음'}</ProfileItem>
            <ProfileItem><strong>프로필:</strong> {otherUserProfile.profile ? otherUserProfile.profile : '없음'}</ProfileItem>
            <ProfileItem><strong>역할:</strong> {otherUserProfile.role ? otherUserProfile.role : '없음'}</ProfileItem>
          </>
        ) : (
          <p>조회할 사용자 ID를 입력해주세요.</p>
        )}
      </ProfileCard>
    </PageContainer>
  );
};

export default UserProfilePage;
