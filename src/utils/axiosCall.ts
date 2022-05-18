import axios from 'axios';

type IAXios = {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: any;
}

const axiosCall = async ({url, method, data}: IAXios) => {
  const response = await axios({
    method,
    url,
    data,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export default axiosCall;