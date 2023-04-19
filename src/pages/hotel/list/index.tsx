import { getMyHotels } from '@/api/hotel';
import Layout from '@/components/layout';
import withAuthentication from '@/lib/withAuthentication';
import { withRoleHotelier } from '@/lib/withAuthorization';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';

type Props = {};

const Page = (props: Props) => {
  const query = useQuery({
    queryKey: ['get-my-hotels'],
    queryFn: getMyHotels,
  });
  const router = useRouter();

  const handleOnClick = async (id: number) => {
    await router.push(`/room/list/${id}`);
  };

  const handleBtnPostClick = async () => {
    await router.push(`/hotel/post`);
  };

  return (
    <Layout>
      <div className="m-auto">
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                My Hotels List
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
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8 cursor-pointer">
                {query?.data?.map((hotel: any) => (
                  <div
                    key={hotel?.hotel_id}
                    className="group truncate"
                    onClick={async () =>
                      await handleOnClick(hotel?.hotel_id)
                    }
                  >
                    <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                        src={`${process.env.NEXT_PUBLIC_ENDPOINT}/${hotel?.imgPath}`}
                        alt={`${process.env.NEXT_PUBLIC_ENDPOINT}/${hotel?.imgPath}`}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm text-gray-700 font-bold">
                        <a href={hotel?.href}>
                          <span aria-hidden="true" />
                          {hotel?.hotel_name}
                        </a>
                      </h3>
                      <p className="text-sm font-medium text-gray-900">
                        {hotel?.province}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 max-h-14 truncate">
                        {hotel?.location}
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

export default withAuthentication(withRoleHotelier(Page));
