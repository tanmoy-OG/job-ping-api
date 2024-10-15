import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (user, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Account Verification',
      html: `
        <h1>Email Verification</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${process.env.CLIENT_URL}/verify/${token}">Verify Email</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', user.email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};


export const sendJobNotification = async (candidates, jobDetails) => {
  // ... (send job updates to candidates using nodemailer)
};