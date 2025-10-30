require('dotenv').config({ path: '../.env' });
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function emailSender(to, text) {
  try {
    if (!process.env.MAIL || !process.env.APPPASS) {
      throw new Error('Email configuration missing. Check MAIL and APPPASS in your .env');
    }


    resend.emails.send({
        from: `${process.env.MAIL}`,
        to: to,
        subject: 'OTP Verification',
        html: `<p>Your OTP is: <strong>${text}</strong></p>`,
    });
    console.log('✅ Email sent via Resend');

    }

    catch (error) {
            console.error('Email sending failed:', error.message);
            throw error;
        }
}

module.exports = emailSender;



//     // ✅ Use Gmail service with connection pool (faster, no manual verify)
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.MAIL,
//         pass: process.env.APPPASS
//       },
//       pool: true,             // Reuse connections
//       maxConnections: 5,
//       maxMessages: 50,
//       rateLimit: 5,
//     });

//     const mailOptions = {
//       from: `${process.env.MAIL}`,
//       to,
//       subject: 'OTP Verification',
//       text: `Your OTP is: ${text}`,
//       html: `<p>Your OTP is: <strong>${text}</strong></p>`,
//       headers: {
//         'x-priority': '1',
//         'x-msmail-priority': 'High',
//         importance: 'high',
//       },
//     };

//     // ✅ Send with retry logic (3 attempts)
//     let retries = 3;
//     let lastError;

//     while (retries > 0) {
//       try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('✅ Email sent successfully:', info.response);
//         return info.response;
//       } catch (error) {
//         lastError = error;
//         console.error(`❌ Email sending failed, retries left: ${retries - 1}`, error.message);
//         retries--;
//         if (retries > 0) {
//           await new Promise(resolve => setTimeout(resolve, 2000)); // wait before retry
//         }
//       }
//     }

//     throw lastError;
//   } catch (error) {
//     console.error('Email sending failed:', error.message);
//     throw error;
//   }
