import { Module, Provider } from '@nestjs/common'
import { NotificationController } from './controllers/notification.controller'
import { EmailNotificationHandler } from './services/handlers/email-notification.handler'
import { PushNotificationHandler } from './services/handlers/push-notification.handler'
import { SMSNotificationHandler } from './services/handlers/sms-notification.handler'
import { NotificationProvider } from './services/notification.provider'
import { NotificationService } from './services/notification.service'
import { NotificationType } from './services/types/notification-type.enum'

const NotificationServiceProvider: Provider = {
  provide: NotificationProvider,
  useFactory: () => {
    const map = new Map()
    map.set(NotificationType.EMAIL, new EmailNotificationHandler())
    map.set(NotificationType.PUSH, new PushNotificationHandler())
    map.set(NotificationType.SMS, new SMSNotificationHandler())
    return map
  }
}

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationServiceProvider]
})
export class NotificationModule {}
