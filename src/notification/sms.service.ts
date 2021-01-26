import { Injectable } from '@nestjs/common'
import {
  CreateNotificationDTO,
  SMSNotificationInterface
} from './notification.interface'

@Injectable()
export class SMSNotificationService implements SMSNotificationInterface {
  to: string | string[]
  message: string

  send(payload: CreateNotificationDTO) {
    console.log('sms: ', payload)
  }
}
