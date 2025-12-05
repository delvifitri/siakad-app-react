import apiClient from '../lib/api.config';
import { homeResponseSchema, type HomeResponse } from '../schemas/home.schema';

export const homeService = {
  /**
   * Fetch home page data
   */
  async getHomeData(): Promise<HomeResponse> {
    // Make API request
    const response = await apiClient.get<HomeResponse>('/api/mhs/home');
    
    // Validate response data
    const validatedResponse = homeResponseSchema.parse(response.data);
    
    return validatedResponse;
  },
};
