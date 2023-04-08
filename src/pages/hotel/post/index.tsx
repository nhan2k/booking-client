import Layout from '@/components/layout';
import { useSession } from 'next-auth/react';
import React from 'react';
import { signIn } from 'next-auth/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { optionProvince } from '@/constants/option-province';
import { useRouter } from 'next/router';
import {
  QueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { postHotel } from '@/api/hotel';
import { toast } from 'react-toastify';

type Inputs = {
  hotel_name: string;
  location: string;
  province: string;
  file: FileList;
};
type Props = {};
// Create a client
const queryClient = new QueryClient();
function Page({}: Props) {
  const { push } = useRouter();
  const { data: session, status } = useSession();

  // Queries
  const query = useQuery({
    queryKey: ['hotel'],
    queryFn: postHotel,
  });

  const mutation = useMutation({
    mutationFn: postHotel,
    onSuccess(data, variables, context) {
      toast.success('Post hotel success');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      push('/');
    },
    onError(error, variables, context) {
      toast.error(`${error}`);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  if (status === 'unauthenticated') {
    signIn();
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Layout>
      <div className="flex justify-center mt-20">
        {status === 'authenticated' ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Hotel
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly so be
                  careful what you share.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                  <div className="sm:col-span-12">
                    <label
                      htmlFor="hotel_name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Hotel Name
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          {...register('hotel_name')}
                          type="text"
                          id="hotel_name"
                          autoComplete="hotel_name"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          required={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-12">
                    <label
                      htmlFor="province"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Provinve / City
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <select
                          {...register('province')}
                          id="province"
                          autoComplete="province"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        >
                          {optionProvince.map((e, i) => (
                            <option key={i} value={e.value}>
                              {e.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Location
                    </label>
                    <div className="mt-2">
                      <textarea
                        {...register('location')}
                        id="location"
                        rows={3}
                        className="block pl-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                        required={true}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences about location.
                    </p>
                  </div>

                  <div className="col-span-full">
                    <input
                      type="file"
                      {...register('file', {
                        validate: {
                          accept: (value) =>
                            [
                              'image/png',
                              'image/jpeg',
                              'image/jpg',
                            ].includes(value[0].type),
                          maxSize: (value) =>
                            value[0].size <= 3000000,
                        },
                      })}
                    />
                    {errors.file && <p>{errors.file.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6 w-full">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 py-2 px-3 w-full text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <React.Fragment />
        )}
      </div>
    </Layout>
  );
}

export default Page;
