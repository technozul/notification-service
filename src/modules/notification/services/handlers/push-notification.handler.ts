import { NotificationPayload } from '../interfaces/notification-payload.interface'
import { NotificationHandlerInterface } from '../interfaces/notification-handler.interface'
import * as firebaseAdmin from 'firebase-admin'
import * as serviceAccountKey from '@src/firebase/serviceAccountKey.json'
import { FirebaseError, messaging } from 'firebase-admin'

export class PushNotificationHandler implements NotificationHandlerInterface {
  private firebaseApp: firebaseAdmin.app.App

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
        console.log(`sukses kirim push ke: ${token}`, response)
        // TODO logger console (pino)
      })
      .catch((error: FirebaseError) => {
        const err = { ...error.toJSON(), token }
        console.log('PUSH Response error:', err)
        // TODO logger insert to db
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

          if (r.error) {
            const err = { ...r.error.toJSON(), token }
            console.log('PUSH Response erorr: ', err)
            // TODO logger insert to db
            return
          }

          console.log(`sukses kirim push ke: ${token}`)
          // TODO logger console (pino)
        })
      })
      .catch((error) => {
        console.log('PUSH API error:', error)
        // TODO logger console (pino)
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
