import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { handleGoogleCallback, setAccessToken } from '../api';

const CallbackContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 24px;
  color: #555;
`;

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('OAuth 콜백 파라미터:', { code, state, error });
    console.log('전체 URL:', window.location.href);
    console.log('Search params:', searchParams.toString());

    if (error) {
      setErrorMessage(`Google OAuth 오류: ${error}`);
      return;
    }

    if (!code || !state) {
      setErrorMessage('Google OAuth 인증 정보가 없습니다. URL을 확인해주세요.');
      return;
    }

    handleGoogleCallback(code, state)
      .then((response) => {
        console.log('Google OAuth 성공:', response);
        // 응답에서 토큰 추출
        const token = response.access_token || response.data?.access_token;
        if (token) {
          setAccessToken(token);
          navigate('/overview');
        } else {
          setErrorMessage('토큰을 받지 못했습니다.');
        }
      })
      .catch(error => {
        console.error('Google OAuth 실패:', error);
        setErrorMessage('Google 로그인에 실패했습니다. 다시 시도해주세요.');
      });
  }, [navigate, searchParams]);

  return (
    <CallbackContainer>
      {errorMessage ? (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      ) : (
        "Google 로그인 처리 중..."
      )}
    </CallbackContainer>
  );
};

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 20px;
`;

export default GoogleAuthCallback;
