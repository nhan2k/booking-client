import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

const withAuthentication = <T extends object>(
  WrappedComponent: React.ComponentType<T>
) => {
  const logout = async () => await signOut();
  const HOC = (props: T) => {
    useEffect(() => {
      const token = sessionStorage.getItem('access-token');

      if (!token) {
        logout().then((res) => res);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default withAuthentication;
