import awsSdk from 'aws-sdk';
import config from 'config';
import fs from 'fs';

export const fileExistsOnAWSS3 = async (bucketName: string, fileName: string): Promise<boolean> => {
  const AWS_ACCESS_KEY_ID: string = config.get('aws.accessKeyId');
  const AWS_SECRET_ACCESS_KEY: string = config.get('aws.secretKey');

  awsSdk.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });
  const s3 = new awsSdk.S3();
  const params = { Bucket: bucketName, Key: fileName };

  const exists: boolean = await new Promise((resolve, reject) => {
    try {
      s3.headObject(params, (err) => {
        if (err && err.code === 'NotFound') {
          return resolve(false);
        }
        if (err) {
          return reject(err);
        }
        return resolve(true);
      });
    } catch (err) {
      return reject(err);
    }
  });

  return Promise.resolve(exists);
};

export const downloadFileFromAWSS3 = async (bucketName: string, fileName: string, localFilePath: string) => {
  const AWS_ACCESS_KEY_ID: string = config.get('aws.accessKeyId');
  const AWS_SECRET_ACCESS_KEY: string = config.get('aws.secretKey');

  awsSdk.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });
  const s3 = new awsSdk.S3();
  const params = { Bucket: bucketName, Key: fileName };

  await new Promise((resolve, reject) => {
    try {
      s3.getObject(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        fs.writeFileSync(localFilePath, data.Body.toString());
        return resolve(data);
      });
    } catch (err) {
      return reject(err);
    }
  });

  return;
};

export const writeFileOnAWSS3 = async (data: string, bucketName: string, fileName: string) => {
  // const AWS_ACCESS_KEY_ID: string = config.get('aws.accessKeyId');
  // const AWS_SECRET_ACCESS_KEY: string = config.get('aws.secretKey');

  // awsSdk.config.update({
  //   accessKeyId: AWS_ACCESS_KEY_ID,
  //   secretAccessKey: AWS_SECRET_ACCESS_KEY
  // });
  // const s3 = new awsSdk.S3();

  // await new Promise((resolve, reject) => {
  //   try {
  //     s3.createBucket({ Bucket: bucketName }, (err) => {
  //       if (err) {
  //         return reject(err);
  //       }

  //       s3.upload(
  //         {
  //           Bucket: bucketName,
  //           Key: fileName,
  //           Body: data,
  //           ACL: 'public-read'
  //         },
  //         (writeS3FileErr, result) => {
  //           if (writeS3FileErr) {
  //             return reject(writeS3FileErr);
  //           }
  //           return resolve(result);
  //         }
  //       );
  //     });
  //   } catch (err) {
  //     return reject(err);
  //   }
  // });

  return;
};
