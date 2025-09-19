import axios from 'axios';
import type { 
  CursorResponse, 
  BaseResponse, 
  UserResponse, 
  WorkerCreateRequest, 
  ClubMemberCreateRequest,
  OrganizationResponse,
  OrganizationCreateRequest,
  WorkcationGroupResponse,
  CreateWorkcationGroupRequest,
  CreateTripRequest,
  TripResponse,
  CreateTripDescriptionPRRequest,
  TripDescriptionPRResponse,
  CreateDailyCvcRequest,
  UploadReportRequest,
  UploadResponse,
  UpdateUploadStateRequest,
  CvcStatusResponse,
  TourApiResponse
} from './api/interfaces';

import type { NavigateFunction } from 'react-router-dom'; // ✅ React Router v6의 navigate 타입 사용

// CVC 관련 상수들을 re-export
export { 
  WORKCATION_CVC_UPLOAD_STATE_SUCCESS,
  WORKCATION_CVC_UPLOAD_STATE_FAILED
} from './api/interfaces';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken: string | null = null;
let navigateFunction: NavigateFunction | null = null; // ✅ NavigateFunction으로 타입 변경

// --- 토큰/네비게이션 설정 함수 ---
export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const setNavigateFunction = (navigate: NavigateFunction) => {
  navigateFunction = navigate;
};

// --- 인터셉터 설정 ---
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
    if (error.response.status === 401 && !originalRequest._retry && error.config.url !== '/auth/reissue') {
      originalRequest._retry = true;
      try {
        const newAccessToken = await reissueToken();
        accessToken = newAccessToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        console.error('토큰 재발급 실패 및 로그인 페이지로 리다이렉트:', refreshError);
        if (navigateFunction) {
          navigateFunction('/login'); // ✅ React Router navigate 사용
        } else {
          window.location.href = '/login'; // fallback
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// --- Google OAuth API ---
export const getGoogleAuthUrl = async (): Promise<string> => {
  try {
    const response = await authApi.get<{ message: string; data: { login_url: string } }>(`/auth/login/google`);
    return response.data.data.login_url;
  } catch (error) {
    console.error('Google 인증 URL 가져오기 실패:', error);
    throw error;
  }
};

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

// --- 로그아웃 API ---
export const logout = async (): Promise<any> => {
  try {
    const response = await authApi.delete(`${API_BASE_URL}/auth/logout`);
    return response.data;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};

// --- 토큰 재발급 API ---
export const reissueToken = async (): Promise<string> => {
  try {
    const response = await authApi.post(`${API_BASE_URL}/auth/reissue`);

    let token = response.data?.access_token ||
                response.data?.data?.access_token ||
                response.headers?.authorization ||
                response.headers?.Authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    if (!token) {
      throw new Error('토큰을 찾을 수 없습니다.');
    }

    return token;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    throw error;
  }
};

// --- User API ---
export const getUserProfile = async (): Promise<BaseResponse<UserResponse>> => {
  try {
    const response = await authApi.get<BaseResponse<UserResponse>>(`/user/profile`);
    return response.data;
  } catch (error) {
    console.error('내 프로필 조회 실패:', error);
    throw error;
  }
};

export const getUserProfileById = async (userId: number): Promise<BaseResponse<UserResponse>> => {
  try {
    const response = await authApi.get<BaseResponse<UserResponse>>(`/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('다른 사용자 프로필 조회 실패:', error);
    throw error;
  }
};

export const postWorker = async (data: WorkerCreateRequest): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/user/worker`, data);
    return response.data;
  } catch (error) {
    console.error('근로자 정보 등록 실패:', error);
    throw error;
  }
};

export const postClubMember = async (data: ClubMemberCreateRequest): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/user/club_member`, data);
    return response.data;
  } catch (error) {
    console.error('클럽 멤버 정보 등록 실패:', error);
    throw error;
  }
};

// --- Organization API ---
export const getOrganizations = async (
  cursorId?: number,
  size: number = 20
): Promise<BaseResponse<CursorResponse<OrganizationResponse>>> => {
  try {
    const response = await authApi.get<BaseResponse<CursorResponse<OrganizationResponse>>>(`/organizations/`, {
      params: { cursorId, size },
    });
    return response.data;
  } catch (error) {
    console.error('조직 목록 조회 실패:', error);
    throw error;
  }
};

export const addOrganization = async (
  data: OrganizationCreateRequest
): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/organizations/`, data);
    return response.data;
  } catch (error) {
    console.error('조직 등록 실패:', error);
    throw error;
  }
};

export const uploadOrganizationLogo = async (
  organizationId: number,
  file: File
): Promise<BaseResponse<string>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await authApi.patch<BaseResponse<string>>(
      `/organizations/${organizationId}/logo`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('조직 로고 업로드 실패:', error);
    throw error;
  }
};

// --- Workcation Group API ---
export const createWorkcationGroup = async (
  organizationId: number,
  data: CreateWorkcationGroupRequest
): Promise<BaseResponse<WorkcationGroupResponse>> => {
  try {
    const response = await authApi.post<BaseResponse<WorkcationGroupResponse>>(
      `/organizations/${organizationId}/workcation-groups`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('워케이션 그룹 생성 실패:', error);
    throw error;
  }
};

export const getWorkcationGroups = async (
  organizationId: number,
  cursor?: string,
  size: number = 20
): Promise<BaseResponse<CursorResponse<WorkcationGroupResponse>>> => {
  try {
    const response = await authApi.get<BaseResponse<CursorResponse<WorkcationGroupResponse>>>(
      `/organizations/${organizationId}/workcation-groups`,
      {
        params: { cursor, size },
      }
    );
    return response.data;
  } catch (error) {
    console.error('조직별 워케이션 그룹 목록 조회 실패:', error);
    throw error;
  }
};

// --- CVC API ---
export const createDailyCvc = async (
  data: CreateDailyCvcRequest
): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/cvc/create-daily`, data);
    return response.data;
  } catch (error) {
    console.error('일일 CVC 생성 실패:', error);
    throw error;
  }
};

export const updateUploadState = async (
  uploadId: number,
  data: UpdateUploadStateRequest
): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.patch<BaseResponse<string>>(
      `/cvc/upload/${uploadId}/state`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('업로드 상태 업데이트 실패:', error);
    throw error;
  }
};

export const completeDailyCvc = async (cvcId: number): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/cvc/complete/${cvcId}`);
    return response.data;
  } catch (error) {
    console.error('일일 CVC 완료 실패:', error);
    throw error;
  }
};

export const getCvcStatus = async (
  targetDate: string
): Promise<BaseResponse<CvcStatusResponse>> => {
  try {
    const response = await authApi.get<BaseResponse<CvcStatusResponse>>(
      `/cvc/status/${targetDate}`
    );
    return response.data;
  } catch (error) {
    console.error('CVC 현황 조회 실패:', error);
    throw error;
  }
};

export const uploadProgressReport = async (
  data: UploadReportRequest
): Promise<BaseResponse<UploadResponse>> => {
  try {
    const response = await authApi.post<BaseResponse<UploadResponse>>(
      `/cvc/upload-report`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('진행 보고서 업로드 실패:', error);
    throw error;
  }
};

// --- Trip API ---
export const createTrip = async (
  workcationGroupId: number,
  data: CreateTripRequest
): Promise<BaseResponse<TripResponse>> => {
  try {
    const response = await authApi.post<BaseResponse<TripResponse>>(
      `/workcation-groups/${workcationGroupId}/trips`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error('Trip 생성 실패:', error);
    if (error.response?.status === 500) {
      console.warn('Trip 생성 API에서 서버 내부 오류가 발생했습니다.');
    }
    throw error;
  }
};

export const getTrips = async (
  workcationGroupId: number,
): Promise<BaseResponse<CursorResponse<TripResponse>>> => {
  try {
    const response = await authApi.get<BaseResponse<CursorResponse<TripResponse>>>(
      `/workcation-groups/${workcationGroupId}/trips`
    );
    return response.data;
  } catch (error: any) {
    console.error('Trip 목록 조회 실패:', error);
    if (error.response?.status === 500) {
      console.warn('Trip 목록 조회 API에서 서버 내부 오류가 발생했습니다.');
    }
    throw error;
  }
};

// --- TourAPI ---
export const getTourApiCongestionData = async (
  params: {
    tAtsNm?: string;
    areaCd?: string;
    signguCd?: string;
    numOfRows?: number;
  }
): Promise<TourApiResponse> => {
  try {
    const serviceKey = import.meta.env.VITE_TOUR_API_KEY;
    if (!serviceKey) {
      throw new Error('TourAPI 서비스 키가 설정되지 않았습니다.');
    }

    const queryParams = new URLSearchParams({
      serviceKey,
      MobileOS: 'ETC',
      MobileApp: 'Hankyeon',
      numOfRows: (params.numOfRows || 30).toString(),
      pageNo: '1',
      _type: 'json',
      ...(params.tAtsNm && { tAtsNm: params.tAtsNm }),
      ...(params.areaCd && { areaCd: params.areaCd }),
      ...(params.signguCd && { signguCd: params.signguCd }),
    });

    const response = await fetch(
      `http://apis.data.go.kr/B551011/TatsCnctrRateService/tatsCnctrRatedList?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`TourAPI 요청 실패: ${response.status}`);
    }

    const data: TourApiResponse = await response.json();
    
    if (data.response.header.resultCode !== '0000') {
      throw new Error(`TourAPI 오류: ${data.response.header.resultMsg}`);
    }

    return data;
  } catch (error) {
    console.error('TourAPI 혼잡도 데이터 조회 실패:', error);
    throw error;
  }
};

// --- Trip Description PR API ---
export const createTripDescriptionPR = async (
  tripDescriptionId: number,
  data: CreateTripDescriptionPRRequest
): Promise<BaseResponse<TripDescriptionPRResponse>> => {
  try {
    const response = await authApi.post<BaseResponse<TripDescriptionPRResponse>>(
      `/trip-descriptions/${tripDescriptionId}/prs`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Trip Description PR 생성 실패:', error);
    throw error;
  }
};

export const approvePR = async (
  prId: number
): Promise<BaseResponse<TripDescriptionPRResponse>> => {
  try {
    const response = await authApi.patch<BaseResponse<TripDescriptionPRResponse>>(
      `/trip-description-prs/${prId}/approve`
    );
    return response.data;
  } catch (error) {
    console.error('PR 승인 실패:', error);
    throw error;
  }
};

export const rejectPR = async (
  prId: number
): Promise<BaseResponse<TripDescriptionPRResponse>> => {
  try {
    const response = await authApi.patch<BaseResponse<TripDescriptionPRResponse>>(
      `/trip-description-prs/${prId}/reject`
    );
    return response.data;
  } catch (error) {
    console.error('PR 거절 실패:', error);
    throw error;
  }
};

// --- export ---
export default authApi;
