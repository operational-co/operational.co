import { marked } from "marked";

const renderer = {
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

    return `
            <h${depth} name="${escapedText}" id="${escapedText}" >
              ${text}
            </h${depth}>`;
  },
  link({ tokens, href }) {
    let list = ["operational.co", "swipekit.app"];

    let allow = false;

    for (let i = 0; i < list.length; i++) {
      let domain = list[i];

      if (href.includes(domain)) {
        allow = true;
        break;
      }
    }
    let rel = "";

    if (!allow) {
      rel = `rel="noopener noreferrer" target="_blank"`;
    }

    const text = this.parser.parseInline(tokens);
    return `<a href="${href}" ${rel}>${text}</a>`;
  },
};

marked.use({
  renderer,
});

function getSections(post) {
  if (!post.content_markdown) {
    return {
      sections: [],
      headings: [],
    };
  }
  const lexer = new marked.Lexer({});
  const tokens = lexer.lex(post.content_markdown);

  let sections = [];

  let headings = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    if (token.type === "heading" && token.depth === 2) {
      //let escapedText = token.text.toLowerCase().replace(/[^\w]+/g, "-");

      sections.push({
        "@type": "Thing",
        name: token.text,
      });

      headings.push(token.text);
    }
  }

  return {
    sections,
    headings,
  };
}

function formatDate(isoDateString) {
  let date = new Date(isoDateString);

  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0, so we add 1
  let day = String(date.getDate()).padStart(2, "0");

  let formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

/**
 * type is the type of the json ld generated, eg post, page, etc
 */
function getJsonld(obj, type = "post") {
  let json = {};
  if (type === "post") {
    try {
      json = getPostJsonLd(obj);
    } catch (err) {
      console.log(`JsonLd not generated for type ${type}`);
      console.log(err);
    }
  }
  if (type === "page") {
    try {
      json = getPageJsonLd(obj);
    } catch (err) {
      console.log(`JsonLd not generated for type ${type}`);
      console.log(err);
    }
  }
  if (type === "usecase") {
    try {
      json = getUsecaseJsonLd(obj);
    } catch (err) {
      console.log(`JsonLd not generated for type ${type}`);
      console.log(err);
    }
  }
  return json;
}

function getUsecaseJsonLd(post) {
  let title = post.title;
  let subtitle = post.subtitle;
  let bannerUrl = `https://operational.co/images/usecases/${post.data.slug}-banner.webp`;
  let authorName = "Shash";
  let authorUrl = "https://x.com/shash122tfu";
  let publisherName = "Operational";
  let publisherLogo = "https://operational.co/favicons/apple-touch-icon.png";
  let pageUrl = post.path ? post.path : `https://operational.co/usecases/${post.data.slug}`;
  let datePublished = post.date_created ? formatDate(post.data.date) : null;
  let dateModified = post.date_updated ? formatDate(post.date_updated) : null;
  //let { sections, headings } = getSections(post);

  let json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    alternativeHeadline: subtitle,
    author: {
      "@type": "Person",
      url: authorUrl,
      name: authorName,
    },
    publisher: {
      "@type": publisherName,
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    datePublished: datePublished,
    //dateModified: dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    description: subtitle,
    //articleSection: headings,
    image: {
      "@type": "ImageObject",
      url: bannerUrl,
    },
    url: pageUrl,
    isPartOf: {
      "@type": "Blog",
      name: publisherName,
      publisher: {
        "@type": "Organization",
        name: publisherName,
      },
    },
    //about: sections
  };

  return json;
}

function getPostJsonLd(post) {
  let title = post.title;
  let subtitle = post.subtitle;
  let bannerUrl = `https://writings.operational.co/assets/${post.banner_og || post.banner}?format=jpeg&quality=70`;
  let authorName = "Shash";
  let authorUrl = "https://x.com/shash122tfu";
  let publisherName = "Operational";
  let publisherLogo = "https://operational.co/favicons/apple-touch-icon.png";
  let pageUrl = post.path ? post.path : `https://operational.co/articles/${post.slug}`;
  let datePublished = post.date_created ? formatDate(post.date_created) : null;
  let dateModified = post.date_updated ? formatDate(post.date_updated) : null;
  let { sections, headings } = getSections(post);

  let json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    alternativeHeadline: subtitle,
    author: {
      "@type": "Person",
      url: authorUrl,
      name: authorName,
    },
    publisher: {
      "@type": publisherName,
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    description: subtitle,
    articleSection: headings,
    image: {
      "@type": "ImageObject",
      url: bannerUrl,
    },
    url: pageUrl,
    isPartOf: {
      "@type": "Blog",
      name: publisherName,
      publisher: {
        "@type": "Organization",
        name: publisherName,
      },
    },
    about: sections,
  };

  return json;
}

function getPageJsonLd(post) {
  let title = post.title;
  let subtitle = post.subtitle;
  //let bannerUrl = `https://writings.operational.co/assets/${post.banner_og || post.banner}?format=jpeg&quality=70`;
  let authorName = "Shash";
  let authorUrl = "https://x.com/shash122tfu";
  let publisherName = "Operational";
  let baseUrl = "https://operational.co";
  let publisherLogo = "https://operational.co/favicons/apple-touch-icon.png";
  let pageUrl = post.path ? post.path : `https://operational.co/${post.slug}`;
  let datePublished = post.date_created ? formatDate(post.date_created) : null;
  let dateModified = post.date_updated ? formatDate(post.date_updated) : null;
  let { sections, headings } = getSections(post);

  let json = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: subtitle,
    url: pageUrl,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: publisherName,
      url: baseUrl,
    },
    // potentialAction: {
    //   "@type": "Action",
    //   name: title,
    //   target: {
    //     "@type": "EntryPoint",
    //     urlTemplate: "https://example.com/convert",
    //     actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"]
    //   }
    // },
    creator: {
      "@type": "Organization",
      name: publisherName,
      url: baseUrl,
      logo: publisherLogo,
    },
    about: {
      "@type": "SoftwareApplication",
      name: title,
      applicationCategory: "WebApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: pageUrl,
        },
      ],
    },
  };

  if (post.bannerUrl) {
    json.image = {
      "@type": "ImageObject",
      url: post.bannerUrl,
    };
  }

  return json;
}

export default getJsonld;
