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
    const messaging = this.firebaseApp.messaging()
    const message: messaging.MulticastMessage = {
      tokens: payload.to,
      data: {
        message: payload.message
      }
    }

    return messaging
      .sendMulticast(message)
      .then((response: messaging.BatchResponse) => {
        console.log('sukses nih: ', response)
      })
      .catch((error) => {
        console.log('error bro:', error)
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
