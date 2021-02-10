import { NotificationPayload } from '../interfaces/notification-payload.interface'
import { NotificationHandlerInterface } from '../interfaces/notification-handler.interface'
import * as firebaseAdmin from 'firebase-admin'
import * as serviceAccountKey from '@src/firebase/serviceAccountKey.json'
import { FirebaseError, messaging } from 'firebase-admin'
import { Logger } from '@nestjs/common'

export class PushNotificationHandler implements NotificationHandlerInterface {
  private firebaseApp: firebaseAdmin.app.App
  private readonly logger: Logger = new Logger(PushNotificationHandler.name)

  constructor() {
    this.initFirebaseApp()
  }

  async send(payload: NotificationPayload) {
    const messageNotificationPayload: messaging.Notification = {
      title: payload.subject,
      body: payload.message
    }

    if (Array.isArray(payload.to)) {
      return this.sendBulk(payload, messageNotificationPayload)
    }

    const token = payload.to as string
    const messaging = this.firebaseApp.messaging()
    const sendPayload: messaging.Message = {
      token,
      notification: messageNotificationPayload
    }

    return messaging
      .send(sendPayload)
      .then((response: string) => {
        return response
      })
      .catch((error: FirebaseError) => {
        const message = `${error.message}: ${token}`
        this.logger.error(message)
      })
  }

  async sendBulk(
    payload: NotificationPayload,
    messageNotificationPayload: messaging.Notification
  ) {
    const recipient = payload.to as string[]
    const messaging = this.firebaseApp.messaging()
    const sendPayload: messaging.MulticastMessage = {
      tokens: recipient,
      notification: messageNotificationPayload
    }

    return messaging
      .sendMulticast(sendPayload)
      .then((response: messaging.BatchResponse) => {
        const responses = response.responses
        responses.forEach((r, i) => {
          const token = recipient[i]
          const error = r.error

          if (error) {
            const message = `${error.message}: ${token}`
            this.logger.error(message)
            return
          }
        })
      })
      .catch((error) => {
        this.logger.error(error.message)
      })
  }

  initFirebaseApp() {
    const cert = serviceAccountKey as firebaseAdmin.ServiceAccount
    const credential = firebaseAdmin.credential.cert(cert)
    const app = firebaseAdmin.initializeApp({
      credential,
      databaseURL: process.env.FIREBASE_DB_URL
    })
    this.firebaseApp = app
  }
}
