import { axiosInterceptor } from '@/config/axios';

export const postHotel = async (data: any) => {
  try {
    const response = await axiosInterceptor.post('/hotel', data);

    return response;
  } catch (error) {
    throw new Error('Creat Hotel fail!');
  }
};

export const getMyHotels = async (data: any) => {
  try {
    const response = await axiosInterceptor.get('/hotel/my', data);

    return response.data;
  } catch (error) {
    throw new Error('Get Hotel fail!');
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
  } catch (error) {
    throw new Error('Get Room fail!');
  }
};
