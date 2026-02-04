const sgMail = require('../config/sendgrid');

const getOtpEmailTemplate = (otp, userName = 'User') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-align: center;
            padding: 30px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #666666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .otp-box {
            background-color: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            margin: 0;
        }
        .otp-label {
            font-size: 14px;
            color: #999999;
            margin-top: 10px;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
            border-radius: 4px;
        }
        .warning p {
            margin: 0;
            font-size: 14px;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #999999;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔐 OTP Verification</h1>
        </div>
        <div class="content">
            <p class="greeting">Hello ${userName},</p>
            <p class="message">
                You have requested to log in to your Snapdeal account.
                Please use the following One-Time Password (OTP) to complete your authentication.
            </p>
            <div class="otp-box">
                <p class="otp-code">${otp}</p>
                <p class="otp-label">Your verification code</p>
            </div>
            <div class="warning">
                <p><strong>⚠️ Important Security Information:</strong></p>
                <p>• This OTP is valid for 10 minutes only.</p>
                <p>• Do not share this code with anyone.</p>
                <p>• If you didn't request this code, please ignore this email.</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Snapdeal. All rights reserved.</p>
            <p>Need help? Contact us at <a href="mailto:support@snapdeal.com">support@snapdeal.com</a></p>
        </div>
    </div>
</body>
</html>
`;
};

const sendOtpEmail = async (email, otp, userName = 'User') => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@snapdeal.com',
      subject: 'Your Snapdeal Login OTP - Verify Your Identity',
      html: getOtpEmailTemplate(otp, userName),
      text: `Hello ${userName},\n\nYour OTP for Snapdeal login is: ${otp}\n\nThis code is valid for 10 minutes.\n\nDo not share this code with anyone.\n\nIf you didn't request this, please ignore this email.\n\nThank you,\nSnapdeal Team`,
    };

    const info = await sgMail.send(msg);
    console.log(`OTP email sent successfully to ${email}:`, otp);
    return { success: true, messageId: info[0].statusCode };
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.status,
      errors: error.response?.body?.errors
    };
    console.error('SendGrid Error Details:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Failed to send OTP email');
  }
};

module.exports = {
  sendOtpEmail,
  getOtpEmailTemplate,
};