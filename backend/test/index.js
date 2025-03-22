import Saas from "./generator.js";

function getWeightedRandom(weights) {
	// Calculate the total weight
	const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

	// Generate a random number between 0 and the total weight
	const random = Math.random() * totalWeight;

	// Determine which weight range the random number falls into
	let cumulativeWeight = 0;
	for (let i = 0; i < weights.length; i++) {
		cumulativeWeight += weights[i];
		if (random < cumulativeWeight) {
			return i; // Return the index of the selected weight
		}
	}
}

function countInstances(arr) {
	const counts = {};
	for (const item of arr) {
		counts[item] = (counts[item] || 0) + 1;
	}
	return counts;
}

// Represents a user inside Operational
class Test {
	saas = null;

	constructor(user = {}) {
		console.log(`[User registered] ${user.email} ${user.apikey}`);

		this.saas = new Saas(user);
	}
}

export default Test;
