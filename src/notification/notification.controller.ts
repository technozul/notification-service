import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import {
  CreateNotificationDTO,
  EmailNotificationInterface,
  NotificationEnum,
  PushNotificationInterface,
  SMSNotificationInterface
} from './notification.interface'

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(NotificationEnum.EMAIL)
    private readonly emailNotificationService: EmailNotificationInterface,
    @Inject(NotificationEnum.PUSH)
    private readonly pushNotificationService: PushNotificationInterface,
    @Inject(NotificationEnum.SMS)
    private readonly smsNotificationService: SMSNotificationInterface
  ) {}

  @Post('/')
  @UseInterceptors(FilesInterceptor('attachments'))
  createNotification(
    @Body() body: CreateNotificationDTO[],
    @UploadedFiles() attachments: Express.Multer.File
  ) {
    console.log(body)

    body.forEach((bodyPayload) => {
      switch (bodyPayload.type) {
        case NotificationEnum.EMAIL:
          if (attachments) {
            bodyPayload.attachments = attachments
          }
          this.emailNotificationService.send(bodyPayload)
          break

        case NotificationEnum.PUSH:
          this.pushNotificationService.send(bodyPayload)
          break

        case NotificationEnum.SMS:
          this.smsNotificationService.send(bodyPayload)
          break

        default:
          throw new Error('Invalid notification type')
      }
    })

    return { message: 'ok' }
  }
}
