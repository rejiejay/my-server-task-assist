import { consequencer, Consequencer } from 'src/utils/consequencer';
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
        if (!caching.token || !caching.expired) return consequencer.error(ResultCode.ACCESS_DENIED.description, ResultCode.ACCESS_DENIED.value);
        if (new Date().getTime() > caching.expired) return consequencer.error(ResultCode.ACCESS_DENIED.description, ResultCode.ACCESS_DENIED.value);
        if (token !== caching.token) return consequencer.error(ResultCode.ACCESS_EXPIRED.description, ResultCode.ACCESS_EXPIRED.value);
        return consequencer.success();
    },

    set(token: string, expired: number): object {
        caching.token = token
        caching.expired = expired

        return caching
    },
}