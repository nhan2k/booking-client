import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

const withRoleHotelier = <T extends object>(
  WrappedComponent: React.ComponentType<T>
) => {
  const logout = async () => await signOut();
  const HOC = (props: T) => {
    useEffect(() => {
      const role = sessionStorage.getItem('role');

      if (role !== 'hotelier') {
        logout().then((res) => res);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

const withRoleUser = <T extends object>(
  WrappedComponent: React.ComponentType<T>
) => {
  const logout = async () => await signOut();
  const HOC = (props: T) => {
    useEffect(() => {
      const role = sessionStorage.getItem('role');

      if (role !== 'user') {
        logout().then((res) => res);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export { withRoleHotelier, withRoleUser };
