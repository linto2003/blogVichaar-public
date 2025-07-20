import useAuth from "./useAuth";
import { axiosPrivate } from "../api/axios";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    try {
      await axiosPrivate.post('/auth/logout');
      setAuth({});
    } catch (err) {
      console.error(err);
    }
  };

  return logout; 
};

export default useLogout;
