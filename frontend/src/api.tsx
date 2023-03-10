import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

axiosClient.defaults.headers['Content-Type'] = 'application/json';
axiosClient.defaults.headers.Accept = 'application/json';
axios.defaults.headers.post['Authorization'] = `Bearer ${localStorage.getItem(
  'access_token'
)}`;

axiosClient.defaults.timeout = 2000;

axiosClient.defaults.withCredentials = true;

const getRequest = async (URL: string) => {
  return axiosClient.get(`/${URL}`).then((response) => response);
};

const postRequest = async (URL: string, payload: Object) => {
  return axiosClient.post(URL, payload).then((response) => response);
};

const patchRequest = async (URL: string, payload: Object) => {
  return axiosClient.patch(`/${URL}`, payload).then((response) => response);
};

const deleteRequest = async (URL: string) => {
  return axiosClient.delete(`/${URL}`).then((response) => response);
};

export { getRequest, postRequest, patchRequest, deleteRequest };
