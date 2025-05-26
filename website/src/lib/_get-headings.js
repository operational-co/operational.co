import { apiList, manualList, selfhostedList, otherList } from "@operational.co/content/list.js";

const headings = [];

headings.push({
  text: "Start here",
  slug: "/api",
  depth: 0
});

apiList.map((page) => {
  headings.push({
    text: page.name,
    slug: page.path,
    depth: page.depth || 0
  });
});
manualList.map((page) => {
  headings.push({
    text: page.name,
    slug: page.path,
    depth: page.depth || 0
  });
});
selfhostedList.map((page) => {
  headings.push({
    text: page.name,
    slug: page.path,
    depth: page.depth || 0
  });
});
otherList.map((page) => {
  headings.push({
    text: page.name,
    slug: page.path,
    depth: page.depth || 0
  });
});

export default headings;
