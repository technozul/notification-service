import { NotificationPayload } from '../interfaces/notification-payload.interface'
import { NotificationHandlerInterface } from '../interfaces/notification-handler.interface'
import * as firebaseAdmin from 'firebase-admin'
import * as serviceAccountKey from '@src/firebase/serviceAccountKey.json'
import { messaging } from 'firebase-admin'

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

    const recipient = payload.to as string
    const messaging = this.firebaseApp.messaging()
    const sendPayload: messaging.Message = {
      token: recipient,
      notification: messageNotificationPayload
    }

    return messaging
      .send(sendPayload)
      .then((response: string) => {
        console.log('sukses kirim push: ', response)
      })
      .catch((error) => {
        console.log('error pas kirim push nih bro:', error)
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
        console.log('sukses kirim push: ', response)
      })
      .catch((error) => {
        console.log('error pas kirim push nih bro:', error)
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
