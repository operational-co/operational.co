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

  if (notify) {
    notify = `\n  notify: true,`;
  } else {
    notify = ``;
  }

  if (test) {
    test = `\n  test: true,`;
  } else {
    test = ``;
  }

  let actions = "";

  if (item.actions) {
    actions = `\n  actions: ${JSON.stringify(item.actions, null, 2)}`;
  }

  let str = `const url =  "${baseUrl}/api/v1/ingest";
const form = {
  name: "${item.name}",
  avatar: "${item.avatar}",${test}${notify}${type}${content}${actions}
}
const config = {
  headers: {
    Authorization : "Bearer ${token}"
  }
}

try {
  await axios.post(url, form, config);
} catch(err) {
  console.log(err);
}`;

  return str;
}
