
import ejs from 'ejs';
import path from 'path';

export class TemplateUtils {
  private static TEMPLATES_DIR = path.join(__dirname, '../templates');

  /**
   * Render email template using EJS
   */
  static async renderEmailTemplate(
    templateName: string,
    data: Record<string, any>
  ): Promise<string> {
    try {
      const templatePath = path.join(this.TEMPLATES_DIR, 'email', `${templateName}.ejs`);
      return await ejs.renderFile(templatePath, data);
    } catch (error: any) {
      console.error(`❌ Error rendering email template ${templateName}:`, error.message);
      throw new Error(`Failed to render email template: ${templateName}`);
    }
  }

  /**
   * Validate email template data
   */
  static validateEmailTemplateData(templateName: string, data: Record<string, any>): boolean {
    const requiredFields: Record<string, string[]> = {
      verification: ['userName', 'verificationLink'],
      welcome: ['userName'],
      adminAccount: ['firstName', 'tempPassword', 'loginUrl']
    };

    const required = requiredFields[templateName];
    if (!required) {
      throw new Error(`Unknown email template: ${templateName}`);
    }

    const missing = required.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields for ${templateName} template: ${missing.join(', ')}`);
    }

    return true;
  }
}
