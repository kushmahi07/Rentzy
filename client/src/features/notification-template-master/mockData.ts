
import { NotificationTemplate } from './types';

export const mockNotificationTemplates: NotificationTemplate[] = [
  {
    id: '1',
    triggerType: 'Booking',
    channel: 'Email',
    title: 'Booking Confirmation',
    messageBody: 'Your booking has been confirmed. Details: Property: {{propertyName}}, Check-in: {{checkInDate}}, Check-out: {{checkOutDate}}. We look forward to hosting you!',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    triggerType: 'Booking',
    channel: 'SMS',
    title: 'Booking Reminder',
    messageBody: 'Reminder: Your stay at {{propertyName}} starts tomorrow. Check-in time: {{checkInTime}}. Contact us if you need assistance.',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
  },
  {
    id: '3',
    triggerType: 'Payout',
    channel: 'Email',
    title: 'Rental Payout Processed',
    messageBody: 'Your rental payout of ${{amount}} has been processed successfully and will be deposited to your account within 2-3 business days. Transaction ID: {{transactionId}}',
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
  },
  {
    id: '4',
    triggerType: 'Tokenization',
    channel: 'Push',
    title: 'Token Sale Started',
    messageBody: 'Token sale for {{propertyName}} has started! {{tokenCount}} tokens available at ${{pricePerToken}} each. Invest now!',
    createdAt: '2024-01-12T11:45:00Z',
    updatedAt: '2024-01-12T11:45:00Z',
  },
  {
    id: '5',
    triggerType: 'Payout',
    channel: 'SMS',
    title: 'Payout Alert',
    messageBody: 'Payout of ${{amount}} initiated. Check your email for details. Questions? Reply HELP.',
    createdAt: '2024-01-11T16:30:00Z',
    updatedAt: '2024-01-11T16:30:00Z',
  },
  {
    id: '6',
    triggerType: 'Tokenization',
    channel: 'Email',
    title: 'Token Purchase Confirmation',
    messageBody: 'Thank you for purchasing {{tokenCount}} tokens for {{propertyName}}. Total investment: ${{totalAmount}}. Your tokens will be available in your portfolio within 24 hours.',
    createdAt: '2024-01-10T13:00:00Z',
    updatedAt: '2024-01-10T13:00:00Z',
  },
];
