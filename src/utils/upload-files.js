import axios from 'axios';
import { request } from './request';
import { randomString } from './random';

/**
 * 上传文件
 *
 * @param  {String|String[]}  tempFilePaths  本地文件地址
 * @param  {String}  type     文件类型，默认是 image，上传视频时传 video
 *
 * @return {Promise<Object[]>}
 */
export function uploadFiles(tempFilePaths, type = 'image') {
  const results = [].concat(tempFilePaths).map(async path => {
    const fileInfo = await uni.getFileInfo({ filePath: path });

    let extname = type === 'image' ? 'jpeg' : 'mp4';
    if (/\./.test(path)) {
      extname = path.split('.').pop();
    }
    const filename = `${randomString()}.${extname}`;
    const params = {
      hex_digest: fileInfo.digest,
      filename,
      byte_size: fileInfo.size,
      content_type: `${type}/${extname}`,
    };

    // 获取签名相关
    const { data: { direct_upload, ...blob } } = await request.post('/active_storage/direct_upload', params);

    // 获取文件Binary
    const fileSystemManager = uni.getFileSystemManager();
    const fileBinary = fileSystemManager.readFileSync(path);

    // 上传到 oss
    // Todo 目前只验证了阿里云，七牛和 S3 是否适用还得等实际项目测试
    await request.put(direct_upload.url, fileBinary, { headers: direct_upload.headers });

    return {
      ...blob,
      url: direct_upload.url,
    };
  });

  return Promise.all(results);
}

// #ifdef H5
// 传递 input onchange 事件获取到的文件列表，例如 uploadFilesWithInput([...e.target.files])
export function uploadFilesWithInput(files) {
  const results = [].concat(files).map(async file => {
    const body = {
      filename: file.name,
      content_type: file.type || 'application/octet-stream',
      byte_size: file.size,
      hex_digest: await require('./file-checksum').createChecksum(file),
    };

    // 获取签名相关
    const { data: { direct_upload, ...blob } } = await request.post('/active_storage/direct_upload', body);

    // 上传到 oss
    await axios.put(direct_upload.url, file.slice(), { headers: direct_upload.headers });

    return {
      ...blob,
      url: direct_upload.url,
    };
  });

  return Promise.all(results);
}
// #endif
