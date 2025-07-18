
export interface NotificationTemplate {
  id: string;
  triggerType: TriggerType;
  channel: Channel;
  title: string;
  messageBody: string;
  createdAt: string;
  updatedAt: string;
}

export type TriggerType = 'Booking' | 'Payout' | 'Tokenization';
export type Channel = 'Email' | 'Push' | 'SMS';

export interface NotificationTemplateFilters {
  triggerType: string;
  channel: string;
}

export interface NotificationTemplateFormData {
  triggerType: TriggerType | '';
  channel: Channel | '';
  title: string;
  messageBody: string;
}
