# Forgot Password Setup Guide

## Overview
The forgot password functionality has been implemented with the following features:
- Secure token-based password reset
- Email notifications (optional)
- 10-minute token expiration
- Frontend and backend integration

## Backend Setup

### 1. Environment Variables
Add the following variables to your `.env` file:

```env
# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional - for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Nayak Enterprises <your-email@gmail.com>
```

### 2. Email Setup (Optional)
If you want to send actual emails:

1. **For Gmail:**
   - Enable 2-factor authentication
   - Generate an App Password at: https://myaccount.google.com/apppasswords
   - Use the App Password as `SMTP_PASS`

2. **For other providers:**
   - Update `SMTP_HOST`, `SMTP_PORT`, and credentials accordingly

### 3. Database Changes
The User model has been updated with:
- `resetPasswordToken` field (hashed token)
- `resetPasswordExpire` field (expiration timestamp)

## API Endpoints

### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body:** `{ "email": "user@example.com" }`
- **Response:** Success message or error

### Reset Password
- **POST** `/api/auth/reset-password/:resetToken`
- **Body:** `{ "newPassword": "newpassword123" }`
- **Response:** Success message or error

## Frontend Routes

### Forgot Password Page
- **URL:** `/forgot-password`
- **Features:** Email input, validation, success state

### Reset Password Page
- **URL:** `/reset-password/[token]`
- **Features:** Password input, confirmation, validation

## Security Features

1. **Token Security:**
   - Tokens are hashed before storing
   - 10-minute expiration
   - Single-use tokens

2. **Password Validation:**
   - Minimum 6 characters
   - Password confirmation required

3. **Rate Limiting:**
   - Consider adding rate limiting to prevent abuse

## Testing

### Without Email Setup
The system will work without email configuration by returning the reset URL in the response for development purposes.

### With Email Setup
1. Request password reset
2. Check email for reset link
3. Click link and set new password
4. Verify login with new password

## Troubleshooting

### Common Issues

1. **Email not sending:**
   - Check SMTP credentials
   - Verify email provider settings
   - Check firewall/network restrictions

2. **Token expired:**
   - Request new reset link
   - Tokens expire after 10 minutes

3. **Invalid token:**
   - Ensure using the complete token from email
   - Check if token was already used

### Development Mode
In development, the system will return the reset URL in the API response if email sending fails, allowing you to test the functionality without email setup.

## Production Considerations

1. **Remove debug information:**
   - Remove `resetToken` from API responses
   - Ensure proper error handling

2. **Email configuration:**
   - Use production SMTP service
   - Set up proper email templates
   - Monitor email delivery

3. **Security:**
   - Add rate limiting
   - Monitor for abuse
   - Log security events

4. **Environment variables:**
   - Set `FRONTEND_URL` to production URL
   - Use strong JWT secrets
   - Secure SMTP credentials
