import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { getAuthTokens, removeAuthTokens, setAuthTokens } from 'src/utils/helpers/authHelper';
import { refreshTokenRequest } from 'src/api/auth/refresh-token';
import {AxiosRequestHeaders} from "axios";

const apiInstance = axios.create({
  baseURL: ''
});

const retryInstance = axios.create({
  baseURL: ''
});

retryInstance.interceptors.request.use(config => {
  // url is /api/api/etc..
  if (!config.headers) config.headers = {} as AxiosRequestHeaders;

  config.headers['Authorization'] = `Bearer ${getAuthTokens().access_token}`;

  return Promise.resolve(config);
});

const failedRequest = (failReq: any) => {
  const refreshToken = getAuthTokens().refresh_token;

  if (refreshToken)
    return refreshTokenRequest(refreshToken)
      .then(({ access_token, refresh_token }) => {
        setAuthTokens({ access_token, refresh_token });
      })
      .then(() => {
        const access_token = getAuthTokens().access_token;
        if (access_token) {
          apiInstance.defaults.headers['Authorization'] = `Bearer ${access_token}`;

          failReq.response.config.headers['Authorization'] = `Bearer ${access_token}`;

          return Promise.resolve();
        }

        return Promise.reject();
      })
      .catch(() => {
        removeAuthTokens();
        Promise.reject(failReq);
        window.location.href = '';
        // this.appHistory && this.appHistory.push(AUTH);
      });
  else {
    return Promise.reject(failReq);
  }
};

createAuthRefreshInterceptor(apiInstance, failedRequest, {
  statusCodes: [401, 403],
  retryInstance
});

const isTokenRequest = (requestUrl?: string) => {
  if (!requestUrl) {
    return true;
  }
  const nonJwtUrls = ['/auth/login', '/auth/registration', '/auth/refresh-token'];

  return !nonJwtUrls.find(url => url === requestUrl);
};

apiInstance.interceptors.request.use(
  config => {
    const originalRequest = config;
    const { access_token } = getAuthTokens();

    if (access_token && isTokenRequest(originalRequest.url)) {
      if (!originalRequest.headers) originalRequest.headers = {} as AxiosRequestHeaders;

      originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
    }

    return Promise.resolve(originalRequest);
  },
  err => Promise.reject(err)
);

export default apiInstance;
