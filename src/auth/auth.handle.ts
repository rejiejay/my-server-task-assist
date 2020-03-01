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
            console.log('内存未缓存token凭证, 拒绝这次获取');
            return consequencer.error(ResultCode.ACCESS_DENIED.description, ResultCode.ACCESS_DENIED.value);
        }
        if (new Date().getTime() > caching.expired) {
            console.log('内存token凭证已经过期, 拒绝这次获取');
            return consequencer.error(ResultCode.ACCESS_DENIED.description, ResultCode.ACCESS_DENIED.value);
        }
        if (token !== caching.token) {
            console.log('内存token凭证与请求凭证, 拒绝这次获取');
            return consequencer.error(ResultCode.ACCESS_EXPIRED.description, ResultCode.ACCESS_EXPIRED.value);
        }
        return consequencer.success();
    },

    set(token: string, expired: number): object {
        console.log(`设置凭证${token}过期时间${dateToYYYYmmDDhhMMss(new Date(+expired))}`);
        caching.token = token
        caching.expired = expired

        return caching
    },
}