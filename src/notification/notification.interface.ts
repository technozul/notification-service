import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export enum NotificationEnum {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms'
}

export interface NotificationInterface {
  to: string | string[]
  message: string
  send(payload: CreateNotificationDTO): void
}

export interface EmailNotificationInterface extends NotificationInterface {
  from: string
  subject: string
  attachments?: any
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PushNotificationInterface extends NotificationInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SMSNotificationInterface extends NotificationInterface {}

export class CreateNotificationDTO {
  @IsString()
  @IsNotEmpty()
  type: NotificationEnum

  @IsString({ each: true })
  @IsNotEmpty()
  to: string | string[]

  @IsString()
  @IsNotEmpty()
  message: string

  @IsString()
  @IsOptional()
  from?: string

  @IsString()
  @IsOptional()
  subject?: string

  @IsString()
  @IsOptional()
  attachments?: any
}
