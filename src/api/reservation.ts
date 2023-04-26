import { axiosInterceptor } from '@/config/axios';
import { DateType } from 'react-tailwindcss-datepicker/dist/types';

type TDataReserve = {
  guest_list: number;
  check_in: DateType;
  checkout: DateType;
  balance_amount: number;
  hotel_id: number;
  room_id: number;
};

export const reserve = async (data: TDataReserve) => {
  try {
    const response = await axiosInterceptor.post(
      '/reservation',
      data
    );

    return response.data;
  } catch (error) {
    throw new Error('Reservation fail!');
  }
};

export const getReservation = async (query: {
  pageSize?: number;
  pageNumber?: number;
}) => {
  try {
    const params = new URLSearchParams([
      ['pageSize', query?.pageSize?.toString() ?? '1'],
      ['pageNumber', query?.pageNumber?.toString() ?? '10'],
    ]);
    const response = await axiosInterceptor.get('/reservation', {
      params,
    });

    return response.data;
  } catch (error) {
    throw new Error('Reservation fail!');
  }
};

export const updateReservation = async (reservation_id: number) => {
  try {
    const response = await axiosInterceptor.patch(
      `/reservation/${reservation_id}`
    );

    return response.data;
  } catch (error) {
    throw new Error('Update reservation fail!');
  }
};
