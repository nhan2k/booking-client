import { getMyRooms } from '@/api/hotel';
import { getRoomsByHotelId } from '@/api/room';
import Layout from '@/components/layout';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import Hotel from '@/assets/images/hotel.jpg';
import Image from 'next/image';

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const hotel_id =
    typeof router.query.hotelId === 'string'
      ? router.query.hotelId
      : undefined;
  const query = useQuery({
    queryKey: ['get-my-rooms', hotel_id],
    queryFn: async () => await getRoomsByHotelId(hotel_id),
  });

  const handleOnClickItem = async (id: number) => {
    await router.push(`/room/detail/${id}`);
  };

  const handleBtnPostClick = async () => {
    await router.push(`/room/post`);
  };

  return (
    <Layout>
      <div className="m-auto">
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Customers also purchased
              </h2>
              <button
                onClick={handleBtnPostClick}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Post
              </button>
            </div>

            {query.isSuccess ? (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 cursor-pointer">
                {query?.data?.map((room: any) => (
                  <div
                    key={room?.room_id}
                    className="group relative"
                    onClick={async () =>
                      await handleOnClickItem(room?.room_id)
                    }
                  >
                    <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                        src={`${process.env.NEXT_PUBLIC_ENDPOINT}/${room?.imgPath}`}
                        alt={`${process.env.NEXT_PUBLIC_ENDPOINT}/${room?.imgPath}`}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <p>
                            facilities
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {room?.facilities}
                          </p>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Prize{' '}
                          {!isNaN(room?.prize) &&
                            Number(room?.prize).toLocaleString(
                              'it-IT',
                              {
                                style: 'currency',
                                currency: 'VND',
                              }
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <React.Fragment />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Page;
