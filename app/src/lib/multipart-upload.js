async function multipartUploadData(obj, http, method, url) {
	let isFile = false;
	let res = null;
	let config = {
		headers: {},
	};

	// Loop through the object keys
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];

			// Check if the value is of type File
			if (value instanceof File) {
				isFile = true;
			}
		}
	}

	if (!isFile) {
		try {
			res = await http[method](url, obj, config);
		} catch (err) {
			throw err;
		}

		return res;
	}

	const formData = new FormData();

	// Loop through the object keys
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];

			// Check if the value is of type File
			if (value instanceof File) {
				formData.append(key, value); // Add the File to FormData
			} else if (typeof value === "object" && value !== null) {
				// If the value is an object, you can further process it
				// If needed, you can convert nested objects as well
				formData.append(key, JSON.stringify(value)); // Optionally stringify the object
			} else {
				formData.append(key, value); // Add other values directly
			}
		}
	}

	config.headers = {
		"Content-Type": "multipart/form-data",
	};

	try {
		res = await http[method](url, formData, config);
	} catch (err) {
		throw err;
	}

	return res;
}

export default multipartUploadData;
