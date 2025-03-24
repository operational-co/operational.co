import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
//import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "#lib/config.js";

import fs from "fs/promises";

class Storage {
  s3;
  bucketName = config.cloudflare.BUCKET_NAME;

  async setup() {
    this.s3 = new S3Client({
      region: "auto",
      endpoint: `https://${config.cloudflare.ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.cloudflare.ACCESS_KEY_ID,
        secretAccessKey: config.cloudflare.SECRET_ACCESS_KEY,
      },
    });
  }

  async upload(filePath, key) {
    let bucketName = this.bucketName;
    try {
      // Read content from the file
      const fileContent = await fs.readFile(filePath);

      // Setting up S3 upload parameters
      const params = {
        Bucket: bucketName,
        Key: key, // File name you want to save as in S3
        Body: fileContent,
      };

      const data = await this.s3.send(new PutObjectCommand(params));
      console.log("File uploaded successfully", data);

      return true;
    } catch (err) {
      console.log("Error uploading file", err);

      throw err;
    }
  }
}

export default new Storage();
