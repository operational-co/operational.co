export default function (example, ctx) {
	const item = example.item;
	let token = ctx.token || "API_KEY";

	let type = item.type ? `\n    "type": "${item.type}",` : "";
	let content = item.content ? `\n    "content": "${item.content}",` : "";
	let notify = item.notify || ctx.notify ? `\n    "notify": True,` : "";
	let actions = item.actions ? `\n    "actions": ${JSON.stringify(item.actions, null, 2)},` : "";

	let str = `import requests
import json

url = "https://api.operational.co/api/v1/ingest"

headers = {
    "Authorization": "Bearer ${token}",
    "Content-Type": "application/json"
}

data = {
    "name": "${item.name}",
    "avatar": "${item.avatar}",${type}${content}${notify}${actions}
}

response = requests.post(url, headers=headers, data=json.dumps(data))

print(response.json())`;

	return str;
}
