import { authApi } from './base';
import type { BaseResponse, CursorResponse, TripResponse, CreateTripRequest } from './interfaces';

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
