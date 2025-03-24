export default function (example, ctx) {
  const item = example.item;
  let token = ctx.token || "API_KEY";
  let baseUrl = ctx.baseUrl;

  let form = {};
  form.name = item.name;
  form.avatar = item.avatar;

  if (item.type) {
    form.type = item.type;
  }

  if (item.notify || ctx.notify) {
    form.notify = true;
  }

  if (item.content) {
    form.content = item.content;
  }

  if (item.notify) {
    form.notify = item.notify;
  }

  if (item.actions) {
    form.actions = item.actions;
  }

  let str = `curl -X POST "${baseUrl}/api/v1/ingest" \
-H "Authorization: Bearer ${token}" \
-H "Content-Type: application/json" \
-d '${JSON.stringify(form, null, 2)}'
`;

  return str;
}
