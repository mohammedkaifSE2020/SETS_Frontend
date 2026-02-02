import api from '../axios.config';

export interface RegistrationRequest {
  username: string;
  email: string;
  displayName: string;
}

export interface UserResponse {
  userId: string;
  username: string;
  displayName: string;
  gamesPlayed: number;
  gamesWon: number;
}

export const register = async (
  data: RegistrationRequest
): Promise<UserResponse> => {
  try {
    const response = await api.post<UserResponse>('/users/register', data);
    return response.data;
  } catch (error: any) {
    // Axios-specific error handling
    if (error.response) {
      // Backend responded with error status (400, 409, 500, etc.)
      throw new Error(error.response.data?.message || 'Registration failed');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Server not reachable');
    } else {
      // Something else went wrong
      throw new Error('Something went wrong');
    }
  }
};