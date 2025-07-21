import { useState, useEffect, useRef } from "react";
import '../css/Register.css';
import InputField from "../components/HelperComponent"; 
import axios from '../api/axios'; 
import useAuth from '../hooks/useAuth';
import {useNavigate,useLocation,Link} from 'react-router-dom'

const Login =() =>{
    const {setAuth,persist,setPersist} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    
    useEffect(() => emailRef.current.focus(), []);
    useEffect(() => setErrMsg(''), [email, pwd]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
        const response = await axios.post('/auth/login', {
        email,
        password:pwd
        });

        const accessToken = response?.data?.token;

        setAuth({email,pwd,accessToken});

        
        navigate(from , {replace: true});
    } catch (error) {
         if (error.response && error.response.data && error.response.data.error) {
            console.log(error.response)
            if(error.response==null){
                setErrMsg("Login Failed"); 
            }
            else{
                setErrMsg( error.response.data.error);
            }
            
        } else {
            console.log(error)
            setErrMsg("Something went wrong. Please try again.");
        }
        
        errRef.current.focus();
    }
    };
   

    const togglePersist = () =>{
     
        setPersist(prev=>!prev);
        
    }

    useEffect(()=>{
        localStorage.setItem('persist',persist)
       
    },[persist]) 


    return (
        
            <section className="register-container">
            <p ref={errRef} className={`errmsg ${errMsg ? 'visible' : 'hidden'}`} aria-live="assertive">
                {errMsg}
            </p>
            <h1>Login</h1>
            <form className="form-group">

                {/* Email */}
                <InputField
                id="email"
                label="Email"
                value={email}
                setValue={setEmail}
                
                isValid={true}
                setFocus={setEmailFocus}
                focus={emailFocus}
                icon={true}
                 inputRef={emailRef}
                instruction="Must be a valid email."
                />

                {/* Password */}
                <InputField
                id="password"
                label="Password"
                type="password"
                value={pwd}
                setValue={setPwd}
                isValid={true}
                setFocus={setPwdFocus}
                focus={pwdFocus}
                icon={true}
                instruction=""
                />
                

                <div className="persist-container">
                   <input
                     type="checkbox"
                     id="persist"
                     onChange={togglePersist}
                     checked={persist}
                   />
                    <label style={{ marginLeft: '8px' }} htmlFor='persist'>Remember Me</label>
                </div>

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    >
                    Sign In
                </button>

                 <p className="signup-prompt">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
                
            </form>
            </section>
        );
    
    };

export default Login;