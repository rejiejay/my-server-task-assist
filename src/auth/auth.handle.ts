import { consequencer, Consequencer } from 'src/utils/consequencer';
import { dateToYYYYmmDDhhMMss } from 'src/utils/time-transformers';
import { ResultCode } from 'src/config/result-code';

/**
 * 内存缓存策略
 */
let caching = {
    token: null,
    expired: null
}

export const AuthHandle = {
    get(token: string): Consequencer {
        if (!caching.token || !caching.expired) {
            console.log('内存未缓存凭证(token), 拒绝这次获取;');
            return consequencer.error(ResultCode.ACCESS_DENIED_SERVER.description, ResultCode.ACCESS_DENIED_SERVER.value);
        }
        if (new Date().getTime() > caching.expired) {
            console.log('内存凭证(token)已经过期, 拒绝这次获取;');
            return consequencer.error(ResultCode.ACCESS_EXPIRED.description, ResultCode.ACCESS_EXPIRED.value);
        }
        if (token !== caching.token) {
            console.log(`内存凭证(token: ${caching.token})凭证与请求凭证(token: ${token})匹配失败, 拒绝这次获取;`);
            return consequencer.error(ResultCode.ACCESS_VERIFY_FAILED.description, ResultCode.ACCESS_VERIFY_FAILED.value);
        }
        return consequencer.success();
    },

    set(token: string, expired: number): object {
        console.log(`设置凭证${token}过期时间${dateToYYYYmmDDhhMMss(new Date(+expired))}\n`);
        caching.token = token
        caching.expired = expired

        return caching
    },
}