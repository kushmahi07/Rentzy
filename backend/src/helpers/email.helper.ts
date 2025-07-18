
import sgMail from '@sendgrid/mail';
import { environment } from '../environments/index';
import { 
  emailVerificationTemplate, 
  welcomeEmailTemplate, 
  passwordResetTemplate,
  notificationEmailTemplate 
} from '../templates/index';

// Initialize SendGrid
if (environment.SENDGRID_API_KEY) {
  sgMail.setApiKey(environment.SENDGRID_API_KEY);
}

/**
 * Send verification email to user
 */
export const sendVerificationEmail = async (
  email: string, 
  verificationCode: string, 
  firstName: string
): Promise<void> => {
  try {
    const fromEmail = environment.SENDGRID_FROM_EMAIL;

    if (!environment.SENDGRID_API_KEY || !fromEmail) {
      throw new Error('SendGrid credentials not found in environment variables');
    }

    const htmlContent = emailVerificationTemplate(firstName, verificationCode);

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Verify Your Email Address',
      html: htmlContent
    };

    await sgMail.send(msg);
    console.log(`📧 Verification email sent successfully to ${email}`);
  } catch (error: any) {
    console.error('❌ Error sending verification email:', error.message);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (
  email: string, 
  firstName: string,
  verificationUrl?: string
): Promise<void> => {
  try {
    const fromEmail = environment.SENDGRID_FROM_EMAIL;

    if (!environment.SENDGRID_API_KEY || !fromEmail) {
      throw new Error('SendGrid credentials not found in environment variables');
    }

    const htmlContent = welcomeEmailTemplate(firstName, verificationUrl);

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Welcome to Our Property Management Platform!',
      html: htmlContent
    };

    await sgMail.send(msg);
    console.log(`📧 Welcome email sent successfully to ${email}`);
  } catch (error: any) {
    console.error('❌ Error sending welcome email:', error.message);
    throw new Error('Failed to send welcome email. Please try again.');
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  resetCode: string
): Promise<void> => {
  try {
    const fromEmail = environment.SENDGRID_FROM_EMAIL;

    if (!environment.SENDGRID_API_KEY || !fromEmail) {
      throw new Error('SendGrid credentials not found in environment variables');
    }

    const htmlContent = passwordResetTemplate(firstName, resetCode);

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Reset Your Password',
      html: htmlContent
    };

    await sgMail.send(msg);
    console.log(`📧 Password reset email sent successfully to ${email}`);
  } catch (error: any) {
    console.error('❌ Error sending password reset email:', error.message);
    throw new Error('Failed to send password reset email. Please try again.');
  }
};

/**
 * Send admin account creation notification email
 */
export const sendAdminAccountEmail = async (
  email: string,
  firstName: string,
  tempPassword: string,
  loginUrl: string
): Promise<void> => {
  try {
    const fromEmail = environment.SENDGRID_FROM_EMAIL;

    if (!environment.SENDGRID_API_KEY || !fromEmail) {
      throw new Error('SendGrid credentials not found in environment variables');
    }

    const message = `Your admin account has been created successfully. Your temporary password is: ${tempPassword}. Please login and change your password immediately for security.`;
    
    const htmlContent = notificationEmailTemplate(
      firstName, 
      'Admin Account Created', 
      message,
      loginUrl,
      'Login to Admin Panel'
    );

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Admin Account Created - Property Management Platform',
      html: htmlContent
    };

    await sgMail.send(msg);
    console.log(`📧 Admin account email sent successfully to ${email}`);
  } catch (error: any) {
    console.error('❌ Error sending admin account email:', error.message);
    throw new Error('Failed to send admin account email. Please try again.');
  }
};

/**
 * Send general notification email
 */
export const sendNotificationEmail = async (
  email: string,
  firstName: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string
): Promise<void> => {
  try {
    const fromEmail = environment.SENDGRID_FROM_EMAIL;

    if (!environment.SENDGRID_API_KEY || !fromEmail) {
      throw new Error('SendGrid credentials not found in environment variables');
    }

    const htmlContent = notificationEmailTemplate(firstName, title, message, actionUrl, actionText);

    const msg = {
      to: email,
      from: fromEmail,
      subject: title,
      html: htmlContent
    };

    await sgMail.send(msg);
    console.log(`📧 Notification email sent successfully to ${email}`);
  } catch (error: any) {
    console.error('❌ Error sending notification email:', error.message);
    throw new Error('Failed to send notification email. Please try again.');
  }
};

/**
 * Send bulk emails
 */
export const sendBulkEmails = async (
  recipients: Array<{
    email: string;
    firstName: string;
    customData?: Record<string, any>;
  }>,
  subject: string,
  templateType: 'welcome' | 'notification' | 'verification',
  templateData: Record<string, any>
): Promise<void> => {
  try {
    const fromEmail = environment.SENDGRID_FROM_EMAIL;

    if (!environment.SENDGRID_API_KEY || !fromEmail) {
      throw new Error('SendGrid credentials not found in environment variables');
    }

    const emails = recipients.map(recipient => {
      let htmlContent = '';
      
      switch (templateType) {
        case 'welcome':
          htmlContent = welcomeEmailTemplate(recipient.firstName, templateData.verificationUrl);
          break;
        case 'notification':
          htmlContent = notificationEmailTemplate(
            recipient.firstName,
            templateData.title,
            templateData.message,
            templateData.actionUrl,
            templateData.actionText
          );
          break;
        case 'verification':
          htmlContent = emailVerificationTemplate(recipient.firstName, templateData.verificationCode);
          break;
        default:
          throw new Error(`Unsupported template type: ${templateType}`);
      }

      return {
        to: recipient.email,
        from: fromEmail,
        subject: subject,
        html: htmlContent
      };
    });

    await sgMail.send(emails);
    console.log(`📧 Bulk emails sent successfully to ${recipients.length} recipients`);
  } catch (error: any) {
    console.error('❌ Error sending bulk emails:', error.message);
    throw new Error('Failed to send bulk emails. Please try again.');
  }
};

/**
 * Validate email configuration
 */
export const validateEmailConfig = (): boolean => {
  return !!(environment.SENDGRID_API_KEY && environment.SENDGRID_FROM_EMAIL);
};
