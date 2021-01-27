import { NotificationPayload } from '../interfaces/notification-payload.interface'
import { NotificationHandlerInterface } from '../interfaces/notification-handler.interface'

export class PushNotificationHandler implements NotificationHandlerInterface {
  send(payload: NotificationPayload) {
    console.log('todo send email here')
  }
}
