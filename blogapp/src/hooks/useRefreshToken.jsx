import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () =>{

    const {setAuth} = useAuth();

    const refresh = async() => {
        try{
            const response = await axios.get('/auth/refresh', 
                {
                    withCredentials:true
                }
            );

            setAuth(prev =>{ 
            return {...prev, accessToken: response.data.token}
        });
        
            return response.data.token;
        }
        catch(error){
            console.log(error);
            return null;
        }

    }

    return refresh;
};

export default useRefreshToken;
