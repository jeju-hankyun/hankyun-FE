import axios from 'axios';
// useNavigate 훅이 반환하는 함수의 시그니처와 일치하는 사용자 정의 타입 정의
type CustomNavigateFunction = (to: string, options?: { replace?: boolean; state?: any }) => void;

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

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry && error.config.url !== '/auth/reissue') {
      originalRequest._retry = true;
      try {
        const newAccessToken = await reissueToken();
        accessToken = newAccessToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        console.error('토큰 재발급 실패 및 로그인 페이지로 리다이렉트:', refreshError);
        if (navigateFunction) {
          navigateFunction('/login');
        } else {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// base.ts
export async function reissueToken(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/auth/reissue`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('토큰 재발급 실패');
  }
  const data = await res.json();
  return data.access_token;
}