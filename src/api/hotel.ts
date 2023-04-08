import { axiosInterceptor } from '@/config/axios';
import { AxiosError } from 'axios';

export const postHotel = async (data: any) => {
  try {
    const response = await axiosInterceptor.post('/hotel', data);

    return response;
  } catch (error: any) {
    throw new Error(error?.resposne?.message ?? 'Creat Hotel fail!');
  }
};

export const getMyHotels = async (data: any) => {
  try {
    const response = await axiosInterceptor.get('/hotel/my', data);

    return response.data;
  } catch (error: any) {
    throw new Error(error?.resposne?.message ?? 'Get Hotel fail!');
  }
};

export const getMyRooms = async (
  hotel_id: number | string | undefined
) => {
  if (!hotel_id) {
    throw new Error('Cant find hotel id');
  }
  try {
    const response = await axiosInterceptor.get(
      `/hotel/my/${hotel_id}`
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error?.resposne?.message ?? 'Get Room fail!');
  }
};
