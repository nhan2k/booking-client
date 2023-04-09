import axios from 'axios';

const axiosInterceptor = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

// Adding Authorization header for all requests

axiosInterceptor.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access-token');
    if (token) {
      // Configure this as per your backend requirements
      config.headers!['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptor.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/auth/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await axios.post(
            `${process.env.ENDPOINT}/auth/refresh`,
            {
              headers: {
                Authorization:
                  'Bearer ' +
                  sessionStorage.getItem('refresh-token')!,
              },
            }
          );

          const access = rs.data.access_token;
          const refresh = rs.data.refresh_token;

          sessionStorage.setItem('access-token', access);
          sessionStorage.setItem('refresh-token', refresh);

          return axiosInterceptor(originalConfig);
        } catch (_error) {
          console.error('Session time out. Please login again.', {
            id: 'sessionTimeOut',
          });
          // Logging out the user by removing all the tokens from local
          sessionStorage.removeItem('access-token');
          sessionStorage.removeItem('refresh-token');
          // Redirecting the user to the landing page
          window.location.href = window.location.origin;
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export { axiosInterceptor };
