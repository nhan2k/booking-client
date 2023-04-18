import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  PayPalScriptProvider,
  PayPalButtons,
} from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { updateTransaction } from '@/api/transaction';
import _ from 'lodash';

type Props = {
  value: {
    amount: string;
    transaction_id: number;
  };
  status: string;
};

function PaymentModal({ value, status }: Props) {
  const [open, setOpen] = React.useState(false);

  const cancelButtonRef = React.useRef(null);

  const mutation = useMutation({
    mutationKey: ['transaction'],
    mutationFn: updateTransaction,
  });

  return (
    <React.Fragment>
      {status === 'unpaid' ? (
        <button
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setOpen(true)}
        >
          Make as Payment
        </button>
      ) : (
        <button
          className={`block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
          disabled
        >
          {_.capitalize(status)}
        </button>
      )}
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
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 w-full sm:ml-4 sm:mt-0 sm:text-left">
                        <PayPalScriptProvider
                          options={{
                            'client-id':
                              process.env.NEXT_PUBLIC_PAYPAL_ID ||
                              'ATeK9-Yby0qFnEOv6LGZnz-47g7p7yPtYX-SqY3O2cus6ivTcFU2viiTVlJCen9gFDYsqRbvqE9Rbcbe',
                          }}
                        >
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: value.amount,
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={(data, actions: any) => {
                              return actions.order
                                .capture()
                                .then((details: any) => {
                                  mutation.mutate({
                                    transaction_id:
                                      value.transaction_id,
                                    capture_id: details.id,
                                  });
                                  const name =
                                    details.payer.name.given_name;
                                  toast.success(
                                    `Transaction completed by ${name}`
                                  );
                                  setOpen(false);
                                });
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
}

export default PaymentModal;
