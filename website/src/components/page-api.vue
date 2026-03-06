<template>
  <div class="c-page-api">
    <Constrain size="lg">
      <template #sidebar>
        <Toc :pathname="pathname"></Toc>
      </template>
      <template #default>
        <div class="c-page-api__tools">
          <button class="btn" type="button" @click="onCopyMarkdown" aria-label="Copy markdown" title="Copy markdown">
            <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <path d="M20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10V14L17.5 12.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 14L14.5 12.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 14V10L9.25 12L11.5 10V14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div ref="markdownSource">
          <slot></slot>
        </div>
      </template>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Subtitle from "./ui/subtitle.vue";
import Toc from "@operational.co/components/ui/toc.vue";

export default {
  components: {
    Constrain,
    Subtitle,
    Toc,
  },

  props: {
    pathname: {},
  },

  computed: {},
  methods: {
    onCopyMarkdown: async function () {
      let root = this.$refs.markdownSource;
      if (!root) {
        return;
      }

      let clone = root.cloneNode(true);
      clone.querySelectorAll(".c-card").forEach((node) => node.remove());

      let markdown = this.domToMarkdown(clone).replace(/\n{3,}/g, "\n\n").trim() + "\n";

      try {
        await navigator.clipboard.writeText(markdown);
      } catch {
        let area = document.createElement("textarea");
        area.value = markdown;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
    },
    domToMarkdown: function (root) {
      const walk = (node, inline = false) => {
        if (node.nodeType === 3) {
          const text = node.textContent || "";
          return inline ? text.replace(/\s+/g, " ") : text;
        }

        if (node.nodeType !== 1) {
          return "";
        }

        const tag = node.tagName.toLowerCase();
        const children = () => Array.from(node.childNodes).map((n) => walk(n, true)).join("");

        if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
          const level = parseInt(tag.slice(1), 10);
          return `${"#".repeat(level)} ${children().trim()}\n\n`;
        }

        if (tag === "p") {
          return `${children().trim()}\n\n`;
        }

        if (tag === "a") {
          const text = children().trim();
          const href = node.getAttribute("href") || "";
          return href ? `[${text}](${href})` : text;
        }

        if (tag === "strong" || tag === "b") {
          return `**${children().trim()}**`;
        }

        if (tag === "em" || tag === "i") {
          return `*${children().trim()}*`;
        }

        if (tag === "code" && node.parentElement && node.parentElement.tagName.toLowerCase() !== "pre") {
          return `\`${(node.textContent || "").trim()}\``;
        }

        if (tag === "pre") {
          const codeNode = node.querySelector("code");
          const code = (codeNode ? codeNode.textContent : node.textContent) || "";
          const lang =
            node.getAttribute("data-language") ||
            (codeNode ? codeNode.getAttribute("data-language") : "") ||
            "";

          return `\`\`\`${lang}\n${code.trimEnd()}\n\`\`\`\n\n`;
        }

        if (tag === "ul" || tag === "ol") {
          const items = Array.from(node.children)
            .filter((el) => el.tagName && el.tagName.toLowerCase() === "li")
            .map((li, idx) => {
              const marker = tag === "ol" ? `${idx + 1}. ` : "- ";
              const content = Array.from(li.childNodes)
                .filter((child) => {
                  const childTag = child.tagName ? child.tagName.toLowerCase() : "";
                  return childTag !== "ul" && childTag !== "ol";
                })
                .map((child) => walk(child, true))
                .join("")
                .trim();
              return `${marker}${content}`;
            })
            .join("\n");
          return `${items}\n\n`;
        }

        if (tag === "blockquote") {
          const text = Array.from(node.childNodes)
            .map((child) => walk(child, true))
            .join("")
            .trim()
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n");
          return `${text}\n\n`;
        }

        if (tag === "img") {
          const alt = node.getAttribute("alt") || "";
          const src = node.getAttribute("src") || "";
          return src ? `![${alt}](${src})\n\n` : "";
        }

        if (tag === "hr") {
          return `---\n\n`;
        }

        if (tag === "br") {
          return "\n";
        }

        const block = ["div", "section", "article", "main", "header", "footer", "figure", "figcaption"];
        if (block.includes(tag)) {
          return Array.from(node.childNodes)
            .map((child) => walk(child, false))
            .join("");
        }

        return children();
      };

      return walk(root, false);
    },
  },
};
</script>

<style lang="scss">
.c-page-api {
  padding: 3rem 0;
  background-color: var(--color-bg-2);
  border-top: var(--color-bg-4) solid 1px;

  .c-constrain {
    &__inner {
      padding: 2rem 1rem;
      background-color: var(--color-bg-4);
      border-radius: 1rem;
      overflow-x: hidden;
    }
  }

  &__tools {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 980px) {
    padding-top: 0;

    .c-constrain {
      &__sidebar {
        margin-bottom: 0 !important;
        border-radius: 0 !important;
      }
      &__inner {
        border-radius: 0;
      }
    }
  }

  @media screen and (max-width: 576px) {
    padding-top: 0;
    padding-bottom: 3rem;
  }
}
</style>
