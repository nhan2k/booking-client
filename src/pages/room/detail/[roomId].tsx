import { reserve } from '@/api/reservation';
import { getRoomId } from '@/api/room';
import Layout from '@/components/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import Datepicker from 'react-tailwindcss-datepicker';
import { DateRangeType } from 'react-tailwindcss-datepicker/dist/types';
import { toast } from 'react-toastify';
import Comment from '@/components/comment';
import { getReviews } from '@/api/review';

type Props = {};

type Inputs = {
  province: string;
  dateRange: DateRangeType;
  traveller: number;
};

interface Range {
  check_in: Date;
  checkout: Date;
}

function Page({}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const room_id =
    typeof router.query.roomId === 'string'
      ? router.query.roomId
      : undefined;

  const query = useQuery({
    queryKey: ['get-rooms&type-byId', room_id],
    queryFn: async () => await getRoomId(room_id),
  });

  const queryComment = useQuery({
    queryKey: ['review', room_id],
    queryFn: async () => await getReviews(room_id),
  });

  const mutation = useMutation({
    mutationKey: ['reservation'],
    mutationFn: reserve,
    async onSuccess(data, variables, context) {
      toast.success('Reserve Success');
      await router.push('/reservation');
    },
    async onError(error, variables, context) {
      toast.error('Reserve fail try again');
      query.refetch();
    },
  });

  const [value, setValue] = React.useState<DateRangeType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const getTotalDays = React.useCallback(() => {
    if (!value.startDate || !value.endDate) {
      return 0;
    }

    const start = moment(value.startDate);
    const end = moment(value.endDate);
    return end.diff(start, 'days') + 1;
  }, [value.startDate, value.endDate]);

  const totalDays = getTotalDays();
  const totalAmount =
    totalDays * query?.data?.prize > 0
      ? totalDays * query?.data?.prize - query?.data?.prize
      : 0;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      check_in: value.startDate,
      checkout: value.endDate,
      guest_list: data.traveller,
      balance_amount: totalAmount,
      hotel_id: query?.data?.__hotel__?.hotel_id,
      room_id: query?.data?.room_id,
    });
  };

  const disableDate =
    query.isSuccess &&
    Array.isArray(query.data?.__hotel__?.__reservations__)
      ? query.data?.__hotel__?.__reservations__?.map(
          (range: Range) => {
            return {
              startDate: moment(range.check_in).add(-1, 'day'),
              endDate: moment(range.checkout),
            };
          }
        )
      : [];

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white">
          <div className="pt-6">
            {/* Image gallery */}
            <div className="mx-auto mt-6 sm:px-6 lg:gap-x-8 lg:px-8 w-9/12 h-[calc(40rem)]">
              <img
                src={`${process.env.NEXT_PUBLIC_ENDPOINT}/${query.data?.imgPath}`}
                alt={`${process.env.NEXT_PUBLIC_ENDPOINT}/${query.data?.imgPath}`}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Hotel Name:{' '}
                  <span className="text-blue-500">
                    {query?.data?.__hotel__?.hotel_name}
                  </span>
                </h1>
              </div>
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                  Room Number:{' '}
                  <span className="text-blue-500">
                    {query?.data?.room_id}
                  </span>
                </h1>
              </div>
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8 mt-2">
                <div className="flex items-center">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Rating star</title>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                    {query?.data?.__roomType__?.rating
                      ? query?.data?.__roomType__?.rating
                      : 'There are no reviews yet'}
                  </p>
                  <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                  {/* <p className="text-sm font-medium text-gray-900 dark:text-white">
                    73 reviews
                  </p> */}
                </div>
              </div>

              {/* Options */}
              {(session?.user as any)?.role === 'user' ? (
                <div className="mt-4 lg:row-span-3 lg:mt-0">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl tracking-tight text-gray-900 ">
                    {!isNaN(query?.data?.prize) &&
                      Number(query?.data?.prize).toLocaleString(
                        'en-US',
                        {
                          style: 'currency',
                          currency: 'USD',
                        }
                      )}
                    / day
                  </p>

                  <div className="sm:col-span-4 mt-5">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Date
                    </label>
                    {query.isSuccess ? (
                      <div className="mt-1 border rounded-md">
                        <Controller
                          name="dateRange"
                          control={control}
                          render={({
                            field: { onChange, value },
                          }) => (
                            <Datepicker
                              value={value}
                              onChange={(val) => {
                                val && setValue(val);
                                val && onChange(val);
                              }}
                              minDate={new Date()}
                              disabledDates={disableDate}
                            />
                          )}
                          rules={{ required: true }}
                        />
                      </div>
                    ) : (
                      <React.Fragment />
                    )}
                    {errors.dateRange && (
                      <p className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2 mt-5">
                    <label
                      htmlFor="guest_list"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Travellers
                    </label>
                    <div className="mt-2">
                      <input
                        {...register('traveller', {
                          required: true,
                          min: 1,
                          max: query?.data?.capacity,
                        })}
                        type="number"
                        min={1}
                        max={query?.data?.capacity}
                        defaultValue={query?.data?.capacity}
                        id="guest_list"
                        autoComplete="guest_list"
                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.traveller && (
                        <p className="text-red-500">
                          This field is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="">Total Amount</label>
                    <p className="text-3xl tracking-tight text-gray-900">
                      {!isNaN(totalAmount) &&
                        Number(totalAmount).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Reserve
                  </button>
                </div>
              ) : (
                <React.Fragment />
              )}

              <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                <h4 className="my-2">
                  <span className="font-semibold">Location</span> :{' '}
                  {query?.data?.__hotel__?.location}
                </h4>
                <h4 className="my-2">
                  <span className="font-semibold">Province</span> :{' '}
                  {query?.data?.__hotel__?.province}
                </h4>
                <h4 className="my-2">
                  <span className="font-semibold">Capacity</span> :{' '}
                  {query?.data?.capacity}
                </h4>
                <h4 className="my-2">
                  <span className="font-semibold">Facilities</span> :{' '}
                  {query?.data?.facilities}
                </h4>
                <div className="mt-10">
                  <h3 className="text-sm font-medium text-gray-900">
                    Room Type:
                  </h3>

                  <div className="my-4">
                    {query?.isSuccess && (
                      <ul
                        role="list"
                        className="list-disc space-y-2 pl-4 text-sm"
                      >
                        {query.data?.__roomType__?.AC && (
                          <React.Fragment>
                            <li className="text-gray-400">
                              <div className="text-gray-600 flex justify-start items-center gap-3">
                                AC:
                                <AiOutlineCheckCircle color="green" />
                              </div>
                            </li>
                          </React.Fragment>
                        )}

                        {query.data?.__roomType__?.heater && (
                          <React.Fragment>
                            <li className="text-gray-400">
                              <div className="text-gray-600 flex justify-start items-center gap-3">
                                Heater:
                                <AiOutlineCheckCircle color="green" />
                              </div>
                            </li>
                          </React.Fragment>
                        )}

                        {query.data?.__roomType__?.wifi && (
                          <React.Fragment>
                            <li className="text-gray-400">
                              <div className="text-gray-600 flex justify-start items-center gap-3">
                                Wifi:
                                <AiOutlineCheckCircle color="green" />
                              </div>
                            </li>
                          </React.Fragment>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <p>
                  <span className="font-semibold">
                    Other Facilities :
                  </span>{' '}
                  {query.data?.__roomType__?.other_facilities}
                </p>
                <h4 className="my-4 font-semibold">
                  Owner Infomation:
                </h4>
                <ul
                  role="list"
                  className="list-disc space-y-2 pl-4 text-sm"
                >
                  <li className="text-gray-400">
                    <div className="text-gray-600 flex justify-start items-center gap-2">
                      <p className="font-semibold">Email :</p>
                      <p>{query.data?.__hotel__?.__user__?.email}</p>
                    </div>
                  </li>
                  <li className="text-gray-400">
                    <div className="text-gray-600 flex justify-start items-center gap-2">
                      <p className="font-semibold">Full Name :</p>
                      <p>
                        {query.data?.__hotel__?.__user__?.first_name}{' '}
                        {query.data?.__hotel__?.__user__?.last_name}
                      </p>
                    </div>
                  </li>
                  <li className="text-gray-400">
                    <div className="text-gray-600 flex justify-start items-center gap-2">
                      <p className="font-semibold">Phone Number :</p>
                      <p>
                        {
                          query.data?.__hotel__?.__user__
                            ?.phone_number
                        }
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl text-semibold">Comments</h1>
        {queryComment.isSuccess ? (
          <Comment
            data={queryComment.data[0]}
            total={queryComment.data[1]}
          />
        ) : (
          <React.Fragment />
        )}
      </div>
    </Layout>
  );
}

export default Page;
