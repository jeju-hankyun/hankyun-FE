import { authApi } from './base';
import type { BaseResponse, CreateDailyCvcRequest, UploadReportRequest, UploadResponse, UpdateUploadStateRequest, CvcStatusResponse } from './interfaces';

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
