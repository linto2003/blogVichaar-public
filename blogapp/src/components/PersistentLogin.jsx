import { Outlet } from 'react-router-dom';
import useRefreshToken from '../hooks/useRefreshToken';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const PersistentLogin = () => {
  const [isLoading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth,persist } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log("Refreshing token");
        await refresh();
      } catch (err) {
        console.error("Token refresh failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth?.accessToken) {
      
      verifyToken();
    } else {
      
      setLoading(false);
    }
  }, [auth]); 


  useEffect(()=>{
    console.log(isLoading);
  },[isLoading])

  return (
    <>
      {
        !persist
        ?<Outlet/>
          :isLoading 
            ? <p>Loading.......</p> 
            : <Outlet />
          }
    </>
  );
};

export default PersistentLogin;
