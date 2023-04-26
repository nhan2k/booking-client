import React from 'react';
import { VscSignIn } from 'react-icons/vsc';
import { AiOutlineLogin } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Logo from '@/assets/images/logo.jpeg';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import avatarPlaceholder from '@/assets/images/avatar_placeholder.png';
import { useImgPathStore } from '@/zustand';

type Props = {
  session: any;
  status: any;
};
const navigation = [
  { name: 'Hotels List', href: '/hotel/list', role: 'hotelier' },
  {
    name: 'Rooms List',
    href: `/room/list?pageSize=10&pageNumber=1`,
    isPublic: true,
    role: 'user',
  },
  {
    name: 'For Hotelier',
    href: '/register?role=hotelier',
    isPublic: true,
  },
  {
    name: 'Reservation',
    href: '/reservation?pageSize=10&pageNumber=1',
    role: 'user',
  },
];
function Navbar({ session, status }: Props) {
  const { push } = useRouter();
  const imgPath = useImgPathStore((state: any) => state.imgPath);

  const handleNavigate = async (href: string) => {
    await push(href);
  };

  const userNavigation = [
    {
      name: 'Your Profile',
      onClick: async () => await push('/profile'),
    },
    { name: 'Sign out', onClick: async () => await signOut() },
  ];

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1 lg:justify-start">
            <Link
              href="/"
              className="-m-1.5 p-1.5 w-[calc(4rem)] h-[calc(4rem)]"
            >
              <span className="sr-only">Your Company</span>
              <Image className="h-full w-full" src={Logo} alt="" />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <HiBars3 className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <button
              onClick={async () => await handleNavigate('/')}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Home
            </button>
            {navigation.map((item) => {
              if (status === 'authenticated') {
                if (session?.user?.role === item.role) {
                  return (
                    <button
                      onClick={async () =>
                        await handleNavigate(item.href)
                      }
                      key={item.name}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      {item.name}
                    </button>
                  );
                }
              }
              if (item.isPublic && status !== 'authenticated') {
                return (
                  <button
                    onClick={async () =>
                      await handleNavigate(item.href)
                    }
                    key={item.name}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {item.name}
                  </button>
                );
              }
            })}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {status === 'authenticated' ? (
              <div className="flex gap-2">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="h-10 w-10 flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      {session?.user?.imgPath ? (
                        <img
                          className="h-full w-full rounded-full object-cover object-center"
                          src={`${process.env.NEXT_PUBLIC_ENDPOINT}/${imgPath}`}
                          alt={`${process.env.NEXT_PUBLIC_ENDPOINT}/${imgPath}`}
                        />
                      ) : (
                        <img
                          className="h-full w-full rounded-full object-cover object-center"
                          src={avatarPlaceholder.src}
                          alt={`Avatar placeholder`}
                        />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => {
                        return (
                          <Menu.Item key={item.name}>
                            <p
                              onClick={item.onClick}
                              className={
                                'hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                              }
                            >
                              {item.name}
                            </p>
                          </Menu.Item>
                        );
                      })}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <AiOutlineLogin />

                <p
                  className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
                  onClick={() => signIn()}
                >
                  Login
                </p>
                <VscSignIn />
                <Link href={'/register'}>
                  <p className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                    Register
                  </p>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
