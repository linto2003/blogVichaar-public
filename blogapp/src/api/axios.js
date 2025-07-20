import axios from 'axios';
const BASE_URL='https://blogvichaar-public.onrender.com/';

export default axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL, 
  headers: {'Content-Type':'application/json'},
  withCredentials: true, 
});


