import React, { useState, useEffect } from 'react'; // useEffect 추가
import styled from 'styled-components';
import { getGoogleAuthUrl } from '../api';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleAuthUrl = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        console.log('Google OAuth URL 요청 시작...');
        const url = await getGoogleAuthUrl();
        console.log('받은 Google OAuth URL:', url);
        setGoogleAuthUrl(url);
      } catch (error: any) {
        console.error("Google 인증 URL을 가져오는 데 실패했습니다:", error);
        console.error("에러 상세:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });
        
        // 503 Service Unavailable 오류 처리
        if (error.response?.status === 503) {
          setErrorMessage("서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.");
        } else if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_FAILED')) {
          setErrorMessage("네트워크 연결을 확인해주세요. 서버에 연결할 수 없습니다.");
        } else {
          setErrorMessage("로그인 서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchGoogleAuthUrl();
  }, []);

  const handleGoogleLogin = () => {
    if (googleAuthUrl && googleAuthUrl !== GOOGLE_AUTH_URL_PLACEHOLDER) {
      window.location.href = googleAuthUrl;
    } else {
      setErrorMessage("Google 인증 URL을 사용할 수 없습니다. 페이지를 새로고침해주세요.");
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <LoginPageContainer>
      <LoginForm>
        <Title>로그인</Title>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>로그인 서비스를 준비 중입니다...</p>
          </div>
        ) : errorMessage ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: 'red', marginBottom: '15px' }}>{errorMessage}</p>
            <button 
              onClick={handleRetry}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              다시 시도
            </button>
          </div>
        ) : (
          <GoogleButton onClick={handleGoogleLogin}>
            <GoogleIcon src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_and_wordmark_of_Google.svg" alt="Google icon" />
            Google로 로그인
          </GoogleButton>
        )}
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;
