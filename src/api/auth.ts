import { axiosInterceptor } from '@/config/axios';

export const getProfile = async () => {
  try {
    const response = await axiosInterceptor.post('/auth/profile');

    return response.data;
  } catch (error: any) {
    throw new Error(
      `Get profile fail ${error?.response?.data?.message}`
    );
  }
};

export const registerAPI = async (data: any) => {
  console.log('🚀 ~ file: auth.ts:16 ~ registerAPI ~ data:', data);
  try {
    const response = await axiosInterceptor.post(
      '/user/register',
      data
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      `Register fail ${error?.response?.data?.message}`
    );
  }
};
