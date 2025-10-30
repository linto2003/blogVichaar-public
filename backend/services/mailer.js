require('dotenv').config({ path: '../.env' });

const nodemailer = require('nodemailer');

async function emailSender(to, text) {
    try {
        if (!process.env.MAIL || !process.env.APPPASS) {
            throw new Error('Email configuration is missing. Please check MAIL and APPPASS environment variables.');
        }
        else{
            console.log('Email configuration found.');
        }
        
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
            from: process.env.MAIL,
            to: to,
            subject: 'OTP Verification',
            text: `Your OTP is: ${text}`,
            html: `<p>Your OTP is: <strong>${text}</strong></p>`,
        };

        // Verify SMTP connection configuration
        await transporter.verify();

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info.response;
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw error; // Re-throw to handle it in the calling function
    }

}


module.exports = emailSender;