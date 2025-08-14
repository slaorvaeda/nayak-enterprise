# Email Configuration Steps for Forgot Password

## Step 1: Fix the Nodemailer Issue ✅
The nodemailer API issue has been fixed. The email service now uses the correct method.

## Step 2: Choose Your Email Provider

### Option A: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update your .env file** in the backend directory:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=Nayak Enterprises <your-actual-email@gmail.com>
FRONTEND_URL=http://localhost:3000
```

### Option B: Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=Nayak Enterprises <your-email@outlook.com>
FRONTEND_URL=http://localhost:3000
```

### Option C: Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_FROM=Nayak Enterprises <your-email@yahoo.com>
FRONTEND_URL=http://localhost:3000
```

## Step 3: Update Your .env File

Replace the email section in your `backend/.env` file with the configuration from Step 2.

**Current .env file location**: `/Users/priyanshunayak/Desktop/nayak-enterprises/backend/.env`

**Replace these lines**:
```env
# Email Configuration (for future use)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**With your actual email configuration** (example for Gmail):
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=Nayak Enterprises <your-actual-email@gmail.com>
FRONTEND_URL=http://localhost:3000
```

## Step 4: Test Email Configuration

1. **Restart the backend server**:
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
   - If email is configured correctly: You'll see "Password reset email sent successfully"
   - If email fails: You'll see the reset URL in the response

## Step 5: Test the Complete Flow

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Visit the forgot password page**: `http://localhost:3000/forgot-password`

3. **Enter a valid email**: `john@samplestore.com`

4. **Check your email** for the reset link

5. **Click the reset link** and set a new password

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**:
   - Ensure 2FA is enabled for Gmail
   - Use App Password, not your regular password
   - Check email and password spelling

2. **"Connection timeout"**:
   - Check internet connection
   - Verify SMTP host and port
   - Check firewall settings

3. **"Email not received"**:
   - Check spam folder
   - Verify email address
   - Check email provider settings

### Debug Mode:
The system logs email sending attempts. Check the backend console for:
- Email sending attempts
- SMTP connection status
- Error messages

## Example .env Configuration

Here's a complete example of what your `.env` file should look like:

```env
# Server Configuration
PORT=5001
NODE_ENV=development
DEV_NODE_ENV = http://localhost:3000 

# MongoDB Configuration
MONGODB_URI=mongodb+srv://kanh123ngp:Papidm2024@cluster0.gvc1y6c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=iosugfdsouilSNIFSUFNDSUTIIIUy62835q629ghvsdj
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=Nayak Enterprises <your-actual-email@gmail.com>
FRONTEND_URL=http://localhost:3000

# Payment Gateway (for future use)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## Next Steps

1. **Update your .env file** with your actual email credentials
2. **Restart the backend server**
3. **Test the forgot password flow**
4. **Check your email** for the reset link

Once configured, users will receive actual emails with password reset links instead of seeing the URL in the frontend!
