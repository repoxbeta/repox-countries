import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const API_BASE_URL = process.env.API_BASE_URL || 'http://api.geonames.org';
// const USER_NAME = process.env.USER_NAME || '__username__';

const retriableErrors = ['ECONNRESET', 'ETIMEDOUT'];
const maxRetries = 3;

const agentOptions = {
  keepAlive: true,
  maxSockets: 10,
};

const httpAgent = new http.Agent(agentOptions);
const httpsAgent = new https.Agent(agentOptions);

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  httpAgent,
  httpsAgent,
});

// Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     config.params = {
//       ...config.params,
//       username: USER_NAME,
//     };
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    const { config } = error;
    const retryCount = config?.__retryCount || 0;
    console.log('API Error:', error.code, error.message);

    if (retriableErrors.includes(error.code) && retryCount < maxRetries) {
      config.__retryCount = retryCount + 1;

      console.log(`Retrying request... (${retryCount}/${maxRetries})`);
      await new Promise((res) => setTimeout(res, 2000 * retryCount));

      return api(config);
    }

    return Promise.reject(error);
  },
);

// Reusable GET request
export const get = async <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.get(url, { params, ...config });
};

// Reusable POST request
export const post = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.post(url, data, { ...config });
};

export default api;
