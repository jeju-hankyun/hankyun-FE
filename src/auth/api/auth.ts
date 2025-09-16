import { authApi } from './base';

// Google OAuth 시작 URL을 백엔드에서 가져오는 API
export const getGoogleAuthUrl = async (): Promise<string> => {
  try {
    const response = await authApi.get<{ message: string; data: { login_url: string } }>(`/auth/login/google`);
    return response.data.data.login_url;
  } catch (error) {
    console.error('Google 인증 URL을 가져오는 데 실패했습니다:', error);
    throw error;
  }
};

// Google OAuth 콜백 처리 API
export const handleGoogleCallback = async (code: string, state: string): Promise<any> => {
  try {
    const response = await authApi.get(`/auth/login/google/callback`, {
      params: { code, state }
    });
    return response.data;
  } catch (error) {
    console.error('Google OAuth 콜백 처리 실패:', error);
    throw error;
  }
};

// 로그아웃 API
export const logout = async (): Promise<any> => {
  try {
    const response = await authApi.delete(`/auth/logout`);
    return response.data;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};
