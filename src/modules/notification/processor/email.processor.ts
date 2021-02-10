import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor
} from '@nestjs/bull'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { NotificationType } from '@src/modules/notification/services/types/notification-type.enum'
import { Job } from 'bull'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NotificationHandlerInterface } from '../services/interfaces/notification-handler.interface'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NotificationPayload } from '../services/interfaces/notification-payload.interface'
import { NotificationProvider } from '../services/notification.provider'

const jobName = `${NotificationType.EMAIL}-sender`

@Injectable()
@Processor(NotificationType.EMAIL)
export class EmailNotificationProcessor {
  private service: NotificationHandlerInterface
  private readonly logger: Logger = new Logger(EmailNotificationProcessor.name)

  constructor(
    @Inject(NotificationProvider)
    private readonly serviceMapper: Map<
      NotificationType,
      NotificationHandlerInterface
    >
  ) {
    this.service = this.serviceMapper.get(NotificationType.EMAIL)
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of ${job.name}`)
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Completed job ${job.id} of ${job.name}`)
  }

  @OnQueueFailed()
  onFailed(job: Job, error: any) {
    this.logger.error(`Failed job ${job.id} of ${job.name}: ${error.message}`)
  }

  @Process({ name: jobName, concurrency: 5 })
  async sendEmail(job: Job<NotificationPayload>) {
    try {
      const { data } = job
      await this.service.send(data)
      return true
    } catch (error) {
      this.logger.error(error.message)
    }
  }
}
