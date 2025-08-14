const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    // Check if email configuration is available
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email configuration not found. Skipping email send.');
      return false;
    }

    console.log('Attempting to send password reset email to:', email);
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Request - Nayak Enterprises',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Nayak Enterprises</h1>
            <p style="color: #666; margin: 10px 0 0 0;">B2B Wholesale Platform</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              You requested a password reset for your Nayak Enterprises account. 
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block; 
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            
            <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; 
                       word-break: break-all; color: #007bff; margin-bottom: 20px;">
              ${resetUrl}
            </p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; 
                        padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              If you didn't request this password reset, please ignore this email. 
              Your password will remain unchanged.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email from Nayak Enterprises. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    return false;
  }
};

// Send password reset success email
const sendPasswordResetSuccessEmail = async (email) => {
  try {
    // Check if email configuration is available
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email configuration not found. Skipping success email send.');
      return false;
    }

    console.log('Attempting to send password reset success email to:', email);
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Successful - Nayak Enterprises',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Nayak Enterprises</h1>
            <p style="color: #666; margin: 10px 0 0 0;">B2B Wholesale Platform</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Successful</h2>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; 
                        padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #155724; margin: 0; font-weight: bold;">
                ✓ Your password has been successfully reset
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Your Nayak Enterprises account password has been successfully updated. 
              You can now log in with your new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                 style="background-color: #28a745; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block; 
                        font-weight: bold;">
                Login to Your Account
              </a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; 
                        padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't reset your password, 
                please contact our support team immediately.
            </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email from Nayak Enterprises. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset success email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset success email:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
};
