import { authApi } from './base';
import type { BaseResponse, CursorResponse, OrganizationResponse, OrganizationCreateRequest } from './interfaces';

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
