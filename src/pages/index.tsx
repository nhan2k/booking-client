import React from 'react';
import Layout from '@/components/layout';
import Link from 'next/link';
import Select from 'react-select';
import Datepicker from 'react-tailwindcss-datepicker';
import { DateRangeType } from 'react-tailwindcss-datepicker/dist/types';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { optionProvince } from '@/constants/option-province';
import { useRouter } from 'next/router';

type Inputs = {
  province: string;
  dateRange: DateRangeType;
  traveller: number;
};

function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const startDate =
      (data.dateRange?.startDate &&
        data.dateRange?.startDate.toString()) ||
      '';
    const endDate =
      (data.dateRange?.endDate &&
        data.dateRange?.endDate.toString()) ||
      '';
    const traveller = data.traveller.toString() || '';

    await router.push({
      pathname: `/room/list`,
      query: {
        province: data.province,
        startDate: startDate,
        endDate: endDate,
        traveller: traveller,
      },
    });
  };

  return (
    <Layout>
      <div className="bg-white">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <svg
              className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
            >
              <path
                fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset={1} stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              List your property
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Reach the guests you want—those who truly value your
              property—with Expedia Group. Signing up is free, fast,
              and easy.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="hotel/post"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto max-w-7xl py-20">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-center font-semibold leading-7 text-gray-900 text-5xl">
                      Where to?
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-12">
                      <div className="sm:col-span-5 sm:col-start-1">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Going to
                        </label>
                        <div className="mt-2">
                          <Controller
                            name="province"
                            control={control}
                            render={({
                              field: { onChange, value },
                            }) => (
                              <Select
                                options={optionProvince}
                                placeholder="Where ?"
                                onChange={(val) =>
                                  val && onChange(val.value)
                                }
                              />
                            )}
                            rules={{ required: true }}
                          />
                          {errors.province && (
                            <span className="text-red-600">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="region"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Date
                        </label>
                        <div className="mt-1 border rounded-md">
                          <Controller
                            name="dateRange"
                            control={control}
                            render={({
                              field: { onChange, value },
                            }) => (
                              <Datepicker
                                value={value}
                                onChange={(val) =>
                                  val && onChange(val)
                                }
                                minDate={new Date()}
                              />
                            )}
                            rules={{ required: true }}
                          />
                          {errors.dateRange && (
                            <span className="text-red-600">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="guest_list"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Travellers
                        </label>
                        <div className="mt-2">
                          <input
                            {...register('traveller')}
                            min={1}
                            defaultValue={1}
                            id="guest_list"
                            autoComplete="guest_list"
                            className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.traveller && (
                            <span className="text-red-600">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <div className="mt-8 flex items-center justify-start gap-x-6">
                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <svg
              className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
            >
              <path
                fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset={1} stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Page;
