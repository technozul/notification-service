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
    if (Array.isArray(payload.to)) {
      return this.sendBulk(payload)
    }

    const recipient = payload.to as string
    const messaging = this.firebaseApp.messaging()
    const message: messaging.Message = {
      token: recipient,
      notification: {
        title: payload.subject,
        body: payload.message
      }
    }

    return messaging
      .send(message)
      .then((response: string) => {
        console.log('sukses kirim push: ', response)
      })
      .catch((error) => {
        console.log('error pas kirim push nih bro:', error)
      })
  }

  async sendBulk(payload: NotificationPayload) {
    const recipient = payload.to as string[]
    const messaging = this.firebaseApp.messaging()
    const message: messaging.MulticastMessage = {
      tokens: recipient,
      data: {
        message: payload.message
      }
    }

    return messaging
      .sendMulticast(message)
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
      credential
    })
    this.firebaseApp = app
  }
}
