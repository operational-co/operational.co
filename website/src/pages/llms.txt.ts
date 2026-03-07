import { list } from "@/content/list.js";
import { buildApiTocList } from "@/lib/api-docs.js";
import { getCollection } from "astro:content";

export const prerender = true;

function getHref(item, parentItem) {
  if (item.path) {
    return item.path;
  }
  if (item.baseSlug) {
    return `/${item.baseSlug}/${item.slug}`;
  }
  if (parentItem && parentItem.slug && item.slug) {
    return `/${parentItem.slug}/${item.slug}`;
  }
  if (item.slug) {
    return `/${item.slug}`;
  }
  return "";
}

function collectLinks(items, parentItem, links) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.children && item.children.length > 0) {
      collectLinks(item.children, item, links);
      continue;
    }

    const href = getHref(item, parentItem);
    if (!href) {
      continue;
    }

    let name = item.name;
    if (item.method) {
      name = `${item.method} ${name}`;
    }

    links.push({
      name,
      href,
    });
  }
}

function getSections(tocItems) {
  const sections = [];

  for (let i = 0; i < tocItems.length; i++) {
    const item = tocItems[i];
    const links = [];

    if (item.children && item.children.length > 0) {
      collectLinks(item.children, item, links);
    } else {
      const href = getHref(item, null);
      if (href) {
        links.push({
          name: item.name,
          href,
        });
      }
    }

    if (links.length === 0) {
      continue;
    }

    sections.push({
      name: item.name,
      links,
    });
  }

  return sections;
}

export async function GET() {
  const apiEntries = await getCollection("api");
  const tocItems = buildApiTocList(list, apiEntries);
  const sections = getSections(tocItems);

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
    "## TOC links",
    "",
  ];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    lines.push(`### ${section.name}`);
    lines.push("");

    for (let j = 0; j < section.links.length; j++) {
      const link = section.links[j];
      lines.push(`- [${link.name}](https://operational.co${link.href})`);
    }

    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
