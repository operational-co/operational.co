import fs from "fs";
import path from "path";

const __dirname = path.resolve("");

class File {
	savePath = "";

	async setup() {
		this.savePath =
			process.env.UPLOADS_DIR || path.join(__dirname, "./public/uploads");

		return true;
	}

	async saveImage(fileName, bufferOrFilePath) {
		let filePath = path.join(this.savePath, fileName);

		try {
			await fs.promises.writeFile(filePath, bufferOrFilePath);
		} catch (err) {
			throw err;
		}

		return filePath;
	}
}

export default new File();
