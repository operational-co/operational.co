function getPrimaryTag(entry) {
  if (entry && entry.data && Array.isArray(entry.data.tags) && entry.data.tags[0]) {
    return entry.data.tags[0];
  }
  return "API";
}

function sortByName(a, b) {
  const aName = String(a.name || "").toLowerCase();
  const bName = String(b.name || "").toLowerCase();

  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  return 0;
}

function buildPageItem(entry) {
  let method = "";
  if (entry.data.generatedFromOpenapi && entry.data.method) {
    method = String(entry.data.method).toUpperCase();
  }

  return {
    name: entry.data.title,
    slug: entry.data.slug,
    path: `/api/${entry.data.slug}`,
    tag: getPrimaryTag(entry),
    method,
  };
}

function groupByTag(items) {
  const groups = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const tag = item.tag || "API";
    if (!groups[tag]) {
      groups[tag] = [];
    }
    groups[tag].push(item);
  }

  return groups;
}

function getSortedTagNames(groups) {
  const names = Object.keys(groups);
  names.sort(function (a, b) {
    const aName = String(a || "").toLowerCase();
    const bName = String(b || "").toLowerCase();

    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
  return names;
}

function buildGroupedChildren(items) {
  const groups = groupByTag(items);
  const names = getSortedTagNames(groups);
  const groupedChildren = [];

  for (let i = 0; i < names.length; i++) {
    const tag = names[i];
    const groupItems = groups[tag].slice();
    groupItems.sort(sortByName);

    groupedChildren.push({
      name: tag,
      children: groupItems.map(function (item) {
        return {
          name: item.name,
          slug: item.slug,
          path: item.path,
          method: item.method,
        };
      }),
    });
  }

  return groupedChildren;
}

export function buildApiPageItems(entries) {
  const items = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry || !entry.data || !entry.data.slug || !entry.data.title) {
      continue;
    }
    items.push(buildPageItem(entry));
  }

  return items;
}

export function buildApiTocList(baseList, entries) {
  const pageItems = buildApiPageItems(entries);
  const apiChildren = buildGroupedChildren(pageItems);
  const nextList = [];

  for (let i = 0; i < baseList.length; i++) {
    const item = baseList[i];
    if (item.slug === "api") {
      const nextItem = {
        name: item.name,
        slug: item.slug,
        children: apiChildren,
      };
      nextList.push(nextItem);
      continue;
    }

    nextList.push(item);
  }

  return nextList;
}

export function buildApiPrevNext(entries, currentSlug) {
  const pageItems = buildApiPageItems(entries);
  const groups = groupByTag(pageItems);
  const names = getSortedTagNames(groups);
  const ordered = [];

  for (let i = 0; i < names.length; i++) {
    const tag = names[i];
    const tagItems = groups[tag].slice();
    tagItems.sort(sortByName);

    for (let j = 0; j < tagItems.length; j++) {
      ordered.push(tagItems[j]);
    }
  }

  let index = -1;
  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i].slug === currentSlug) {
      index = i;
      break;
    }
  }

  let prev = null;
  let next = null;

  if (index > 0) {
    prev = {
      name: ordered[index - 1].name,
      slug: ordered[index - 1].path,
    };
  }
  if (index >= 0 && index < ordered.length - 1) {
    next = {
      name: ordered[index + 1].name,
      slug: ordered[index + 1].path,
    };
  }

  return {
    prev,
    next,
  };
}
