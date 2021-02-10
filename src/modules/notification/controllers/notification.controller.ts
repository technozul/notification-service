import { InjectQueue } from '@nestjs/bull'
import { Body, Controller, Logger, Post } from '@nestjs/common'
import { Queue } from 'bull'
import { NotificationPayloadWrapper } from '../services/interfaces/notification-payload.interface'
import { NotificationType } from '../services/types/notification-type.enum'

@Controller('send')
export class NotificationController {
  private readonly queueMapper: Map<NotificationType, Queue>
  private readonly logger: Logger = new Logger(NotificationController.name)

  constructor(
    @InjectQueue(NotificationType.EMAIL)
    private readonly emailQueue: Queue,
    @InjectQueue(NotificationType.PUSH)
    private readonly pushQueue: Queue,
    @InjectQueue(NotificationType.SMS)
    private readonly smsQueue: Queue
  ) {
    this.queueMapper = new Map()
    this.queueMapper.set(NotificationType.EMAIL, this.emailQueue)
    this.queueMapper.set(NotificationType.PUSH, this.pushQueue)
    this.queueMapper.set(NotificationType.SMS, this.smsQueue)
  }

  @Post('/')
  async sendToQueue(@Body() { payloads }: NotificationPayloadWrapper) {
    const notificationType = Object.values(NotificationType)
    payloads.forEach(async (p) => {
      try {
        const type = p.type
        if (!notificationType.includes(type)) {
          throw new Error(`Invalid notification type: ${type}`)
        }
        const queue = this.queueMapper.get(type)
        const jobName = `${type}-sender`
        const queueOpts = {
          removeOnComplete: true,
          attempts: 3,
          backoff: 1000
        }
        await queue.add(jobName, p, queueOpts)
      } catch (error) {
        this.logger.error(error.message)
      }
    })
    return { success: 'messages in the queue' }
  }
}
