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
export interface UserResponse {
  user_id: number;
  name: string;
  email: string;
  profile: string;
  role: string;
}

export interface WorkerCreateRequest {
  company_id: number;
  job_title: string;
  rank: string;
}

export interface ClubMemberCreateRequest {
  club_id: number;
}

// --- Organization related Interfaces ---
export interface OrganizationResponse {
  organization_id: number;
  owner_id: number;
  type: string;
  name: string;
  logo: string;
  description: string;
}

export interface OrganizationCreateRequest {
  type: string;
  name: string;
  description: string;
}

// --- Workcation Group related Interfaces ---
export interface WorkcationGroupResponse {
  workcation_group_id: number;
  organization_id: number;
  manager: number;
  place: string;
  money: number;
  purpose: string;
  start_date: string;
  end_date: string;
}

export interface CreateWorkcationGroupRequest {
  place: string;
  money: number;
  purpose: string;
  start_date: string;
  end_date: string;
}

// --- Trip related Interfaces ---
export interface CreateTripRequest {
  place: string;
  start_date: string;
  end_date: string;
}

export interface TripResponse {
  trip_id: number;
  workcation_group_id: number;
  place: string;
  start_date: string;
  end_date: string;
}

// --- Trip Description PR related Interfaces ---
export interface CreateTripDescriptionPRRequest {
  writer_id: number;
  description: string;
}

export interface TripDescriptionPRResponse {
  trip_description_pr_id: number;
  trip_description_id: number;
  writer_id: number;
  description: string;
  state: string;
}

// --- CVC related Interfaces ---
export interface CreateDailyCvcRequest {
  target_date: string; // YYYY-MM-DD
  group_ids: number[]; // 최소 2개 이상
}

export const WORKCATION_CVC_UPLOAD_STATE_SUCCESS = 1 as const;
export const WORKCATION_CVC_UPLOAD_STATE_FAILED = 2 as const;

export type WorkcationCvcUploadState = typeof WORKCATION_CVC_UPLOAD_STATE_SUCCESS | typeof WORKCATION_CVC_UPLOAD_STATE_FAILED;

export interface UploadReportRequest {
  trip_id: number;
  match_id: number;
  document_id: number;
  longitude: number;
  latitude: number;
}

export interface UploadResponse {
  workcation_cvc_upload_id: number;
  trip_id: number;
  workcation_match_id: number;
  workcation_document_id: number;
  longitude: number;
  latitude: number;
  state: WorkcationCvcUploadState;
  created_at: string;
}

export interface UpdateUploadStateRequest {
  state: WorkcationCvcUploadState;
}

export interface MatchProgressResponse {
  group_id: number;
  progress: number;
}

export interface CvcStatusResponse {
  cvc_id: number;
  cvc_date: string; // YYYY-MM-DD
  is_completed: 0 | 1; // 0: 진행중, 1: 완료
  matches: number;
  progress: MatchProgressResponse[];
  winner?: number | null; // 완료되지 않았으면 null
}

// --- TourAPI related Interfaces ---
export interface TourApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: TourApiItem[];
      };
    };
  };
}

export interface TourApiItem {
  baseYmd: string; // 기준일자 (YYYYMMDD)
  cnctrRate: string; // 혼잡도 (%)
  tAtsNm: string; // 관광지명
}

export interface TourApiParams {
  tAtsNm?: string; // 관광지명
  areaCd?: string; // 지역 코드
  signguCd?: string; // 시군구 코드
  numOfRows?: number; // 가져올 데이터 수
}