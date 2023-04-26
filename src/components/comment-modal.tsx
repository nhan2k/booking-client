import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Rating from './rating';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { postReview } from '@/api/review';
import { toast } from 'react-toastify';

type Inputs = {
  description: string;
};
type Props = {
  room_id: number;
  reservation_id: number;
};

function Component({ room_id, reservation_id }: Props) {
  const [open, setOpen] = React.useState(false);

  const cancelButtonRef = React.useRef(null);
  const [currentRating, setCurrentRating] = React.useState(0);

  const handleRatingClick = (index: number) => {
    setCurrentRating(index + 1);
  };

  const mutation = useMutation({
    mutationKey: ['review'],
    mutationFn: postReview,
    async onSuccess(data, variables, context) {
      toast.success('Review Successfully');
      setOpen(false);
    },
    async onError(data, variables, context) {
      toast.error('Review Failed');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      description: data.description,
      rating: currentRating,
      room_type_id: room_id,
      reservation_id,
    });
  };
  return (
    <React.Fragment>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => setOpen(true)}
      >
        Write a review
      </button>
      <Transition.Root show={open} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-semibold leading-6 text-gray-900"
                        >
                          Write a review
                        </Dialog.Title>
                        <div className="my-3 w-full">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900 mb-1"
                          >
                            Rating
                          </Dialog.Title>
                          <Rating
                            currentRating={currentRating}
                            handleRatingClick={handleRatingClick}
                          />
                        </div>
                        <div className="mt-2 w-full">
                          <label className="block mb-2">
                            Description
                          </label>
                          <textarea
                            className="border w-full rounded-lg min-h-[calc(8rem)] p-2"
                            {...register('description')}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      >
                        Submit
                      </button>
                      <button
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
}

export default Component;
