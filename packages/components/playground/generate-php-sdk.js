export default function (example, ctx) {
  const item = example.item;
  let test = ctx.test || false;
  let notify = ctx.notify || false;
  let token = ctx.token || "API_KEY";
  let baseUrl = ctx.baseUrl;

  let type = item.type ? `\n  "type" => "${item.type}",` : "";
  let content = item.content ? `\n  "content" => "${item.content}",` : "";
  test = test ? `\n  "test" => true,` : "";
  notify = notify ? `\n  "notify" => true,` : "";
  let actions = item.actions ? `\n  "actions" => ${JSON.stringify(item.actions, null, 2).replace(/\"/g, "'")},` : "";

  let phpCode = `// Remember to setup the PHP SDK https://operational.co/integrations/php-sdk 

$payload = [
  "name" => "${item.name}",
  "avatar" => "${item.avatar}",${test}${notify}${type}${content}${actions}
];

$client->ingest($payload);`;

  return phpCode;
}
