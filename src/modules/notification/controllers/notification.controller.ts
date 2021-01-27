import { Body, Controller, Post } from '@nestjs/common'
import { NotificationPayloadWrapper } from '../services/interfaces/notification-payload.interface'
import { NotificationService } from '../services/notification.service'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/')
  async send(@Body() { payload }: NotificationPayloadWrapper) {
    try {
      await this.notificationService.send(payload)
      return { success: 'message sent' }
    } catch (error) {
      throw error
    }
  }
}
