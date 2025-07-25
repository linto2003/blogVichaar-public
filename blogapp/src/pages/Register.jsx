import { useState, useEffect, useRef } from "react";
import '../css/Register.css';
import InputField from "../components/HelperComponent"; 
import axios from '../api/axios'; 
import {useNavigate,useLocation,Link} from 'react-router-dom'


const USERREGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWDREGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;
const EMAILREGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const AUTHOR_STATIC ='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUW0u5Eiiy3oM6wcpeEE6sXCzlh8G-tX1_Iw&s';
const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const fileInputRef = useRef();
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

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

  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => userRef.current.focus(), []);

  useEffect(() => setValidName(USERREGEX.test(user)), [user]);
  useEffect(() => setValidEmail(EMAILREGEX.test(email)), [email]);
  useEffect(() => {
    setValidPwd(PASSWDREGEX.test(pwd));
    setValidMPwd(pwd === mpwd);
  }, [pwd, mpwd]);
  useEffect(() => {
    setValidOtp(otp.length === 6 && /^\d{6}$/.test(otp));
  }, [otp]);

  useEffect(() => setErrMsg(''), [user, email, pwd, mpwd, otp]);

  const handleSendOtp = async(e) => {
    e.preventDefault();
    if (!validName || !validEmail || !validPwd || !validMPwd) {
      setErrMsg("Please fill all fields correctly before sending OTP.");
      return;
    }
    

     try {
    const formData = new FormData();
    formData.append('name', user);
    formData.append('email', email);
    formData.append('password', pwd);
    formData.append('image', image); // if you have image upload

    const response = await axios.post('/auth/request-otp', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setOtpSent(true);
    alert("OTP sent to your email");
  } catch (error) {
     if (error.response && error.response.data && error.response.data.error) {
    setErrMsg(error.response.data.error); 
        } else {
            setErrMsg("Something went wrong. Please try again.");
        }
        errRef.current.focus();
        }
  };


    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validOtp) {
      setErrMsg("Invalid or missing OTP.");
      return;
    }
    
     try {
    const response = await axios.post('/auth/verify-otp', {
      email,
      otp,
    });
    
    navigate(from , {replace: true});
  } catch (error) {
    console.error("OTP verification failed:", error.response.data.error);
    setErrMsg(error.response.data.error);
  }
  };

  const handlePreviewClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      
        <section className="register-container">
          <p ref={errRef} className={`errmsg ${errMsg ? 'visible' : 'hidden'}`} aria-live="assertive">
            {errMsg}
          </p>
          <h1>Register</h1>
          <label htmlFor="image">Profile Image - only png, jpg, jpeg allowed</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            <div className="preview" onClick={handlePreviewClick} style={{ cursor: "pointer" }}>
              <img
                src={image ? URL.createObjectURL(image) : AUTHOR_STATIC}
                alt="Preview"
              />
            </div>
            <br />
          <form className="form-group">

            {/* Username */}
            <InputField
              id="username"
              label="Username"
              value={user}
              setValue={setUser}
              isValid={validName}
              setFocus={setUserFocus}
              focus={userFocus}
              inputRef={userRef}
              icon={true}
              instruction="3–20 characters, letters, numbers, and _ allowed."
            />

            {/* Email */}
            <InputField
              id="email"
              label="Email"
              value={email}
              setValue={setEmail}
              isValid={validEmail}
              setFocus={setEmailFocus}
              focus={emailFocus}
              icon={true}
              instruction="Must be a valid email."
            />

            {/* Password */}
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

            {/* Confirm Password */}
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

            {/* Send OTP */}
            <button className="submit-btn" onClick={handleSendOtp}
              disabled={!validName || !validEmail || !validPwd || !validMPwd}>
              Send OTP
            </button>

            {/* OTP Field */}
            {otpSent && (
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
            )}

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!otpSent || !validOtp}
            >
              Sign Up
            </button>
          </form>
        </section>
    </>
  );
};

export default Register;
