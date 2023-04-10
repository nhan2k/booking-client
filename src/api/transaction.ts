import { axiosInterceptor } from '@/config/axios';

export const updateTransaction = async (data: any) => {
  try {
    const response = await axiosInterceptor.patch(
      `/transaction/${data.transaction_id}`,
      data
    );

    return response.data;
  } catch (error) {
    throw new Error('Transaction fail!');
  }
};
