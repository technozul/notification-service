import { BullModule } from '@nestjs/bull'
import { Module, Provider } from '@nestjs/common'
import { EmailNotificationProcessor } from './processor/email.processor'
import { PushNotificationProcessor } from './processor/push.processor'
import { SMSNotificationProcessor } from './processor/sms.processor'
import { NotificationController } from './controllers/notification.controller'
import { EmailNotificationHandler } from './services/handlers/email-notification.handler'
import { PushNotificationHandler } from './services/handlers/push-notification.handler'
import { SMSNotificationHandler } from './services/handlers/sms-notification.handler'
import { NotificationProvider } from './services/notification.provider'
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

const QueueModule = BullModule.registerQueueAsync(
  {
    name: NotificationType.EMAIL,
    useFactory: () => ({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
      }
    })
  },
  {
    name: NotificationType.PUSH,
    useFactory: () => ({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
      }
    })
  },
  {
    name: NotificationType.SMS,
    useFactory: () => ({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
      }
    })
  }
)
@Module({
  controllers: [NotificationController],
  imports: [QueueModule],
  providers: [
    NotificationServiceProvider,
    EmailNotificationProcessor,
    PushNotificationProcessor,
    SMSNotificationProcessor
  ]
})
export class NotificationModule {}
