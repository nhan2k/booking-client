import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Layout from '@/components/layout';
import { useRouter } from 'next/router';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getProfile } from '@/api/auth';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { updateProfile } from '@/api/user';
import SpinnerBasic from '@/components/spinner-basic';
import Spinner from '@/components/spinner';
import { useImgPathStore } from '@/zustand';

type Props = {};
type Inputs = {
  first_name: string;
  imgPath: string;
  last_name: string;
  location: string;
  phone_number: string;
  file: FileList;
};
function Page({}: Props) {
  const queryClient = useQueryClient();
  const { back } = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleOpenChoose = () => inputRef.current?.click();
  const setImgPath = useImgPathStore(
    (state: any) => state.setImgPath
  );

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const mutation = useMutation({
    mutationKey: ['profile'],
    mutationFn: updateProfile,
    async onSuccess(data, variables, context) {
      setImgPath(data?.imgPath);
      await queryClient.invalidateQueries(['profile']);
      toast.success('Update successful!');
    },
    async onError(error, variables, context) {
      toast.error('Update failed!');
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: query.isLoading ? {} : query.data,
  });

  const [file, setFile] = React.useState<any>(null);
  const onSubmit: SubmitHandler<Inputs> = (value) => {
    value.file = file;
    mutation.mutate(value);
  };

  return (
    <Layout>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <form
          className="lg:max-w-6xl mx-auto mt-20 border px-14 py-20 rounded-3xl shadow bg-gray-50"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be displayed publicly so be
                careful what you share.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="Email"
                        value={query.data?.email}
                        name="email"
                        id="email"
                        autoComplete="email"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Avatar
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    {query.data?.imgPath ? (
                      <div className="h-12 w-12">
                        <img
                          src={`${process.env.NEXT_PUBLIC_ENDPOINT}/${query.data?.imgPath}`}
                          alt="avatar"
                          className="h-full w-full rounded-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <UserCircleIcon
                        className="h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    )}

                    <input
                      type="file"
                      {...register('file')}
                      onChange={(e) => setFile(e.target.files)}
                      className="hidden"
                      ref={inputRef}
                      required
                    />
                    <button
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={handleOpenChoose}
                      type="button"
                    >
                      Change
                    </button>
                  </div>
                  {errors.file && (
                    <p className="text-red-500">Choose File Error</p>
                  )}
                </div>
              </div>
            </div>
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Use a permanent address where you can receive mail.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register('first_name', {
                        value: query.data?.first_name,
                      })}
                      defaultValue={query.data?.first_name}
                      id="first-name"
                      autoComplete="given-name"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register('last_name', {
                        value: query.data?.last_name,
                      })}
                      defaultValue={query.data?.last_name}
                      id="last-name"
                      autoComplete="family-name"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register('phone_number', {
                        value: query.data?.phone_number,
                      })}
                      defaultValue={query.data?.phone_number}
                      id="phone_number"
                      autoComplete="family-name"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
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
                      {...register('location', {
                        value: query.data?.phone_number,
                      })}
                      defaultValue={query.data?.location}
                      id="location"
                      autoComplete="location"
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => back()}
            >
              Cancel
            </button>
            {mutation.isLoading ? (
              <SpinnerBasic />
            ) : (
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            )}
          </div>
        </form>
      )}
    </Layout>
  );
}

export default Page;
