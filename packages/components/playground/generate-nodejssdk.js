export default function (example, ctx) {
  const item = example.item;

  let token = ctx.token || "API_KEY";

  let type = "";

  if (item.type) {
    type = `\ntype : "${item.type}",`;
  }

  let content = "";
  if (item.content) {
    let tempContent = item.content;
    console.log(item.type);
    if (item.type === "rows" || item.type === "json") {
      console.log(type);
      tempContent = JSON.stringify(tempContent, null, 2);
      content = `\ncontent : ${tempContent},`;
    } else {
      content = `\ncontent : "${tempContent}",`;
    }
  }

  let notify = "";

  if (item.notify || ctx.notify) {
    notify = `\nnotify : true,`;
  }

  let actions = "";

  if (item.actions) {
    actions = `\nactions : ${JSON.stringify(item.actions, null, 2)}`;
  }

  let str = `const eventName = "${item.name}";
const payload = {
name : "${item.name}",
avatar : "${item.avatar}",${notify}${type}${content}${actions}
}

await ops.events.ingest(eventName, payload)`;

  return str;
}
