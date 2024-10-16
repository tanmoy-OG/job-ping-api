import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (user, token) => {
  try {

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
  try {
    const { title, description, experienceLevel, endDate } = jobDetails;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidates.join(', '), // Sending emails to all candidates
      subject: `New Job Opportunity: ${title}`,
      html: `
        <h2>New Job Posting: ${title}</h2>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Experience Level:</strong> ${experienceLevel}</p>
        <p><strong>Application Deadline:</strong> ${new Date(endDate).toLocaleDateString()}</p>
        <p>If you are interested, please reach out to the hiring company directly.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Job notification emails sent to candidates');
  } catch (error) {
    console.error('Error sending job notification emails:', error);
    throw new Error('Failed to send job notification emails');
  }
};