require('dotenv').config({ path: '../.env' });

const nodemailer = require('nodemailer');

async function emailSender(to, text) {
    try {
        if (!process.env.MAIL || !process.env.APPPASS) {
            throw new Error('Email configuration is missing. Please check MAIL and APPPASS environment variables.');
        }
        
        // Create transporter with more robust configuration
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
            headers: {
                'x-priority': '1',
                'x-msmail-priority': 'High',
                importance: 'high'
            }
        };

        // Test the connection first with a longer timeout
        try {
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('SMTP verification timeout'));
                }, 20000);

                transporter.verify((error) => {
                    clearTimeout(timeout);
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
            console.log('SMTP connection verified successfully');
        } catch (verifyError) {
            console.error('SMTP Verification failed:', verifyError);
            throw verifyError;
        }

        // Send the email with retry logic
        let retries = 3;
        let lastError;

        while (retries > 0) {
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent successfully:', info.response);
                return info.response;
            } catch (error) {
                lastError = error;
                console.error(`Email sending failed, retries left: ${retries-1}`, error);
                retries--;
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                }
            }
        }

        throw lastError; // If all retries failed, throw the last error
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw error; // Re-throw to handle it in the calling function
    }

}


module.exports = emailSender;