export default function (example, ctx) {
  const item = example.item;
  let test = ctx.test || false;
  let notify = ctx.notify || false;
  let token = ctx.token || "API_KEY";
  let baseUrl = ctx.baseUrl;

  let type = "";

  if (item.type) {
    type = `\n  type: "${item.type}",`;
  }

  let content = "";
  if (item.content) {
    content = `\n  content: "${item.content}",`;
  }

  if (item.notify || ctx.notify) {
    notify = `\n  notify: true,`;
  } else {
    notify = ``;
  }

  if (item.test || ctx.test) {
    test = `\n  test: true,`;
  } else {
    test = ``;
  }

  let actions = "";

  if (item.actions) {
    actions = `\n  actions: ${JSON.stringify(item.actions, null, 2)}`;
  }

  let str = `const url = "${baseUrl}/api/v1/ingest";
const event = {
  name: "${item.name}",
  avatar: "${item.avatar}",${test}${notify}${type}${content}${actions}
}

const headers = {
  "Authorization": "Bearer ${token}",
  "Content-Type": "application/json"
};

const response = await fetch(url, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(event)
}).catch((err) => {});`;

  return str;
}
