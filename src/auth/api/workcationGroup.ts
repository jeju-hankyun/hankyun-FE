import { authApi } from './base';
import type { BaseResponse, CursorResponse, WorkcationGroupResponse, CreateWorkcationGroupRequest } from './interfaces';

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
