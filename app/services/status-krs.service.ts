import apiClient from '../lib/api.config';
import { type StatusKrsResponse } from '../schemas/status-krs.schema';

export const statusKrsService = {
  /**
   * Fetch status KRS data
   */
  async getStatusKrs(): Promise<StatusKrsResponse> {
    // Make API request
    const response = await apiClient.get<StatusKrsResponse>('/api/mhs/status-krs');
    
    return response.data;
  },
};
