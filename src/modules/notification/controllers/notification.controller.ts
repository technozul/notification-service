import { Controller, Post, Request } from '@nestjs/common'

@Controller('notification')
export class NotificationController {
  @Post('/')
  send(@Request() request: Express.Request) {
    console.log('request', request)
  }
}
