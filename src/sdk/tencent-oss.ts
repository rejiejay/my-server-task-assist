const COS = require('cos-nodejs-sdk-v5');
const STS = require('qcloud-cos-sts');
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

export const getCredential = () => new Promise((resolve, reject) => {
    var policy = {
        'version': '2.0',
        'statement': [{
            'action': [
                // 简单上传
                'name/cos:PutObject',
                'name/cos:PostObject',
                // 分片上传
                'name/cos:InitiateMultipartUpload',
                'name/cos:ListMultipartUploads',
                'name/cos:ListParts',
                'name/cos:UploadPart',
                'name/cos:CompleteMultipartUpload',
            ],
            'effect': 'allow',
            'principal': {'qcs': ['*']},
            'resource': [
                `qcs::cos:${ossConfig.region}:uid/${ossConfig.appId}:prefix//${ossConfig.appId}/${ossConfig.bucket.substr(0 , ossConfig.bucket.lastIndexOf('-'))}/myweb/task-assist/temporary/*`
            ],
        }],
    };

    STS.getCredential({
        secretId: ossConfig.secretId,
        secretKey: ossConfig.secretKey,
        policy: policy,
    }, function (err, credential) {
        if (err) return reject(err);
        resolve(credential); /** {"credentials":{"tmpSecretId":"AKIDEPMQB_Q9Jt2fJxXyIekOzKZzx-sdGQgBga4TzsUdTWL9xlvsjInOHhCYFqfoKOY4","tmpSecretKey":"W/3Lbl1YEW02mCoawIesl5kNehSskrSbp1cT1tgW70g=","sessionToken":"c6xnSYAxyFbX8Y50627y9AA79u6Qfucw6924760b61588b79fea4c277b01ba157UVdr_10Y30bdpYtO8CXedYZe3KKZ_DyzaPiSFfNAcbr2MTfAgwJe-dhYhfyLMkeCqWyTNF-rOdOb0rp4Gto7p4yQAKuIPhQhuDd77gcAyGakC2WXHVd6ZuVaYIXBizZxqIHAf4lPiLHa6SZejSQfa_p5Ip2U1cAdkEionKbrX97xTKTcA_5Pu525CFSzHZIQibc2uNMZ-IRdQp12MaXZB6bxM6nB4xXH45mDIlbIGjaAsrtRJJ3csmf82uBKaJrYQoguAjBepMH91WcH87LlW9Ya3emNfVX7NMRRf64riYd_vomGF0TLgan9smEKAOdtaL94IkLvVJdhLqpvjBjp_4JCdqwlFAixaTzGJHdJzpGWOh0mQ6jDegAWgRYTrJvc5caYTz7Vphl8XoX5wHKKESUn_vqyTAid32t0vNYE034FIelxYT6VXuetYD_mvPfbHVDIXaFt7e_O8hRLkFwrdAIVaUml1mRPvccv2qOWSXs"},"expiration":"2019-08-07T08:54:35Z","startTime":1565166275,"expiredTime":1565168075} */
    });
})
