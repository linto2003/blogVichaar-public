require('dotenv').config({ path: '../.env' });

const nodemailer = require('nodemailer');

function emailSender(to, text) {
        
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL, 
        pass: process.env.APPPASS        
    }
    });

    const mailOptions = {
    to: to,
    subject: 'OTP Verification',
    text: `Your OTP is: ${text}`,
    html: `<p>Your OTP is: <strong>${text}</strong></p>`,
    };


    transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        
        return error;
    } else {
        
        return info.response;
    }
    });

}


module.exports = emailSender;