export default function (example, ctx) {
  const item = example.item;

  let token = ctx.token || "API_KEY";

  let type = "";

  if (item.type) {
    type = `\ntype : "${item.type}",`;
  }

  let content = "";
  if (item.content) {
    content = `\ncontent : "${item.content}",`;
  }

  let notify = "";

  if (item.notify || ctx.notify) {
    notify = `\nnotify : true,`;
  }

  let actions = "";

  if (item.actions) {
    actions = `\nactions : ${JSON.stringify(item.actions, null, 2)}`;
  }

  let str = `const url =  "https://api.operational.co/api/v1/ingest";
const form = {
name : "${item.name}",
avatar : "${item.avatar}",${type}${content}${notify}${actions}
}
const config = {
headers : {
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
