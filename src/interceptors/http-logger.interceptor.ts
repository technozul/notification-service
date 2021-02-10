import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    const req: Request = context.switchToHttp().getRequest()
    const res: Response = context.switchToHttp().getResponse()

    const method = req.method
    const url = req.url
    const timestamp = Date.now()
    const { statusCode } = res

    return next.handle().pipe(
      tap(() => {
        Logger.log(
          `[${statusCode}] ${method} ${url} ${Date.now() - timestamp}ms`,
          context.getClass().name
        )
      })
    )
  }
}
