import { Module, Provider } from '@nestjs/common'
import { NotificationController } from './controllers/notification.controller'
import { EmailNotificationHandler } from './services/handlers/email-notification.handler'
import { PushNotificationHandler } from './services/handlers/push-notification.handler'
import { NotificationProvider } from './services/notification.provider'
import { NotificationType } from './services/types/notification-type.enum'

const NotificationServiceProvider: Provider = {
  provide: NotificationProvider,
  useFactory: () => {
    const map = new Map()
    map.set(NotificationType.EMAIL, new EmailNotificationHandler())
    map.set(NotificationType.PUSH, new PushNotificationHandler())
  }
}

@Module({
  controllers: [NotificationController],
  providers: [NotificationServiceProvider]
})
export class NotificationModule {}
