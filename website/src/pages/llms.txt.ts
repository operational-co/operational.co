import { list } from "@/content/list.js";

export const prerender = true;

function getDocsNewLinks() {
  const docsNew = list.find((item) => item.slug === "docs-new");
  if (!docsNew || !docsNew.children) {
    return [];
  }

  return docsNew.children.map((child) => {
    return {
      name: child.name,
      url: `https://operational.co/docs-new/${child.slug}`,
    };
  });
}

export async function GET() {
  const links = getDocsNewLinks();

  const lines = [
    "# Operational.co docs for LLMs",
    "",
    "Operational.co helps you track important product events from your backend.",
    "You can send events, group events with contexts, add action buttons, and filter by categories.",
    "",
    "Use these docs links with your favorite LLM to get setup help quickly.",
    "",
    "Website: https://operational.co",
    "App: https://app.operational.co",
    "",
    "## Docs-new links",
    "",
    "- [Guided setup index](https://operational.co/docs-new)",
    ...links.map((item) => `- [${item.name}](${item.url})`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
