import { authApi } from './base';
import type { BaseResponse, TripDescriptionPRResponse, CreateTripDescriptionPRRequest } from './interfaces';

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
