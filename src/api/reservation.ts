import { axiosInterceptor } from '@/config/axios';
import { DateType } from 'react-tailwindcss-datepicker/dist/types';

type TDataReserve = {
  guest_list: number;
  check_in: DateType;
  checkout: DateType;
  balance_amount: number;
  hotel_id: number;
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

export const getReservation = async () => {
  try {
    const response = await axiosInterceptor.get('/reservation');

    return response.data;
  } catch (error) {
    throw new Error('Reservation fail!');
  }
};
