import React from 'react';
import { VscSignIn } from 'react-icons/vsc';
import { AiOutlineLogin } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

type Props = {
  session: any;
  status: any;
};
const navigation = [
  { name: 'Hotels List', href: '/hotel/list' },
  { name: 'Rooms List', href: '/room/list' },
];
function Navbar({ session, status }: Props) {
  const { push } = useRouter();

  const handleNavigate = async (href: string) => {
    await push(href);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
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
          {navigation.map((item) => (
            <button
              onClick={async () => await handleNavigate(item.href)}
              key={item.name}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {status === 'authenticated' ? (
            <div className="flex gap-2">
              Hi
              <p className="font-bold text-gray-700 dark:text-gray-400">
                {` ${session?.user?.first_name ?? null} ${
                  session?.user?.last_name
                }`}
              </p>
              <p
                onClick={() => signOut()}
                className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
              >
                Logout
              </p>
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
  );
}

export default Navbar;