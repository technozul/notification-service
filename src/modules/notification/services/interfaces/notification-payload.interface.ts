import { NotificationType } from '../types/notification-type.enum'

export interface NotificationPayload {
  type: NotificationType
  to: string | string[]
  message: string
  subject?: string
  templateId?: string
}
