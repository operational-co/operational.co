const padString = function (str, targetLength = 7) {
	const currentLength = str.length; // Current length of the string

	// If the string is shorter than the target length, pad it with spaces
	if (currentLength < targetLength) {
		return str + " ".repeat(targetLength - currentLength);
	}

	return str; // Return the original string if it's already long enough
};

const formatLog = function (method, path, statusCode, duration) {
	method = padString(method);
	path = padString(path, 20);
	if (process.env.NODE_ENV === "production") {
		console.debug(`${method} ${path} ${statusCode} - ${duration}ms`);
	} else {
		// ANSI escape codes for colors
		const methodColor = "\x1b[36m"; // Cyan for method
		const durationColor = "\x1b[32m"; // Green for duration
		const resetColor = "\x1b[0m"; // Reset to default color

		console.debug(
			`${methodColor}${method}${resetColor} ${path} ${statusCode} - ${durationColor}${duration + "ms"}${resetColor}`,
		);
	}
};

const loggerMiddleware = (req, res, next) => {
	const start = Date.now(); // Start time
	const { method, path } = req; // Get method and path

	// Hook into the response 'finish' event to capture the status code and execution time
	res.on("finish", () => {
		const duration = Date.now() - start; // Calculate execution time
		const statusCode = res.statusCode; // Get the status code

		// Log the details
		formatLog(method, path, statusCode, duration);
	});

	next(); // Proceed to the next middleware/route handler
};

export default loggerMiddleware;
