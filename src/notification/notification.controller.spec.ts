import { Test, TestingModule } from '@nestjs/testing'
import { NotificationController } from './notification.controller'

describe('NotificationController', () => {
  let controller: NotificationController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: []
    }).compile()

    controller = module.get<NotificationController>(NotificationController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
