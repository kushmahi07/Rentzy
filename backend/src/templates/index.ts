/**
 * Email template for user registration
 */
export const welcomeEmailTemplate = (firstName: string, verificationUrl: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Our Platform!</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Thank you for joining our platform. We're excited to have you on board!</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
        </div>
        <div class="footer">
            <p>If you didn't create this account, please ignore this email.</p>
            <p>&copy; 2024 Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Email template for password reset with reset code
 */
export const passwordResetTemplate = (firstName: string, resetCode: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .code { font-size: 32px; font-weight: bold; text-align: center; background: white; padding: 20px; margin: 20px 0; border: 2px dashed #dc3545; letter-spacing: 5px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your password. Please use the following reset code:</p>
            <div class="code">${resetCode}</div>
            <div class="warning">
                <strong>Security Notice:</strong> This password reset code will expire in 15 minutes for security reasons.
            </div>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Email template for password reset with URL
 */
export const passwordResetEmailTemplate = (firstName: string, resetUrl: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <div class="warning">
                <strong>Security Notice:</strong> This password reset link will expire in 1 hour for security reasons.
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
        </div>
        <div class="footer">
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>&copy; 2024 Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Email template for email verification
 */
export const emailVerificationTemplate = (firstName: string, verificationCode: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .code { font-size: 32px; font-weight: bold; text-align: center; background: white; padding: 20px; margin: 20px 0; border: 2px dashed #28a745; letter-spacing: 5px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>To complete your email verification, please use the following verification code:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in 5 minutes for security reasons.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Email template for general notifications
 */
export const notificationEmailTemplate = (firstName: string, title: string, message: string, actionUrl?: string, actionText?: string): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #17a2b8; color: white; text-decoration: none; border-radius: 5px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>${message}</p>
            ${actionUrl && actionText ? `
            <p style="text-align: center; margin: 30px 0;">
                <a href="${actionUrl}" class="button">${actionText}</a>
            </p>
            ` : ''}
        </div>
        <div class="footer">
            <p>&copy; 2024 Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * SMS template for verification codes
 */
export const smsVerificationTemplate = (code: string, appName: string = 'Our Platform'): string => 
    `Your ${appName} verification code is: ${code}. This code expires in 5 minutes. Do not share this code with anyone.`;

/**
 * SMS template for password reset
 */
export const smsPasswordResetTemplate = (code: string, appName: string = 'Our Platform'): string => 
    `Your ${appName} password reset code is: ${code}. Use this code to reset your password. Expires in 15 minutes.`;

/**
 * Push notification template
 */
export const pushNotificationTemplate = (title: string, body: string, data?: Record<string, any>) => ({
    title,
    body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data,
    actions: [
        {
            action: 'view',
            title: 'View',
            icon: '/view-icon.png'
        },
        {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/dismiss-icon.png'
        }
    ]
});

/**
 * Invoice template (HTML)
 */
export const invoiceTemplate = (
    invoiceNumber: string,
    customerName: string,
    customerEmail: string,
    items: Array<{name: string, quantity: number, price: number}>,
    total: number,
    currency: string = 'USD'
): string => {
    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice ${invoiceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-details { margin-bottom: 30px; }
        .customer-info { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
        .total-row { font-weight: bold; background: #f9f9f9; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>INVOICE</h1>
            <h2>Invoice #${invoiceNumber}</h2>
        </div>
        
        <div class="customer-info">
            <strong>Bill To:</strong><br>
            ${customerName}<br>
            ${customerEmail}
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
                <tr class="total-row">
                    <td colspan="3" style="padding: 15px; text-align: right;">TOTAL:</td>
                    <td style="padding: 15px; text-align: right;">$${total.toFixed(2)} ${currency}</td>
                </tr>
            </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
            <p>Thank you for your business!</p>
            <p>&copy; 2024 Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};
