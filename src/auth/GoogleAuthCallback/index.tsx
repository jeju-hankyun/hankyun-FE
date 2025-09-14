import React, { useEffect, useState } from 'react'; // useState 임포트
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { handleGoogleCallback } from '../../auth/api'; // api.ts에서 함수 임포트
import { setAccessToken } from '../../auth/api'; // setAccessToken 임포트

const CallbackContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 24px;
  color: #555;
`;

const GoogleAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지 상태 추가

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      console.log('Authorization Code:', code);
      console.log('State:', state);

      handleGoogleCallback(code, state)
        .then(response => {
          console.log('로그인 성공:', response);
          // 백엔드 응답에서 access_token 추출 및 저장 (응답 구조에 따라 수정 필요)
          const newAccessToken = response.access_token; // 예시: 백엔드가 응답 본문에 access_token을 반환한다고 가정
          if (newAccessToken) {
            setAccessToken(newAccessToken);
            console.log('Access Token 저장 완료:', newAccessToken);
          }
          navigate('/overview');
        })
        .catch(error => {
          console.error('로그인 실패:', error);
          setErrorMessage('Google 로그인에 실패했습니다. 다시 시도해주세요.'); // 에러 메시지 설정
          // navigate('/login?error=auth_failed'); // 리다이렉션 제거
        });

    } else {
      console.error('Code 또는 State가 없습니다.');
      setErrorMessage('잘못된 접근입니다. 로그인 페이지로 돌아가세요.'); // 에러 메시지 설정
      // navigate('/login?error=missing_params'); // 리다이렉션 제거
    }
  }, [location, navigate]);

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
  color: #d32f2f;
  font-weight: bold;
  margin-top: 20px;
`;

export default GoogleAuthCallback;
