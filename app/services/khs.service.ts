import apiClient from '../lib/api.config';
import { type KhsResponse } from '../schemas/khs.schema';

export const khsService = {
  /**
   * Fetch KHS data
   * @param semester Optional semester to filter by
   */
  async getKhs(semester?: string): Promise<KhsResponse> {
    const params = semester ? { semester } : {};
    const response = await apiClient.get<KhsResponse>('/api/mhs/lihat-khs', { params });
    return response.data;
  },
};
