import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getUserProfile, getUserProfileById, UserResponse, BaseResponse } from '../../auth/api';

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

const ProfileCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const ProfileItem = styled.p`
  margin: 8px 0;
  font-size: 16px;
  strong {
    color: #555;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    background-color: #28a745;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #218838;
    }
  }
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 10px;
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
      <SectionTitle>내 프로필</SectionTitle>
      <ProfileCard>
        {loadingMyProfile ? (
          <p>내 프로필 로딩 중...</p>
        ) : myProfileError ? (
          <ErrorText>{myProfileError}</ErrorText>
        ) : myProfile ? (
          <>
            <ProfileItem><strong>ID:</strong> {myProfile.user_id}</ProfileItem>
            <ProfileItem><strong>이름:</strong> {myProfile.name}</ProfileItem>
            <ProfileItem><strong>이메일:</strong> {myProfile.email}</ProfileItem>
            <ProfileItem><strong>프로필:</strong> {myProfile.profile}</ProfileItem>
            <ProfileItem><strong>역할:</strong> {myProfile.role}</ProfileItem>
          </>
        ) : (
          <p>로그인 후 프로필을 확인할 수 있습니다.</p>
        )}
      </ProfileCard>

      <SectionTitle>다른 사용자 프로필 조회</SectionTitle>
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
            <ProfileItem><strong>ID:</strong> {otherUserProfile.user_id}</ProfileItem>
            <ProfileItem><strong>이름:</strong> {otherUserProfile.name}</ProfileItem>
            <ProfileItem><strong>이메일:</strong> {otherUserProfile.email}</ProfileItem>
            <ProfileItem><strong>프로필:</strong> {otherUserProfile.profile}</ProfileItem>
            <ProfileItem><strong>역할:</strong> {otherUserProfile.role}</ProfileItem>
          </>
        ) : (
          <p>조회할 사용자 ID를 입력해주세요.</p>
        )}
      </ProfileCard>
    </PageContainer>
  );
};

export default UserProfilePage;
