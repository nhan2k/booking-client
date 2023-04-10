import { getReservation } from '@/api/reservation';
import Layout from '@/components/layout';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React from 'react';
import Hotel from '@/assets/images/hotel.jpg';
import PaymentModal from '@/components/payment';
import CancelPayment from '@/components/cancel-payment';

type Props = {};

function Page({}: Props) {
  const query = useQuery({
    queryKey: ['reservation'],
    queryFn: async () => await getReservation(),
  });

  return (
    <Layout>
      <div className="flex justify-center items-center w-screen h-screen">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 w-full h-full mt-20 ml-10 max-w-7xl">
          {query?.data?.map((element: any) => (
            <li
              className="pb-3 sm:pb-4"
              key={element?.reservation_id}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-20 h-20">
                  <img
                    className="w-full h-full object-cover object-center"
                    src={`${process.env.NEXT_PUBLIC_ENDPOINT}/${element?.__hotel__?.imgPath}`}
                    alt={element?.__hotel__?.imgPath}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Hotel Name: {element?.__hotel__?.hotel_name}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Location: {element?.__hotel__?.location}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Province: {element?.__hotel__?.province}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Guest List: {element?.guest_list}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Check In:{' '}
                    {element?.check_in &&
                      new Date(
                        element?.check_in
                      ).toLocaleDateString()}{' '}
                    {element?.check_in &&
                      new Date(
                        element?.check_in
                      ).toLocaleTimeString()}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Checkout:{' '}
                    {element?.checkout &&
                      new Date(
                        element?.checkout
                      ).toLocaleDateString()}{' '}
                    {element?.checkout &&
                      new Date(
                        element?.checkout
                      ).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Reserve Date:{' '}
                    {element?.created_at &&
                      new Date(
                        element?.created_at
                      ).toLocaleDateString()}{' '}
                    {element?.created_at &&
                      new Date(
                        element?.created_at
                      ).toLocaleTimeString()}
                  </p>

                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Room Number: {element?.note}
                  </p>
                </div>

                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  {!isNaN(
                    element?.____transactions____?.[0]?.amount
                  ) &&
                    Number(
                      element?.____transactions____?.[0]?.amount
                    ).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  <PaymentModal
                    value={{
                      amount: Number(
                        element?.____transactions____?.[0]?.amount
                      ).toFixed(2),
                      transaction_id:
                        element?.____transactions____?.[0]
                          ?.transaction_id,
                    }}
                    status={
                      element?.____transactions____?.[0]?.status
                    }
                  />
                </div>
                {element?.____transactions____?.[0]?.status ===
                'paid' ? (
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <CancelPayment
                      reservation_id={element?.reservation_id}
                      status={element?.status}
                    />
                  </div>
                ) : (
                  <React.Fragment />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export default Page;
