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
      return new Promise((resolve) => {
        to.forEach((r) => {
          this.sender(from, r, text, options)
        })
        resolve(true)
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
          console.log(`SMS Response error: `, error)
          // TODO logger console (pino)
          return
        }

        const messages = response.messages
        messages.forEach((m) => {
          const status = parseInt(m.status)
          if (status !== 0) {
            console.log('SMS Response error: ', m)
            // TODO logger insert to db
            return
          }
        })

        console.log(`sukses kirim sms ke: ${to}`)
        // TODO logger console (pino)
      }
    )
  }
}
