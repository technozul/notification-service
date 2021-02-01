import { NotificationPayload } from '../interfaces/notification-payload.interface'
import { NotificationHandlerInterface } from '../interfaces/notification-handler.interface'
import * as nodemailer from 'nodemailer'
import mailgun from 'nodemailer-mailgun-transport'
import Mail from 'nodemailer/lib/mailer'

export class EmailNotificationHandler implements NotificationHandlerInterface {
  private transporter: Mail

  constructor() {
    this.transporter = this.getTransporter()
  }

  async send(payload: NotificationPayload) {
    const emailPayload: Mail.Options = {
      from: process.env.EMAIL_SENDER_USERNAME,
      to: payload.to,
      subject: payload.subject,
      text: payload.message
    }

    return this.transporter.sendMail(emailPayload, (error, info) => {
      if (error) {
        console.log('EMAIL Response error: ', error)
        // TODO logger insert to db
        return
      }
      console.log('sukses kirim email', info)
      // TODO logger console (pino)
    })
  }

  getTransporter() {
    const auth: mailgun.Options = {
      auth: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      }
    }
    const mailgunAuth = mailgun(auth)
    const transporter = nodemailer.createTransport(mailgunAuth)
    return transporter
  }
}
