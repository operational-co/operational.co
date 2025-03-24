export default [
	/**
	 * User based events
	 */
	{
		title: "User signup",
		description: `Get User details on signup. Useful for figuring out who signed up, what are their details, are they using correct
			details, etc.`,
		item: {
			avatar: "🤗",
			name: "user signup",
			category: "user",
			content: "User Shash signed up. Their email is xyz@ggwp.com and their id is 269221"
		}
	},
	{
		title: "User signup(expanded)",
		description: `Get User details on signup, and add action buttons. This is for controlling your signup process.`,
		item: {
			avatar: "🤗",
			name: "user signup",
			actions: [
				{
					key: "ban-user",
					url: "https://ggwp.com",
					buttonText: "Ban"
				}
			]
		}
	},
	{
		title: "User login",
		description: `Show basic user details.`,
		item: {
			avatar: "😊",
			name: "user login"
		}
	},
	{
		title: "User updated their profile",
		item: {
			avatar: "📝",
			name: "user updated profile"
		}
	},
	{
		title: "User onboarded",
		item: {
			avatar: "🥳",
			name: "user onboarded"
		}
	},
	{
		title: "User entered payment details",
		item: {
			avatar: "🤩",
			name: "user entered payment details"
		}
	},

	/**
	 * Billing events
	 */
	{
		title: "Payment received",
		description: "Get notified when someone pays you",
		category: ["generic", "saas"],
		item: {
			avatar: "💸",
			name: "payment received",
			category: "billing"
		}
	},
	{
		title: "stripe: webhook received",
		description: "Get notified when a stripe webhook is received",
		category: ["generic", "saas", "stripe"],
		item: {
			avatar: "🕸️",
			name: "stripe: webhook received",
			category: "billing"
		}
	},
	{
		title: "stripe: early fraud warning",
		category: ["stripe", "stripe"],
		item: {
			avatar: "🚨",
			name: "stripe early fraud warning",
			category: "stripe",
			type: "json",
			content: {
				id: "issfr_1NnrwHBw2dPENLoi9lnhV3RQ",
				object: "radar.early_fraud_warning",
				actionable: true,
				charge: "ch_1234",
				created: 123456789,
				fraud_type: "misc",
				livemode: false
			}
		}
	},

	{
		title: "server started",
		description: "Get notified when your server starts, or restarts",
		category: ["generic", "saas", "dev"],
		item: {
			avatar: "🤖",
			name: "server started",
			category: "server"
		}
	},
	{
		title: "database error",
		description: "Get notified when your serer is unresponsive",
		category: ["generic", "dev", "error"],
		item: {
			avatar: "🚨",
			name: "database error",
			category: "server"
		}
	},

	/**
	 * Ecom
	 */
	{
		title: "Product added to cart",
		category: "ecom",
		item: {
			avatar: "🛒",
			name: "product added to cart",
			content: "user xyz(abc@gmail.com) added pqr product to their cart!"
		}
	},
	{
		title: "Product purchased",
		category: "ecom",
		item: {
			avatar: "🥳",
			name: "product purchased",
			content: "user xyz(abc@gmail.com) purchased pqr product!"
		}
	},
	{
		title: "Product purchased(expanded)",
		category: "ecom",
		item: {
			avatar: "🥳",
			name: "product purchased",
			type: "rows",
			content: [
				{
					type: "image",
					content:
						"https://www.lego.com/cdn/cs/set/assets/blt06c6593d8e8d1c13/75367.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2"
				},
				{
					label: "User email",
					content: "shash@operational.co"
				},
				{
					label: "User Id",
					content: 1327
				},
				{
					label: "Product",
					content: "Lego starwars venetar class ship"
				},
				{
					label: "Product details",
					type: "json",
					content: {
						fullName: "",
						purchasePrice: "$999.99",
						sku: 75367,
						url: "https://www.lego.com/en-au/product/venator-class-republic-attack-cruiser-75367"
					}
				},
				{
					label: "Billing details",
					type: "json",
					content: {
						cardLast4: "5420-xxxx-xxxx-xxxx",
						biller: "stripe",
						deliveryType: "free",
						transcationId: "934512741252"
					}
				}
			]
		}
	},

	/**
	 * Other
	 */
	{
		title: "Waitlist user added",
		category: ["generic"],
		item: {
			avatar: "✅",
			name: "waitlist user added"
		}
	},
	{
		title: "Cronjob ran",
		category: "cron",
		item: {
			avatar: "🤖",
			name: "cronjob ran"
		}
	},
	{
		title: "Email sending failed",
		category: "server",
		item: {
			avatar: "🚨",
			name: "email sending failed"
		}
	},
	{
		title: "Contact form submitted",
		item: {
			avatar: "📋",
			name: "contact form submitted"
		}
	}
];
