import { NotificationPayload } from '../interfaces/notification-payload.interface'
import { NotificationHandlerInterface } from '../interfaces/notification-handler.interface'
import Vonage, {
  MessageError,
  MessageRequestResponse,
  SendSmsOptions
} from '@vonage/server-sdk'

export class SMSNotificationHandler implements NotificationHandlerInterface {
  private vonageApp: Vonage

  constructor() {
    this.vonageApp = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET
    })
  }

  async send(payload: NotificationPayload) {
    const from = process.env.SMS_SENDER_USERNAME
    const to = payload.to
    const text = payload.message
    const options = {}

    if (Array.isArray(to)) {
      return Promise.resolve(() => {
        to.forEach((r) => {
          this.sender(from, r, text, options)
        })
      })
    }

    return this.sender(from, to, text, options)
  }

  sender(
    from: string,
    to: string,
    text: string,
    options: Partial<SendSmsOptions>
  ) {
    return this.vonageApp.message.sendSms(
      from,
      to,
      text,
      options,
      (error: MessageError, response: MessageRequestResponse) => {
        if (error) {
          console.log(`ada error pas kirim sms ke ${to} bro: `, error)
          return
        }
        console.log(`suskes kirim sms ke ${to}: `, response)
      }
    )
  }
}
