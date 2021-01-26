import { Injectable } from '@nestjs/common'
import {
  CreateNotificationDTO,
  EmailNotificationInterface
} from './notification.interface'

@Injectable()
export class EmailNotificationService implements EmailNotificationInterface {
  from: string
  subject: string
  to: string | string[]
  message: string
  attachments: any

  send(payload: CreateNotificationDTO) {
    console.log('email: ', payload)
  }
}
