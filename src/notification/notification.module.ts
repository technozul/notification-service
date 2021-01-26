import { Module, Provider } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { EmailNotificationService } from './email.service'
import { PushNotificationService } from './push.service'
import { SMSNotificationService } from './sms.service'
import { NotificationEnum } from './notification.interface'

const EmailNotificationServiceProvider: Provider = {
  provide: NotificationEnum.EMAIL,
  useClass: EmailNotificationService
}

const PushNotificationServiceProvider: Provider = {
  provide: NotificationEnum.PUSH,
  useClass: PushNotificationService
}

const SMSNotificationServiceProvider: Provider = {
  provide: NotificationEnum.SMS,
  useClass: SMSNotificationService
}

@Module({
  controllers: [NotificationController],
  providers: [
    EmailNotificationServiceProvider,
    PushNotificationServiceProvider,
    SMSNotificationServiceProvider
  ]
})
export class NotificationModule {}
