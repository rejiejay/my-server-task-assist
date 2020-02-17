import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

import { consequencer } from 'src/utils/consequencer';
import { ResultCode } from 'src/config/result-code';

import { AuthHandle } from './auth.handle';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return this.validateRequest(request, response);
    }

    /**
     * 如果返回 true, 将处理用户调用。
     * 如果返回 false, 则 Nest 将忽略当前处理的请求。
     */
    validateRequest(request, response): boolean | Promise<boolean> | Observable<boolean> {
        const { route: { path }, headers } = request

        if (path === '/user/login' || path === '/user/verify') return true

        const token = headers['task-assist-token']
        if (!token || !AuthHandle.get(token)) return response.status(HttpStatus.OK).json(consequencer.error(ResultCode.ACCESS_DENIED.description, ResultCode.ACCESS_DENIED.value));

        return true
    }
}