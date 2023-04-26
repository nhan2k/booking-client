import { axiosInterceptor } from '@/config/axios';

export const getReviews = async (room_id?: number | string) => {
  try {
    if (!room_id) {
      throw new Error('Not Found Hotel ID');
    }
    const response = await axiosInterceptor.get(`/review/${room_id}`);

    return response.data;
  } catch (error) {
    throw new Error('Get reviews fail!');
  }
};

export const postReview = async (data: any) => {
  try {
    const response = await axiosInterceptor.post(`/review`, data);

    return response.data;
  } catch (error) {
    throw new Error('Post reviews fail!');
  }
};
