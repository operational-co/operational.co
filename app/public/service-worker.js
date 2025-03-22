// Listen for incoming push notifications
self.addEventListener("push", (event) => {
	let data = event.data ? event.data.text() : "No payload";

	let body = "";

	try {
		data = JSON.parse(data);
	} catch (err) {
		data = {
			message: data,
		};
	}

	if (data) {
		body = data.message;
	}

	const title = "Ops";
	const options = {
		body: body, //event.data ? event.data.text() : "No payload",
		icon: "/favicons/android-chrome-192x192.png", // Add a small icon image in your public directory
		badge: "/favicons/android-chrome-192x192.png", // Add a badge image in your public directory
		actions: [
			{
				action: "view",
				title: "View",
			},
		],
	};

	self.registration.showNotification(title, options);
});

// Optional: Listen for the pushsubscriptionchange event
self.addEventListener("pushsubscriptionchange", (event) => {
	console.log("[Service Worker] Subscription change event received.");

	// Handle subscription update logic here
	// Typically, you would send the new subscription details to your server
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	let data = event.data ? event.data.text() : "No payload";

	try {
		data = JSON.parse(data);
	} catch (err) {
		data = "";
	}

	// if (data) {
	// 	self.postMessage(data);
	// }
});

self.addEventListener("fetch", (e) => {
	e.respondWith(
		fetch(e.request).catch(() => {
			return caches.match("/offline.html"); // This should be your offline page URL
		}),
	);
});
