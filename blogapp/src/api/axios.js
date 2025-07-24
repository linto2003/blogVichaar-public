import axios from 'axios';
//const BASE_URL='https://blogvichaar-public.onrender.com/';
const BASE_URL = 'http://localhost:3000/';
export default axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL, 
  headers: {'Content-Type':'application/json'},
  withCredentials: true, 
});


