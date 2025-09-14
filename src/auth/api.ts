import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // .env 파일에서 API 기본 URL을 가져오거나 기본값 설정

// axios 인스턴스 생성 (인터셉터 설정을 위해)
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 전송을 위해 필요
});

// Access Token 저장 변수 (클라이언트 측에서 관리 필요)
let accessToken: string | null = null;

// Access Token을 설정하는 함수 추가
export const setAccessToken = (token: string) => {
  accessToken = token;
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
        window.location.href = '/login'; // TODO: React Router의 navigate를 사용하도록 변경 필요
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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
    const response = await authApi.get(`${API_BASE_URL}/auth/login/google/callback`, {
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
    const response = await authApi.delete(`${API_BASE_URL}/auth/logout`);
    return response.data;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};

// 토큰 재발급 API
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

// 다른 API 호출 시 사용할 axios 인스턴스 (옵션: 인터셉터 추가 가능)
export default authApi; // 기본으로 내보내어 다른 곳에서 import하여 사용
