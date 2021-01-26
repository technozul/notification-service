import { Injectable } from '@nestjs/common'
import {
  CreateNotificationDTO,
  PushNotificationInterface
} from './notification.interface'

@Injectable()
export class PushNotificationService implements PushNotificationInterface {
  to: string | string[]
  message: string

  send(payload: CreateNotificationDTO) {
    console.log('push: ', payload)
  }
}
