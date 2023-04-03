import { axiosInterceptor } from '@/config/axios';

export const getRooms = async (query: any[]) => {
  try {
    const params = new URLSearchParams([query]);

    const response = await axiosInterceptor.get('/rooms');

    return response.data;
  } catch (error) {
    throw new Error('Get Rooms fail!');
  }
};

export const postRooms = async (data: any) => {
  try {
    const response = await axiosInterceptor.post('/room', data);

    return response.data;
  } catch (error) {
    throw new Error('Post Rooms fail!');
  }
};

export const getRoomsByHotelId = async (hotel_id?: string) => {
  if (!hotel_id) {
    throw new Error('Not Found Hotel ID');
  }
  try {
    const params = new URLSearchParams([['hotelId', hotel_id]]);

    const response = await axiosInterceptor.get('/room/', { params });

    return response.data;
  } catch (error) {
    throw new Error('Get Rooms fail!');
  }
};

export const getRoomId = async (room_id?: string) => {
  if (!room_id) {
    throw new Error('Not Found Hotel ID');
  }
  try {
    const response = await axiosInterceptor.get(`/room/${room_id}`);

    return response.data;
  } catch (error) {
    throw new Error('Get Rooms fail!');
  }
};
