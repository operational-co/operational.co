const humanizeNumber = function (number) {
	// Convert number to string
	let strNumber = number.toString();

	// Use regex to add commas every three digits
	strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	return strNumber;
};

export default humanizeNumber;
