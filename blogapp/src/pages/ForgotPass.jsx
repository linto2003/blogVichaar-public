import { useState, useEffect, useRef } from "react";
import '../css/Register.css';
import InputField from "../components/HelperComponent"; 
import axios from '../api/axios'; 
import {useNavigate,useLocation,Link} from 'react-router-dom'


const USERREGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWDREGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;
const EMAILREGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPass = () => {
  const emailRef = useRef();
  const errRef = useRef();

  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [mpwd, setMPwd] = useState('');
  const [validMPwd, setValidMPwd] = useState(false);
  const [mpwdFocus, setMPwdFocus] = useState(false);

  const [otp, setOtp] = useState('');
  const [validOtp, setValidOtp] = useState(false);
  const [otpFocus, setOtpFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => emailRef.current.focus(),[]);

  useEffect(() => setValidEmail(EMAILREGEX.test(email)), [email]);

  useEffect(() => {
    setValidPwd(PASSWDREGEX.test(pwd));
    setValidMPwd(pwd === mpwd);
  }, [pwd, mpwd]);

  useEffect(() => {
    setValidOtp(otp.length === 6 && /^\d{6}$/.test(otp));
  }, [otp]);

  useEffect(() => setErrMsg(''), [email, pwd, mpwd, otp]);

  const handleSendOtp = async(e) => {
    e.preventDefault();
    if (!validEmail) {
      setErrMsg("Please fill all fields correctly before sending OTP.");
      return;
    }
    
    try {
      const response = await axios.post('/auth/forgot-pass', {
        email
      });
      alert("OTP sent to your email please check.");
      setOtpSent(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrMsg(error.response.data.error);
      } else {
        setErrMsg("Something went wrong. Please try again.");
      }
      errRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validOtp || !validPwd || !validMPwd) {
      setErrMsg("Invalid or missing OTP.");
      return;
    }
    
     try {
    const response = await axios.post('/auth/reset-pass', {
      email,
      otp,
      newPassword: pwd
    });

    alert("Password reset successful! Please log in with your new password.");
  } catch (error) {
    console.error("OTP verification failed:", error.response.data.error);
    setErrMsg(error.response.data.error);
  }
  };

  return (
    <>
      
        <section className="register-container">
          <p ref={errRef} className={`errmsg ${errMsg ? 'visible' : 'hidden'}`} aria-live="assertive">
            {errMsg}
          </p>
          <h1>Reset Password</h1>
          <form className="form-group">
           
            {/* Email */}
            <InputField
              id="email"
              label="Email"
              value={email}
              setValue={setEmail}
              isValid={validEmail}
              setFocus={setEmailFocus}
              focus={emailFocus}
              inputRef={emailRef}
              icon={true}
              instruction="Must be a valid email."
            />

            {/* Send OTP */}
            <button className="submit-btn" onClick={handleSendOtp}
              disabled={ !validEmail  }>
              Send OTP
            </button>

            {/* OTP Field */}
            {otpSent && (
            <>
            <InputField
                id="otp"
                label="Enter OTP"
                type="password"
                value={otp}
                setValue={setOtp}
                isValid={validOtp}
                setFocus={setOtpFocus}
                focus={otpFocus}
                icon={true}
                instruction="6-digit OTP from email."
            />
              
            <InputField
              id="password"
              label="Password"
              type="password"
              value={pwd}
              setValue={setPwd}
              isValid={validPwd}
              setFocus={setPwdFocus}
              focus={pwdFocus}
              icon={true}
              instruction="8–24 chars, upper, lower, number, special char."
            />

            <InputField
              id="confirm_pwd"
              label="Confirm Password"
              type="password"
              value={mpwd}
              setValue={setMPwd}
              isValid={validMPwd}
              setFocus={setMPwdFocus}
              focus={mpwdFocus}
              icon={true}
              instruction="Must match the password."
            />
            </>
            )
            }

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!otpSent || !validOtp |!validPwd || !validMPwd}
            >
              Reset Password
            </button>
                {/* Link to Login */}
              <Link to="/login">Go to Login</Link>
          </form>
        </section>
    </>
  );
};

export default ForgotPass;
