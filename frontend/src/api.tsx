import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

const axiosClient = axios.create({
  baseURL: 'https://lteam-wine-map-backend.fly.dev',
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }
});

axiosClient.defaults.headers['Content-Type'] = 'application/json';
axiosClient.defaults.headers.Accept = 'application/json';

axiosClient.defaults.timeout = 2000;

const getRequest = async (URL: string) => {
  return axiosClient
    .get(URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
    .then((response) => response);
};

const getRequestWithoutAuthorization = async (URL: string, config?: AxiosRequestConfig) => {
  return axiosClient.get(URL, config).then((response) => response);
};

const postRequest = async (URL: string, payload: Object) => {
  return axiosClient
    .post(URL, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
    .then((response) => response);
};

const postRequestWithoutAthorization = async (URL: string, payload: Object) => {
  return axiosClient.post(URL, payload).then((response) => response);
};

const putRequest = async (URL: string, payload: Object) => {
  return axiosClient
    .put(URL, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
    .then((response) => response);
};

const patchRequest = async (URL: string, payload: Object) => {
  return axiosClient
    .patch(URL, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
    .then((response) => response);
};

const deleteRequest = async (URL: string) => {
  return axiosClient
    .delete(URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
    .then((response) => response);
};

export {
  getRequest,
  getRequestWithoutAuthorization,
  postRequest,
  postRequestWithoutAthorization,
  putRequest,
  patchRequest,
  deleteRequest,
};
