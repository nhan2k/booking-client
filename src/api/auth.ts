import { axiosInterceptor } from '@/config/axios';

export const getProfile = async () => {
  try {
    const response = await axiosInterceptor.post('/auth/profile');

    return response.data;
  } catch (error) {
    return error as unknown;
  }
};

export const registerAPI = async (data: any) => {
  try {
    const response = await axiosInterceptor.post(
      '/user/register',
      data
    );

    return response.data;
  } catch (error) {
    return error as unknown;
  }
};
