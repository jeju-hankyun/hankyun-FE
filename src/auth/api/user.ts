import { authApi } from './base';
import type { BaseResponse, UserResponse, WorkerCreateRequest, ClubMemberCreateRequest } from './interfaces';

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
