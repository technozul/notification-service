import { NotificationType } from '../types/notification-type.enum'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
export class NotificationPayload {
  @IsNotEmpty()
  @IsString()
  type: NotificationType

  @IsNotEmpty()
  @IsString({ each: true })
  to: string | string[]

  @IsNotEmpty()
  @IsString()
  message: string

  @IsOptional()
  @IsString()
  subject?: string

  @IsOptional()
  @IsString()
  templateId?: string
}

export class NotificationPayloadWrapper {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationPayload)
  payload: NotificationPayload[]
}
