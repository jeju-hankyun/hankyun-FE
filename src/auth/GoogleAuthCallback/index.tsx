import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { reissueToken } from '../api';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    reissueToken()
      .then(() => {
        console.log('Access Token 재발급 완료');
        navigate('/overview');
      })
      .catch(error => {
        console.error('로그인 실패:', error);
        setErrorMessage('Google 로그인에 실패했습니다. 다시 시도해주세요.');
      });
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
