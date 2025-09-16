import axios from 'axios';
import type { CustomNavigateFunction } from './interfaces';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken: string | null = null;
let navigateFunction: CustomNavigateFunction | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const setNavigateFunction = (navigate: CustomNavigateFunction) => {
  navigateFunction = navigate;
};

// Request 인터셉터: Access Token을 Authorization 헤더에 추가
authApi.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 401 에러 발생 시 토큰 재발급 시도
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 401 에러이고, 재시도 플래그가 없으며, 재발급 API 호출이 아닌 경우
    if (error.response.status === 401 && !originalRequest._retry && error.config.url !== '/auth/reissue') {
      originalRequest._retry = true;
      try {
        const newAccessToken = await reissueToken();
        accessToken = newAccessToken; // 새로 발급받은 Access Token 저장
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authApi(originalRequest); // 기존 요청 재시도
      } catch (refreshError) {
        console.error('토큰 재발급 실패 및 로그인 페이지로 리다이렉트:', refreshError);
        // 토큰 재발급 실패 시 로그인 페이지로 리다이렉트
        if (navigateFunction) {
          navigateFunction('/login');
        } else {
          window.location.href = '/login'; // navigate 함수가 없을 경우 fallback
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const reissueToken = async (): Promise<string> => {
  try {
    const response = await authApi.post(`${API_BASE_URL}/auth/reissue`);
    // 서버에서 Authorization 헤더로 새로운 access token을 반환한다고 가정
    const newAccessToken = response.headers.authorization;
    if (!newAccessToken) {
      throw new Error("새로운 Access Token이 응답 헤더에 없습니다.");
    }
    return newAccessToken.split(' ')[1]; // "Bearer " 제거 후 반환
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    throw error;
  }
};
