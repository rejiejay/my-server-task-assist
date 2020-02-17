/**
 * 内存缓存策略
 */
let caching = {
    token: null,
    expired: null
}

export const AuthHandle = {
    get(token: string): boolean {
        if (!caching.token || !caching.expired) return false
        if (new Date().getTime() > caching.expired) return false
        if (token !== caching.token) return false
        return true
    },

    set(token: string, expired: number): object {
        caching.token = token
        caching.expired = expired

        return caching
    },
}