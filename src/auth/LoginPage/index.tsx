import React, { useState, useEffect } from 'react'; // useEffect 추가
import styled from 'styled-components';
import { getGoogleAuthUrl } from '../../auth/api'; // api.ts에서 함수 임포트

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const LoginForm = styled.div`
  background-color: #ffffff; // 원래 흰색 배경으로 복원
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 24px;
  color: #333;
`;

const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  &:hover {
    background-color: #357ae8;
  }
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const GOOGLE_AUTH_URL_PLACEHOLDER = "YOUR_BACKEND_GOOGLE_AUTH_URL"; // 플레이스홀더 변수 제거

const LoginPage: React.FC = () => {
  const [googleAuthUrl, setGoogleAuthUrl] = useState(GOOGLE_AUTH_URL_PLACEHOLDER);

  useEffect(() => {
    const fetchGoogleAuthUrl = async () => {
      try {
        const url = await getGoogleAuthUrl();
        setGoogleAuthUrl(url);
      } catch (error) {
        console.error("Google 인증 URL을 가져오는 데 실패했습니다:", error);
        // 에러 처리: 예를 들어, 사용자에게 메시지를 표시하거나 재시도 버튼을 제공할 수 있습니다.
      }
    };
    fetchGoogleAuthUrl();
  }, []);

  const handleGoogleLogin = () => {
    if (googleAuthUrl && googleAuthUrl !== GOOGLE_AUTH_URL_PLACEHOLDER) {
      window.location.href = googleAuthUrl;
    } else {
      console.error("Google 인증 URL을 사용할 수 없습니다.");
      // 사용자에게 에러 메시지 표시
    }
  };

  return (
    <LoginPageContainer>
      <LoginForm>
        <Title>로그인</Title>
        <GoogleButton onClick={handleGoogleLogin}>
          <GoogleIcon src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_and_wordmark_of_Google.svg" alt="Google icon" />
          Google로 로그인
        </GoogleButton>
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;
