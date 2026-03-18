import { getCollection } from "astro:content";

function toTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return timestamp;
}

function mapEntryToPost(entry) {
  const data = entry && entry.data ? entry.data : {};

  return {
    id: data.id,
    status: data.status || "draft",
    sort: data.sort === undefined ? null : data.sort,
    date_created: data.date_created || null,
    date_updated: data.date_updated || null,
    title: data.title || "",
    subtitle: data.subtitle || "",
    slug: data.slug || "",
    category: data.category || null,
    banner: data.banner || null,
    banner_og: data.banner_og || null,
    banner_id: data.banner_id || null,
    banner_og_id: data.banner_og_id || null,
    content_markdown: entry && entry.body ? entry.body : "",
  };
}

function compareBlogPosts(a, b) {
  const aHasSort = typeof a.sort === "number";
  const bHasSort = typeof b.sort === "number";

  if (!aHasSort && bHasSort) {
    return -1;
  }

  if (aHasSort && !bHasSort) {
    return 1;
  }

  if (!aHasSort && !bHasSort) {
    return toTimestamp(b.date_created) - toTimestamp(a.date_created);
  }

  if (a.sort !== b.sort) {
    return a.sort - b.sort;
  }

  return toTimestamp(b.date_created) - toTimestamp(a.date_created);
}

async function getAllBlogPosts() {
  const entries = await getCollection("blog");
  const posts = [];

  for (let i = 0; i < entries.length; i++) {
    posts.push(mapEntryToPost(entries[i]));
  }

  posts.sort(compareBlogPosts);
  return posts;
}

async function getPublishedBlogPosts() {
  const posts = await getAllBlogPosts();
  const published = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (post.status !== "published") {
      continue;
    }
    if (!post.slug) {
      continue;
    }
    published.push(post);
  }

  return published;
}

export { compareBlogPosts, getAllBlogPosts, getPublishedBlogPosts };
