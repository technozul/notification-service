import { Injectable, Inject } from '@nestjs/common'
import { NotificationHandlerInterface } from './interfaces/notification-handler.interface'
import { NotificationPayload } from './interfaces/notification-payload.interface'
import { NotificationProvider } from './notification.provider'
import { NotificationType } from './types/notification-type.enum'

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NotificationProvider)
    private readonly notificationHandlerMappepr: Map<
      NotificationType,
      NotificationHandlerInterface
    >
  ) {}

  async send(payloads: NotificationPayload[]) {
    payloads.forEach((payload) => {
      const notificationHandler: NotificationHandlerInterface = this.notificationHandlerMappepr.get(
        payload.type
      )
      notificationHandler.send(payload)
    })
  }
}