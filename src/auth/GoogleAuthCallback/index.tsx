import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { reissueToken, setAccessToken } from '../api';

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
    // 백엔드에서 직접 Google OAuth 콜백을 처리하고 리프레시 토큰을 제공하는 경우
    // URL 파라미터 대신 쿠키나 다른 방식으로 토큰을 받을 수 있음
    
    console.log('OAuth 콜백 페이지 로드됨');
    console.log('전체 URL:', window.location.href);
    console.log('Search params:', searchParams.toString());
    
    // 쿠키에서 리프레시 토큰 확인
    const refreshToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('refresh_token='))
      ?.split('=')[1];
    
    console.log('리프레시 토큰:', refreshToken);
    
    if (refreshToken) {
      // 리프레시 토큰이 있으면 바로 토큰 재발급 시도
      reissueToken()
        .then((token) => {
          setAccessToken(token);
          navigate('/overview');
        })
        .catch(error => {
          console.error('토큰 재발급 실패:', error);
          setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
        });
    } else {
      // 리프레시 토큰이 없으면 잠시 대기 후 재시도
      setTimeout(() => {
        const retryRefreshToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('refresh_token='))
          ?.split('=')[1];
        
        if (retryRefreshToken) {
          reissueToken()
            .then((token) => {
              setAccessToken(token);
              navigate('/overview');
            })
            .catch(error => {
              console.error('토큰 재발급 실패:', error);
              setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
            });
        } else {
          setErrorMessage('로그인 정보를 받지 못했습니다. 다시 시도해주세요.');
        }
      }, 1000);
    }
  }, [navigate]);

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
