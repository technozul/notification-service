import { NotificationPayload } from '../interfaces/notification-payload.interface'
import { NotificationHandlerInterface } from '../interfaces/notification-handler.interface'
import * as nodemailer from 'nodemailer'
import * as mailgun from 'nodemailer-mailgun-transport'
import Mail from 'nodemailer/lib/mailer'

export class EmailNotificationHandler implements NotificationHandlerInterface {
  async send(payload: NotificationPayload) {
    const transporter = this.getTransporter()
    const emailPayload: Mail.Options = {
      from: process.env.MAILGUN_EMAIL_SENDER,
      to: payload.to,
      subject: payload.subject,
      text: payload.message
    }

    return transporter.sendMail(emailPayload, (error, info) => {
      if (error) {
        console.log('ada error nih: ', error)
      }
      console.log('sukses kirim email: ', info)
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
