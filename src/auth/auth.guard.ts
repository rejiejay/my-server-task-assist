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
        if (!token) {
            console.log('未授权（请求不存在凭证(token)）, 拒绝本次访问; 同时指示UI执行授权流程\n')
            return response.status(HttpStatus.OK).json(consequencer.error(ResultCode.ACCESS_DENIED_UI.description, ResultCode.ACCESS_DENIED_UI.value));
        }
        const auth = AuthHandle.get(token)
        if (auth.result !== 1) {
            console.log('请求凭证(token)发生错误, 拒绝本次访问; 同时指示UI执行授权流程\n')
            return response.status(HttpStatus.OK).json(auth);
        }

        return true
    }
}