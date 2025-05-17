export default function (example, ctx) {
  const item = example.item;
  let test = ctx.test || false;
  let notify = ctx.notify || false;
  let token = ctx.token || "API_KEY";

  let type = "";

  if (item.type) {
    type = `\n  type: "${item.type}",`;
  }

  let content = "";
  if (item.content) {
    let tempContent = item.content;
    if (item.type === "rows" || item.type === "json") {
      tempContent = JSON.stringify(tempContent, null, 2);
      content = `\n  content: ${tempContent},`;
    } else {
      content = `\n  content: "${tempContent}",`;
    }
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

  let str = `// Remember to setup the nodejs sdk https://www.npmjs.com/package/@operational.co/sdk 
  
const eventName = "${item.name}";
const payload = {
  name: "${item.name}",
  avatar: "${item.avatar}",${test}${notify}${type}${content}${actions}
}

await ops.events.ingest(eventName, payload)`;

  return str;
}
