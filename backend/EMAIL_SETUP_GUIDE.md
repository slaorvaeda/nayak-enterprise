# Email Setup Guide for Forgot Password Feature

## Overview
The forgot password feature requires email configuration to send password reset links to users. This guide will help you set up email functionality.

## Current Status
✅ **Backend API**: Working correctly  
✅ **Frontend UI**: Working correctly  
✅ **Token Generation**: Working correctly  
❌ **Email Sending**: Not configured  

## Quick Setup (Development Mode)
The system currently works in development mode by showing the reset URL directly in the frontend when email sending fails.

## Email Configuration

### Option 1: Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update .env file** in the backend directory:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=Nayak Enterprises <your-email@gmail.com>
FRONTEND_URL=http://localhost:3000
```

### Option 2: Other Email Providers

#### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Option 3: Professional Email Services

#### SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## Testing Email Configuration

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Test with curl**:
   ```bash
   curl -X POST http://localhost:5001/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"john@samplestore.com"}'
   ```

3. **Check the response**:
   - If email is configured: You'll receive a success message
   - If email is not configured: You'll get the reset URL in the response

## Frontend Testing

1. **Start the frontend server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to** `http://localhost:3000/forgot-password`

3. **Enter a valid email** (e.g., `john@samplestore.com`)

4. **Check the result**:
   - If email is configured: You'll see "Check Your Email"
   - If email is not configured: You'll see the reset URL to copy

## Production Considerations

### Security
- Remove `resetToken` from API responses in production
- Use environment-specific email configurations
- Set up proper email monitoring

### Email Templates
- Customize email templates in `backend/src/utils/emailService.js`
- Add your company branding
- Include proper unsubscribe links

### Monitoring
- Set up email delivery monitoring
- Log email sending failures
- Monitor bounce rates

## Troubleshooting

### Common Issues

1. **"Authentication failed"**:
   - Check your email credentials
   - Ensure 2FA is enabled for Gmail
   - Use App Password instead of regular password

2. **"Connection timeout"**:
   - Check your internet connection
   - Verify SMTP host and port
   - Check firewall settings

3. **"Email not received"**:
   - Check spam folder
   - Verify email address
   - Check email provider settings

### Debug Mode
The system includes debug logging. Check the backend console for:
- Email sending attempts
- SMTP connection status
- Error messages

## Current Working Features

✅ **Password Reset Flow**:
1. User enters email on forgot password page
2. System generates secure reset token
3. Reset URL is created and displayed (development mode)
4. User clicks/copies reset URL
5. User sets new password
6. Password is updated in database

✅ **Security Features**:
- 10-minute token expiration
- Single-use tokens
- Hashed token storage
- Password validation

✅ **User Experience**:
- Clear error messages
- Loading states
- Success confirmations
- Copy-to-clipboard functionality

## Next Steps

1. **Configure email** using one of the options above
2. **Test the complete flow** end-to-end
3. **Customize email templates** for your brand
4. **Set up monitoring** for production use

The forgot password feature is fully functional and ready for production use once email is configured!
