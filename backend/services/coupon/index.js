import generateCost from "#lib/generate-cost.js";
import config from "#lib/config.js";

class Coupon {
	async setup() {
		return true;
	}

	/**
	 * Whole goal of this fx is to generate a modified cost and line items related to the discount
	 * @param {
	 *  cost : 0,
	 *  eventCount : 0
	 * } params
	 */
	async applyCoupon(coupons, params = { cost: 0, eventCount: 0 }) {
		let lineItems = [];
		for (let i = 0; i < coupons.length; i++) {
			let coupon = coupons[i];

			//await this.parseCoupon(coupon, params);
		}
	}

	// async parseCoupon(coupon, params) {
	// 	let eventCount = params.eventCount;
	// 	if (coupon.name === "10000EVENTSOFF") {
	// 		let newEventQuantity = eventCount - 10000;

	// 		let cost = await generateCost(
	// 			config.prices.eventScales,
	// 			newEventQuantity,
	// 		);
	// 	}
	// }
}

export default new Coupon();
