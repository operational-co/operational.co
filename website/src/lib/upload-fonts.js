import axios from "axios";

const uploadFonts = async (form) => {
	let baseUrl = import.meta.env.PUBLIC_BASEURL;
	let url = `${baseUrl}/api/v1/upload-fonts`;

	try {
		const response = await axios.post(url, form, {
			responseType: "blob"
		});

		// Create a blob from the response data
		const blob = new Blob([response.data], { type: "application/zip" });

		// Create a URL for the blob
		const blobUrl = URL.createObjectURL(blob);

		// Create a temporary link element to trigger the download
		const a = document.createElement("a");
		a.href = blobUrl;
		a.download = "fonts.zip"; // Specify the name of the file to be downloaded

		// Append the link to the document body and trigger a click event
		document.body.appendChild(a);
		a.click();

		// Clean up: remove the link and revoke the blob URL
		document.body.removeChild(a);
		URL.revokeObjectURL(blobUrl);

		console.log(response);
		return response.data;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export default uploadFonts;
