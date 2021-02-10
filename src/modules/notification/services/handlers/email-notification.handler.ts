import { NotificationPayload } from '../interfaces/notification-payload.interface'
import { NotificationHandlerInterface } from '../interfaces/notification-handler.interface'
import * as nodemailer from 'nodemailer'
import mailgun from 'nodemailer-mailgun-transport'
import Mail from 'nodemailer/lib/mailer'
import { Logger } from '@nestjs/common'

export class EmailNotificationHandler implements NotificationHandlerInterface {
  private transporter: Mail
  private readonly logger: Logger = new Logger(EmailNotificationHandler.name)

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

    return this.transporter.sendMail(emailPayload, (error) => {
      if (error) {
        this.logger.error(error.message)
        return
      }
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
