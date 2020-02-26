const COS = require('cos-nodejs-sdk-v5');
import { Readable } from 'stream'

import { ossConfig } from 'src/config/tencent-oss'

const mountInstance = new COS({
    SecretId: ossConfig.secretId,
    SecretKey: ossConfig.secretKey
})

export const oss = mountInstance

/**
 * 含义: 重写 stream Readable 的类
 * 目的: 根据字符串创建一个可读流
 */
class CreateReadStreamByString extends Readable {
    myString = ''

    constructor(str: string) {
        super({ encoding: 'utf8' });
        this.myString = str;
    }

    /**
     * 意义: 重写方法
     */
    _read() {
        this.push(this.myString);
        /** 含义: 触发 end 事件 */
        this.push(null);
    }
}

export const uploadByStr = ({ str, path }) => new Promise((resolve, reject) => {
    mountInstance.putObject({
        Bucket: ossConfig.bucket,
        Region: ossConfig.region,
        Key: path,
        Body: new CreateReadStreamByString(str),
    }, function (err, data, ETag) {
        if (err) return reject(err);
        resolve(data);
    });
})
