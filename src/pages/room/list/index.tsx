import { getRooms } from '@/api/room';
import Layout from '@/components/layout';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();

  const params: any[] = [];
  const query = useQuery({
    queryKey: ['get-rooms', params],
    queryFn: async () => await getRooms(params),
  });

  const handleOnClick = async (id: number) => {
    await router.push(`/room/list/${id}`);
  };

  return (
    <Layout>
      <div className="m-auto w-screen h-screen">
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers also purchased
            </h2>

            {query.isSuccess ? (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 cursor-pointer">
                {query?.data?.map((hotel: any) => (
                  <div
                    key={hotel?.hotel_id}
                    className="group relative"
                    onClick={async () =>
                      await handleOnClick(hotel?.hotel_id)
                    }
                  >
                    <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                        src={hotel?.imageSrc}
                        alt={hotel?.imageAlt}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <a href={hotel?.href}>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {hotel?.hotel_name}
                          </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {hotel?.location}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {hotel?.province}
                      </p>
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
};

export default Page;
