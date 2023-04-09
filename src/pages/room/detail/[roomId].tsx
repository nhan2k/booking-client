import { reserve } from '@/api/reservation';
import { getRoomId } from '@/api/room';
import Layout from '@/components/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import Datepicker from 'react-tailwindcss-datepicker';
import { DateRangeType } from 'react-tailwindcss-datepicker/dist/types';
import { toast } from 'react-toastify';

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
  const router = useRouter();

  const room_id =
    typeof router.query.roomId === 'string'
      ? router.query.roomId
      : undefined;

  const query = useQuery({
    queryKey: ['get-rooms&type-byId', room_id],
    queryFn: async () => await getRoomId(room_id),
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
  const totalAmount = totalDays * query?.data?.prize;

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
            <div className="mx-auto mt-6 sm:px-6 lg:gap-x-8 lg:px-8 w-full">
              <div className="aspect-h-4 hidden overflow-hidden rounded-lg lg:block">
                <img
                  src={`${process.env.NEXT_PUBLIC_ENDPOINT}/${query.data?.imgPath}`}
                  alt={`${process.env.NEXT_PUBLIC_ENDPOINT}/${query.data?.imgPath}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Hotel Name: {query?.data?.__hotel__?.hotel_name}
                </h1>
              </div>

              {/* Options */}
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  {!isNaN(query?.data?.prize) &&
                    Number(query?.data?.prize).toLocaleString(
                      'it-IT',
                      {
                        style: 'currency',
                        currency: 'VND',
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
                        render={({ field: { onChange, value } }) => (
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
                        max: 10,
                      })}
                      type="number"
                      min={1}
                      defaultValue={1}
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
                      Number(totalAmount).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
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

              <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                <h4>location : {query?.data?.__hotel__?.location}</h4>
                <h4>Province : {query?.data?.__hotel__?.province}</h4>
                <h4>Capacity : {query?.data?.capacity}</h4>
                <h4>Facilities : {query?.data?.facilities}</h4>
                <div className="mt-10">
                  <h3 className="text-sm font-medium text-gray-900">
                    Room Type:
                  </h3>

                  <div className="my-4">
                    {query?.isSuccess &&
                    Array.isArray(query?.data?.____roomTypes____) ? (
                      <ul
                        role="list"
                        className="list-disc space-y-2 pl-4 text-sm"
                      >
                        {query.data?.____roomTypes____?.[0]?.AC && (
                          <React.Fragment>
                            <li className="text-gray-400">
                              <div className="text-gray-600 flex justify-start items-center gap-3">
                                AC:
                                <AiOutlineCheckCircle color="green" />
                              </div>
                            </li>
                          </React.Fragment>
                        )}

                        {query.data?.____roomTypes____?.[0]
                          ?.heater && (
                          <React.Fragment>
                            <li className="text-gray-400">
                              <div className="text-gray-600 flex justify-start items-center gap-3">
                                Heater:
                                <AiOutlineCheckCircle color="green" />
                              </div>
                            </li>
                          </React.Fragment>
                        )}

                        {query.data?.____roomTypes____?.[0]?.wifi && (
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
                    ) : (
                      <React.Fragment />
                    )}
                  </div>
                </div>
                <h4>
                  {
                    query.data?.____roomTypes____?.[0]
                      ?.other_facilities
                  }
                  Other Facilities :
                </h4>
                <h4 className="my-4">Owner Infomation:</h4>
                <ul
                  role="list"
                  className="list-disc space-y-2 pl-4 text-sm"
                >
                  <li className="text-gray-400">
                    <div className="text-gray-600 flex justify-start items-center gap-2">
                      <p>Email :</p>
                      <p>{query.data?.__hotel__?.__user__?.email}</p>
                    </div>
                  </li>
                  <li className="text-gray-400">
                    <div className="text-gray-600 flex justify-start items-center gap-2">
                      <p>Full Name :</p>
                      <p>
                        {query.data?.__hotel__?.__user__?.last_name}{' '}
                        {query.data?.__hotel__?.__user__?.first_name}
                      </p>
                    </div>
                  </li>
                  <li className="text-gray-400">
                    <div className="text-gray-600 flex justify-start items-center gap-2">
                      <p>Phone Number :</p>
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
    </Layout>
  );
}

export default Page;
