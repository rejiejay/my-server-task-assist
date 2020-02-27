const COS = require('cos-nodejs-sdk-v5');
import { PassThrough } from 'stream'

import { ossConfig } from 'src/config/tencent-oss'

const mountInstance = new COS({
    SecretId: ossConfig.secretId,
    SecretKey: ossConfig.secretKey
})

export const oss = mountInstance

/**
 * 含义: 通过 Buffer 创建 可读流
 */
const buffertoReadStream = (str: string, encoding) => {
    const bufferStream = new PassThrough();
    bufferStream.end(Buffer.from(str, encoding ? encoding : 'utf8'));

    return bufferStream
}

export const uploadByStr = ({ str, path, encoding }) => new Promise((resolve, reject) => {
    mountInstance.putObject({
        Bucket: ossConfig.bucket,
        Region: ossConfig.region,
        Key: path,
        Body: buffertoReadStream(str, encoding),
    }, function (err, data, ETag) {
        if (err) return reject(err);
        resolve(data);
    });
})

export const getUploadInfor = path => new Promise((resolve, reject) => {
    mountInstance.headObject({
        Bucket: ossConfig.bucket,
        Region: ossConfig.region,
        Key: path
    }, function (err, data) {
        if (err) return reject(err);
        resolve(data); /** {"statusCode":200,"headers":{"content-type":"image/png","content-length":"3","connection":"keep-alive","date":"Wed, 26 Feb 2020 13:17:42 GMT","etag":"\"a77b3598941cb803eac0fcdafe44fac9\"","last-modified":"Wed, 26 Feb 2020 13:17:25 GMT","server":"tencent-cos","x-cos-request-id":"NWU1NjZmZjZfYzhiYjk0MGFfN2IwZF9jYTYwYjk="},"ETag":"\"a77b3598941cb803eac0fcdafe44fac9\""} */
    });
})

export const pullCopyUpload = ({ oldPath, newPath }) => new Promise((resolve, reject) => {
    mountInstance.putObjectCopy({
        Bucket: ossConfig.bucket,
        Region: ossConfig.region,
        Key: newPath,
        CopySource: `${ossConfig.copySource}${oldPath}`
    }, function (err, data) {
        if (err) return reject(err);
        resolve(data); /** {"ETag":"\"a77b3598941cb803eac0fcdafe44fac9\"","LastModified":"2020-02-26T13:30:57Z","statusCode":200,"headers":{"content-type":"application/xml","transfer-encoding":"chunked","connection":"keep-alive","date":"Wed, 26 Feb 2020 13:30:57 GMT","server":"tencent-cos","x-cos-request-id":"NWU1NjczMTFfYjJjMjgwOV9kYjE2X2JlMmRmZg=="}} */
    });
})

export const pullDeleteUpload = path => new Promise((resolve, reject) => {
    mountInstance.deleteObject({
        Bucket: ossConfig.bucket,
        Region: ossConfig.region,
        Key: path
    }, function (err, data) {
        if (err) return reject(err);
        resolve(data); /** {"statusCode":204,"headers":{"connection":"keep-alive","date":"Wed, 26 Feb 2020 13:33:38 GMT","server":"tencent-cos","x-cos-request-id":"NWU1NjczYjJfZmIyYjI4MDlfNDVhN19jZDIyZWY="}} */
    });
})
