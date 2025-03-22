<template>
	<div class="c-app-pwa">
		<h3>Set up PWA mode on your device({{ type }})</h3>
		<ol>
			<li>Click on the expand button in the middle of safari.</li>
			<li>Click on "Add to home screen".</li>
			<li>Click on "Done" in the next screen.</li>
		</ol>
		<p>
			After doing these steps, the Operational app icon will show up in your
			homescreen.
		</p>
	</div>
</template>

<script>
import UAParser from "@/lib/ua-parser.js";

export default {
	data: function () {
		return {
			browser: "",

			type: "",
		};
	},

	mounted: function () {
		const parser = new UAParser(navigator.userAgent);

		const data = parser.getResult();

		//console.log(data);

		this.browser = data.browser.name;

		if (data.browser.name === "Mobile Safari" && data.os.name === "iOS") {
			this.type = "iOS";
		}
	},
};
</script>

<style lang="scss">
.c-app-pwa {
}
</style>
