import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import config from "#lib/config.js";
import fs from "fs/promises";
import path from "path";

const __dirname = path.resolve("");

class Storage {
  s3;
  bucketName;
  type = "local";

  // Default local path if not set manually
  localUploadPath = path.join(__dirname, "/public");

  constructor() {
    if (config.s3.ACCESS_KEY_ID && config.s3.SECRET_ACCESS_KEY && config.s3.BUCKET) {
      this.type = "s3";
      this.bucketName = config.s3.BUCKET;
    }
  }

  async setup() {
    if (this.type === "s3") {
      this.s3 = new S3Client({
        region: config.s3.REGION || "auto",
        endpoint: config.s3.ENDPOINT || undefined,
        credentials: {
          accessKeyId: config.s3.ACCESS_KEY_ID,
          secretAccessKey: config.s3.SECRET_ACCESS_KEY,
        },
      });
    }
  }

  async test() {
    let status = "active";
    let type = null;
    let info = `Not set. Push notifications won't work`;
    if (this.type === "local") {
      type = "local";
      info = `Files will be stored on the server at ${this.localUploadPath}`;
    } else {
      type = "s3";
      info = `Files will be stored inside s3 OR s3 compatible storage. Bucket name is ${this.bucketName}`;
    }

    return {
      name: "storage",
      value: type,
      status: status,
      info: info,
    };
  }

  /**
   * Uploads a file to storage.
   *
   * @param {string|Buffer} fileInput - Either a filePath (string) or a fileBuffer (Buffer)
   * @param {string} key - Destination key or filename
   */
  async upload(fileInput, key, prefix = "") {
    let destinationPath;
    let fileContent;

    if (Buffer.isBuffer(fileInput)) {
      // fileInput is a Buffer
      fileContent = fileInput;
    } else if (typeof fileInput === "string") {
      // fileInput is a filepath
      fileContent = await fs.readFile(fileInput);
    } else {
      throw new Error("Invalid file input: must be a file path string or a Buffer.");
    }

    if (this.type === "s3") {
      // Upload to S3
      if (prefix) {
        key = `${prefix}/${key}`;
      }
      try {
        const params = {
          Bucket: this.bucketName,
          Key: key,
          Body: fileContent,
        };

        const data = await this.s3.send(new PutObjectCommand(params));
        console.log("File uploaded to S3 successfully", data);

        destinationPath = key;

        return destinationPath;
      } catch (err) {
        console.error("Error uploading file to S3", err);
        throw err;
      }
    } else {
      // Save locally
      try {
        destinationPath = path.join(this.localUploadPath, prefix, key);

        console.log(destinationPath);

        // Ensure destination directory exists
        await fs.mkdir(path.dirname(destinationPath), { recursive: true });

        await fs.writeFile(destinationPath, fileContent);

        console.log("File saved locally at", destinationPath);

        return destinationPath;
      } catch (err) {
        console.error("Error saving file locally", err);
        throw err;
      }
    }
  }

  async deleteFile(keyOrPath, prefix = "") {
    if (this.type === "s3") {
      // Delete from S3
      try {
        if (prefix) {
          keyOrPath = `${prefix}/${keyOrPath}`;
        }
        const params = {
          Bucket: this.bucketName,
          Key: keyOrPath,
        };

        const data = await this.s3.send(new DeleteObjectCommand(params));
        console.log(`File deleted from S3: ${keyOrPath}`, data);

        return true;
      } catch (err) {
        console.error(`Error deleting file from S3: ${keyOrPath}`, err);
        throw err;
      }
    } else {
      // Delete from local filesystem
      const filePath = path.join(this.localUploadPath, prefix, keyOrPath);
      try {
        await fs.unlink(filePath);
        console.log(`File deleted locally: ${filePath}`);

        return true;
      } catch (err) {
        console.error(`Error deleting local file: ${filePath}`, err);
        throw err;
      }
    }
  }
}

export default new Storage();
