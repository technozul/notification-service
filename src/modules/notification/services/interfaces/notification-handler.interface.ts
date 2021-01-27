import { NotificationPayload } from './notification-payload.interface'

export interface NotificationHandlerInterface {
  send(payload: NotificationPayload): void
}
