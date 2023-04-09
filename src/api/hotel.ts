import { axiosInterceptor } from '@/config/axios';

export const postHotel = async (data: any) => {
  try {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('hotel_name', data.hotel_name);
    formData.append('location', data.location);
    formData.append('province', data.province);

    const response = await axiosInterceptor.post('/hotel', formData);

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
