export default function (example, ctx) {
  const item = example.item;
  let token = ctx.token || "API_KEY";

  let type = item.type ? `\n    "type" => "${item.type}",` : "";
  let content = item.content ? `\n    "content" => "${item.content}",` : "";
  let notify = item.notify || ctx.notify ? `\n    "notify" => true,` : "";
  let actions = item.actions ? `\n    "actions" => ${JSON.stringify(item.actions, null, 2).replace(/\"/g, "'")},` : "";

  let phpCode = `<?php

$url = "https://api.operational.co/api/v1/ingest";

$data = [
  "name" => "${item.name}",
  "avatar" => "${item.avatar}",${type}${content}${notify}${actions}
];

$headers = [
  "Authorization: Bearer ${token}",
  "Content-Type: application/json"
];

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
`;

  return phpCode;
}
