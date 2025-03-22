async function generateCost(scales, count) {
	/*
  prices = [
    {
      rate: 0.001,
      period: [0, 10000],
    },
    {
      rate: 0.0005,
      period: [10001, 100000],
    },
    {
      rate: 0.00025,
      period: [100001, 1000000],
    },
  ];
  */

	//let count = 19000;
	let cost = 0;

	for (let i = 0; i < scales.length; i++) {
		let scale = scales[i];
		let [periodStart, periodEnd] = scale.period;

		let temp = periodEnd - count;

		if (temp <= 0) {
			temp = periodEnd - periodStart;
		} else {
			temp = count - periodStart;
		}

		cost = cost + temp * scale.rate;

		if (count <= periodEnd) {
			break;
		}
	}

	cost = cost.toFixed(1);

	return cost;
}

export default generateCost;
