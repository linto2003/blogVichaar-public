/*  Registeration with OTP 
    Reset Password with JWT Authentication
    Login with JWT Authentication
    Forgot Password with OTP
*/

const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const sendMail = require('../services/mailer');
const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');
const { jwtAuth, generateAccessToken,generateRefreshToken } = require('../services/jwt');
const uploadImage = require('../services/cloudUpload');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Too many OTP requests, try again later.',
  validate: {xForwardedForHeader: false} 
});

dotenv.config();

const otpMap = new Map(); 

router.post('/request-otp',otpLimiter,uploadImage.single('image'), async (req, res) => {
    const { name, email, password } = req.body;
    const imageUrl = req.file ? req.file.path :process.env.AUTHOR_STATIC;
    
    const existingUser = await userModel.findOne({
    $or: [
        { email },
        { username: name }
    ]
    });
    if (existingUser) {
    if (existingUser.email === email && existingUser.username === name) {
        return res.status(409).json({ error: 'Email and username already registered' });
    } else if (existingUser.email === email) {
        return res.status(409).json({ error: 'Email already registered' });
    } else {
        return res.status(409).json({ error: 'Username already taken' });
    }
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpMap.set(email, { name, email, password,imageUrl, otp, expiresAt: Date.now() + 5 * 600000 });

    let response = sendMail(email,otp);

    console.log("Response from mailer:", response); 
    console.log("OTP", otp);
      

    if (response instanceof Error) {
            return res.status(500).json({ error: 'Email is Wrong!!' });
        }
        res.status(200).json({ message: 'OTP sent successfully' });

});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const record = otpMap.get(email);

  const ua = req.useragent;

  const deviceInfo = {
    browser: ua.browser,
    version: ua.version,
    os: ua.os,
    platform: ua.platform,
    source: ua.source
  }

  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  else{
    try {
        const newUser = new userModel({ username: record.name, email, password: record.password , avatarUrl:record.imageUrl});
        const payload = {
                    id: newUser._id,
                    username: newUser.username,
                };
        
        const refreshToken = generateRefreshToken(payload);
        const accessToken = generateAccessToken(payload);
        await tokenModel.deleteMany({ userId: newUser._id, 'deviceInfo.source': ua.source });
        await tokenModel.create({ userId: newUser._id, 
            token: refreshToken,
            deviceInfo:deviceInfo ,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
               
        await newUser.save();
        otpMap.delete(email);


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 
            });

        res.json({ message: "User created successfully",
            token: accessToken, 
         });

        }
        catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Internal server error' });
        }
  }
});

// Login a user->generate a token send the token
router.post('/login', async (req, res) => {
    const {email, password } = req.body;
    
    try {
        const user = await userModel.findOne({ email: email.trim() });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const ua = req.useragent;

        const deviceInfo = {
            browser: ua.browser,
            version: ua.version,
            os: ua.os,
            platform: ua.platform,
            source: ua.source
        }

        if(await user.comparePassword(password)) {
            const payload = {
                id: user._id,
                username: user.email,
            }
       
            const refreshToken = generateRefreshToken(payload);
            const accessToken = generateAccessToken(payload);
            await tokenModel.deleteMany({ userId: user._id, 'deviceInfo.source': ua.source });
            await tokenModel.create({ userId: user._id, 
                token: refreshToken,
                deviceInfo:deviceInfo ,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            user.lastLogin = Date.now();
            await user.save();


            res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            res.status(200).json({
                    message: 'Login successful',
                    token: accessToken,
                });
        } 
        
        else {
            res.status(401).json({ message: 'Invalid password' });
        } 

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error logging in', error });
    }
});
 
// Generates new refresh token if needed and gives away access tokens when expired
router.get('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'No refresh token found in cookies' });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async(err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const storedToken = await tokenModel.find({userId:user.id,token:token});
    if(!storedToken){
        console.log("No token found in DB");
        return res.status(403).json({message:'No token found in DB'})
    }
    
    const accessToken = generateAccessToken({ id: user.id, username: user.username });
    req.user = user;
    res.status(200).json({ token: accessToken });
  });
});

//Logout with clearing refresh token and accesstoken 
router.post('/logout',jwtAuth, async (req, res) => {
  try{
      await tokenModel.deleteMany({ userId: req.user.id });
      console.log("Token Deleted");
    }
    catch(error){
        console.log("Token not Deleted: ",error);

        return res.status(500).json({message:error});
    }
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });
    res.status(200).json({ message: 'Logged out' });
});

// Update user password
router.put('/update-pass', jwtAuth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        else{
            if (await user.comparePassword(oldPassword)) {
                user.password = newPassword;
                await user.save();
                res.status(200).json({ message: 'Password updated successfully' });
            } else {
                res.status(401).json({ message: 'Old password is incorrect' });
            }
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating password', error });
    }});
    
//Forgot password using OTP
router.post('/forgot-pass', otpLimiter,async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ 
        email: email
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpMap.set(email, { otp, expiresAt: Date.now() + 5 * 600000 });
    let response = sendMail(email, otp);
    
    if (response instanceof Error) {
        return res.status(500).json({ error: 'Email is Wrong!!' });
    }
    res.status(200).json({ message: 'OTP sent successfully', otp });

});

//Reset password using OTP verification
router.post('/reset-pass', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const record = otpMap.get(email);
    if (!record || record.otp !== otp || record.expiresAt < Date.now())
    {
        return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    else{
        
        try {
            const user = await userModel.findOne({
                email: email
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.password = newPassword;
            await user.save();
            otpMap.delete(email);
            res.status(200).json({ message: 'Password reset successfully' });
        } 
        
        catch (error) {
            res.status(400).json({ message: 'Error resetting password', error });
        }

    }

});

// Get user profile for user verification using JWT
router.get('/me', jwtAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password'); // exclude password
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
    

