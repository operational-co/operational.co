export function loadCrisp() {
	window.$crisp = [];
	window.CRISP_WEBSITE_ID = "a5565238-3c96-4cd7-a816-8dd499671bc8";

	const d = document;
	const s = d.createElement("script");
	s.src = "https://client.crisp.chat/l.js";
	s.async = 1;
	d.getElementsByTagName("head")[0].appendChild(s);
}
