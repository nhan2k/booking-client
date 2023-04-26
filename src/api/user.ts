import { axiosInterceptor } from '@/config/axios';

export const getProfile = async (): Promise<any> => {
  try {
    const response = await axiosInterceptor.get('/auth/profile');

    return response.data;
  } catch (error) {
    throw new Error('Get profile fail!');
  }
};

export const updateProfile = async (data: any) => {
  try {
    const formData = new FormData();
    if (data?.file) {
      formData.append('file', data?.file?.[0]);
    }
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('location', data.location);
    formData.append('phone_number', data.phone_number);

    const response = await axiosInterceptor.patch(
      '/user/profile',
      formData
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      `Update Profile fail ${error?.response?.data?.message}`
    );
  }
};
