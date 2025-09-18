import axios from 'axios';
// import { NavigateFunction } from 'react-router-dom'; // NavigateFunction 타입 임포트 제거

// useNavigate 훅이 반환하는 함수의 시그니처와 일치하는 사용자 정의 타입 정의
type CustomNavigateFunction = (to: string, options?: { replace?: boolean; state?: any }) => void;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken: string | null = null;
let navigateFunction: CustomNavigateFunction | null = null; // CustomNavigateFunction 사용

// --- Common Interfaces ---


export interface CursorResponse<T> {
  values: T[] | null;
  has_next: boolean | null;
}

export interface BaseResponse<T> {
  message: string;
  data: T | null;
}

// --- User related Interfaces ---
interface UserResponse {
  user_id: number;
  name: string;
  email: string;
  profile: string;
  role: string;
}

interface WorkerCreateRequest {
  company_id: number;
  job_title: string;
  rank: string;
}

interface ClubMemberCreateRequest {
  club_id: number;
}

// --- Organization related Interfaces ---
interface OrganizationResponse {
  organization_id: number;
  owner_id: number;
  type: string;
  name: string;
  logo: string;
  description: string;
}

interface OrganizationCreateRequest {
  type: string;
  name: string;
  description: string;
}

// --- Workcation Group related Interfaces ---
interface WorkcationGroupResponse {
  workcation_group_id: number;
  organization_id: number;
  manager: number;
  place: string;
  money: number;
  purpose: string;
  start_date: string;
  end_date: string;
}

interface CreateWorkcationGroupRequest {
  place: string;
  money: number;
  purpose: string;
  start_date: string;
  end_date: string;
}

// --- Trip related Interfaces ---
interface CreateTripRequest {
  place: string;
  start_date: string;
  end_date: string;
}

interface TripResponse {
  trip_id: number;
  workcation_group_id: number;
  place: string;
  start_date: string;
  end_date: string;
}

// --- Trip Description PR related Interfaces ---
interface CreateTripDescriptionPRRequest {
  writer_id: number;
  description: string;
}

interface TripDescriptionPRResponse {
  trip_description_pr_id: number;
  trip_description_id: number;
  writer_id: number;
  description: string;
  state: string;
}

// --- CVC related Interfaces ---
interface CreateDailyCvcRequest {
  target_date: string; // YYYY-MM-DD
  group_ids: number[]; // 최소 2개 이상
}

export const WORKCATION_CVC_UPLOAD_STATE_SUCCESS = 1 as const;
export const WORKCATION_CVC_UPLOAD_STATE_FAILED = 2 as const;

export type WorkcationCvcUploadState = typeof WORKCATION_CVC_UPLOAD_STATE_SUCCESS | typeof WORKCATION_CVC_UPLOAD_STATE_FAILED;

interface UploadReportRequest {
  trip_id: number;
  match_id: number;
  document_id: number;
  longitude: number;
  latitude: number;
}

interface UploadResponse {
  workcation_cvc_upload_id: number;
  trip_id: number;
  workcation_match_id: number;
  workcation_document_id: number;
  longitude: number;
  latitude: number;
  state: WorkcationCvcUploadState;
  created_at: string;
}

interface UpdateUploadStateRequest {
  state: WorkcationCvcUploadState;
}

interface MatchProgressResponse {
  group_id: number;
  progress: number;
}

interface CvcStatusResponse {
  cvc_id: number;
  cvc_date: string; // YYYY-MM-DD
  is_completed: 0 | 1; // 0: 진행중, 1: 완료
  matches: number;
  progress: MatchProgressResponse[];
  winner?: number | null; // 완료되지 않았으면 null
}

// --- Existing functions ---
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

    // 다양한 가능성 체크
    let token = response.data?.access_token ||
                response.data?.data?.access_token ||
                response.headers?.authorization ||
                response.headers?.Authorization;

    // Bearer 접두사가 있으면 제거
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

// --- New API functions ---
// 내 프로필 조회 API
export const getUserProfile = async (): Promise<BaseResponse<UserResponse>> => {
  try {
    const response = await authApi.get<BaseResponse<UserResponse>>(`/user/profile`);
    return response.data;
  } catch (error) {
    console.error('내 프로필 조회 실패:', error);
    throw error;
  }
};

// 다른 사용자 프로필 조회 API
export const getUserProfileById = async (userId: number): Promise<BaseResponse<UserResponse>> => {
  try {
    const response = await authApi.get<BaseResponse<UserResponse>>(`/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('다른 사용자 프로필 조회 실패:', error);
    throw error;
  }
};

// 근로자 정보 등록 API
export const postWorker = async (data: WorkerCreateRequest): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/user/worker`, data);
    return response.data;
  } catch (error) {
    console.error('근로자 정보 등록 실패:', error);
    throw error;
  }
};

// 클럽 멤버 정보 등록 API
export const postClubMember = async (data: ClubMemberCreateRequest): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/user/club_member`, data);
    return response.data;
  } catch (error) {
    console.error('클럽 멤버 정보 등록 실패:', error);
    throw error;
  }
};

// --- Organization API functions ---
// 조직 목록 조회 API
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

// 조직/회사 등록 API
export const addOrganization = async (
  data: OrganizationCreateRequest
): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/organizations/`, data);
    return response.data;
  } catch (error) {
    console.error('조직/회사 등록 실패:', error);
    throw error;
  }
};

// 조직 로고 업로드 API
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('조직 로고 업로드 실패:', error);
    throw error;
  }
};

// --- Workcation Group API functions ---
// 워케이션 그룹 생성 API
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

// 조직별 워케이션 그룹 목록 조회 API
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

// --- Trip API functions ---
// Trip 생성 API
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
  } catch (error) {
    console.error('Trip 생성 실패:', error);
    throw error;
  }
};

// Trip 목록 조회 API
export const getTrips = async (
  workcationGroupId: number,
): Promise<BaseResponse<CursorResponse<TripResponse>>> => {
  try {
    const response = await authApi.get<BaseResponse<CursorResponse<TripResponse>>>(
      `/workcation-groups/${workcationGroupId}/trips`
    );
    return response.data;
  } catch (error) {
    console.error('Trip 목록 조회 실패:', error);
    throw error;
  }
};

// --- Trip Description PR API functions ---
// Trip Description PR 생성 API
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

// Trip Description PR 승인 API
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

// Trip Description PR 거절 API
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

// --- New CVC API functions ---
// 일일 CVC 생성 API
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

// 진행 보고서 업로드 API
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

// 업로드 상태 업데이트 API
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

// 일일 CVC 완료 API
export const completeDailyCvc = async (cvcId: number): Promise<BaseResponse<string>> => {
  try {
    const response = await authApi.post<BaseResponse<string>>(`/cvc/complete/${cvcId}`);
    return response.data;
  } catch (error) {
    console.error('일일 CVC 완료 실패:', error);
    throw error;
  }
};

// CVC 현황 조회 API
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

// 다른 API 호출 시 사용할 axios 인스턴스 (옵션: 인터셉터 추가 가능)
export default authApi;
