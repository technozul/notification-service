import { Injectable, Inject, Logger } from '@nestjs/common'
import { NotificationHandlerInterface } from './interfaces/notification-handler.interface'
import { NotificationPayload } from './interfaces/notification-payload.interface'
import { NotificationProvider } from './notification.provider'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  NotificationType
} from './types/notification-type.enum'

@Injectable()
export class NotificationService {
  private readonly logger: Logger = new Logger(NotificationService.name)

  constructor(
    @Inject(NotificationProvider)
    private readonly notificationHandlerMappepr: Map<
      NotificationType,
      NotificationHandlerInterface
    >
  ) {}

  async send(payload: NotificationPayload) {
    try {
      const notificationType = payload.type
      const handler: NotificationHandlerInterface = this.notificationHandlerMappepr.get(
        notificationType
      )
      await handler.send(payload)
      return true
    } catch (error) {
      this.logger.error(error.message)
    }
  }
}
