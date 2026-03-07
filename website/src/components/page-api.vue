<template>
  <div class="c-page-api">
    <Constrain size="lg">
      <template #sidebar>
        <Toc :pathname="pathname" :items="tocItems"></Toc>
      </template>
      <template #default>
        <div class="c-page-api__header">
          <h1 class="c-page-api__title">{{ pageTitle }}</h1>
          <div class="c-page-api__llm" ref="llmMenuRoot">
            <div class="c-page-api__llm__controls">
              <button class="c-page-api__llm__main" type="button" @click="onCopyMarkdown">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.5 4.5H4.5C3.39543 4.5 2.5 5.39543 2.5 6.5V17.5C2.5 18.6046 3.39543 19.5 4.5 19.5H19.5C20.6046 19.5 21.5 18.6046 21.5 17.5V6.5C21.5 5.39543 20.6046 4.5 19.5 4.5Z"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.5 14.5V9.5L9 12L11.5 9.5V14.5"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.5 9.5V14.5L14.5 12.5"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.5 14.4998L18.5 12.5171"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>Copy markdown</span>
              </button>
              <button
                class="c-page-api__llm__toggle"
                type="button"
                @click.stop="onToggleMenu"
                aria-label="Toggle AI options"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 10L11.2929 13.2929C11.6834 13.6834 12.3166 13.6834 12.7071 13.2929L16 10"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div v-if="menuActive" class="c-page-api__llm__dropdown">
              <button class="c-page-api__llm__item" type="button" @click="onCopyMarkdown">
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19.5 4.5H4.5C3.39543 4.5 2.5 5.39543 2.5 6.5V17.5C2.5 18.6046 3.39543 19.5 4.5 19.5H19.5C20.6046 19.5 21.5 18.6046 21.5 17.5V6.5C21.5 5.39543 20.6046 4.5 19.5 4.5Z"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.5 14.5V9.5L9 12L11.5 9.5V14.5"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.5 9.5V14.5L14.5 12.5"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.5 14.4998L18.5 12.5171"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="text">
                  <strong>Copy markdown</strong>
                  <small>Copy page as Markdown for LLMs</small>
                </span>
              </button>

              <button class="c-page-api__llm__item" type="button" @click="onOpenLlm('claude')">
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5.92405 15.2962L9.85823 13.0903L9.92405 12.8981L9.85823 12.7918H9.66582L9.0076 12.7513L6.75949 12.6906L4.81013 12.6097L2.92152 12.5085L2.44557 12.4073L2 11.8204L2.04557 11.5269L2.44557 11.2588L3.01772 11.3094L4.28354 11.3954L6.18228 11.5269L7.55949 11.6079L9.6 11.8204H9.92405L9.96962 11.6888L9.85823 11.6079L9.77215 11.5269L7.8076 10.1963L5.68101 8.78978L4.56709 7.98027L3.96456 7.57045L3.66076 7.18594L3.52911 6.34607L4.07595 5.74399L4.81013 5.79459L4.99747 5.84518L5.74177 6.4169L7.33165 7.64635L9.4076 9.1743L9.71139 9.42727L9.83291 9.34126L9.8481 9.28055L9.71139 9.05287L8.58228 7.01391L7.37722 4.93954L6.84051 4.07943L6.69873 3.56337C6.6481 3.35087 6.61266 3.17379 6.61266 2.95624L7.23544 2.11131L7.57975 2L8.41013 2.11131L8.75949 2.41487L9.27595 3.59373L10.1114 5.45054L11.4076 7.97521L11.7873 8.72401L11.9899 9.41715L12.0658 9.62965H12.1975V9.50822L12.3038 8.08652L12.5013 6.34101L12.6937 4.09461L12.7595 3.46218L13.0734 2.70326L13.6962 2.29345L14.1823 2.52618L14.5823 3.0979L14.5266 3.46724L14.2886 5.01037L13.8228 7.42879L13.519 9.04781H13.6962L13.8987 8.84543L14.719 7.75765L16.0962 6.03744L16.7038 5.35441L17.4127 4.60056L17.8684 4.24134H18.7291L19.362 5.18239L19.0785 6.15381L18.1924 7.27701L17.4582 8.22818L16.4051 9.64483L15.7468 10.7781L15.8076 10.8692L15.9646 10.854L18.3443 10.3481L19.6304 10.1154L21.1646 9.85226L21.8582 10.1761L21.9342 10.5049L21.6608 11.1778L20.0203 11.5826L18.0962 11.9671L15.2304 12.6451L15.1949 12.6704L15.2354 12.721L16.5266 12.8424L17.0785 12.8728H18.4304L20.9468 13.06L21.6051 13.4951L22 14.0263L21.9342 14.4311L20.9215 14.9471L19.5544 14.6233L16.3646 13.8644L15.2709 13.5912H15.119V13.6823L16.0304 14.5727L17.7013 16.0804L19.7924 18.0233L19.8987 18.5039L19.6304 18.8834L19.3468 18.8429L17.5089 17.4617L16.8 16.8394L15.1949 15.4885H15.0886V15.6302L15.4582 16.1715L17.4127 19.106L17.5139 20.0066L17.3722 20.3L16.8658 20.4771L16.3089 20.3759L15.1646 18.7721L13.9848 16.9658L13.0329 15.3468L12.9165 15.4126L12.3544 21.4586L12.0911 21.7673L11.4835 22L10.9772 21.6155L10.7089 20.9932L10.9772 19.7637L11.3013 18.1599L11.5646 16.8849L11.8025 15.3013L11.9443 14.7751L11.9342 14.7397L11.8177 14.7549L10.6228 16.3941L8.80506 18.848L7.36709 20.386L7.02279 20.5226L6.42532 20.214L6.48101 19.6625L6.81519 19.1718L8.80506 16.642L10.0051 15.0736L10.7797 14.168L10.7747 14.0364H10.7291L5.44304 17.4667L4.50127 17.5882L4.0962 17.2087L4.14684 16.5864L4.33924 16.384L5.92911 15.2912L5.92405 15.2962Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span class="text">
                  <strong>Open in Claude</strong>
                  <small>Ask questions about this page</small>
                </span>
                <span class="arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 15V6M18 6H9M18 6L6.25 17.75"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <button class="c-page-api__llm__item" type="button" @click="onOpenLlm('chatgpt')">
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9.79648 9.34799V7.49548C9.79648 7.33946 9.85502 7.22239 9.99146 7.14447L13.7161 4.9995C14.2231 4.70702 14.8276 4.57058 15.4515 4.57058C17.7915 4.57058 19.2736 6.38413 19.2736 8.31455C19.2736 8.451 19.2736 8.60703 19.254 8.76305L15.393 6.501C15.159 6.36456 14.925 6.36456 14.691 6.501L9.79648 9.34799ZM18.4935 16.5631V12.1364C18.4935 11.8634 18.3764 11.6684 18.1425 11.5319L13.248 8.68494L14.847 7.76838C14.9834 7.69046 15.1005 7.69046 15.237 7.76838L18.9615 9.91336C20.0342 10.5374 20.7555 11.8634 20.7555 13.1503C20.7555 14.6322 19.8782 15.9973 18.4935 16.5628V16.5631ZM8.64599 12.663L7.04699 11.7271C6.91054 11.6492 6.85201 11.5321 6.85201 11.3761V7.08614C6.85201 4.99968 8.45101 3.42007 10.6156 3.42007C11.4346 3.42007 12.195 3.69316 12.8386 4.18061L8.99717 6.40369C8.76323 6.54015 8.64617 6.73513 8.64617 7.00822V12.6632L8.64599 12.663ZM12.0878 14.652L9.79648 13.3651V10.6351L12.0878 9.34818L14.3789 10.6351V13.3651L12.0878 14.652ZM13.56 20.5801C12.741 20.5801 11.9806 20.307 11.3369 19.8196L15.1784 17.5964C15.4123 17.46 15.5294 17.2651 15.5294 16.992V11.3369L17.148 12.2729C17.2845 12.3508 17.3429 12.4679 17.3429 12.6239V16.9139C17.3429 19.0003 15.7243 20.5801 13.56 20.5801ZM8.93846 16.2316L5.21387 14.0866C4.14128 13.4625 3.41989 12.1366 3.41989 10.8497C3.41989 9.34818 4.31688 8.00269 5.70131 7.43713V11.8831C5.70131 12.1562 5.81838 12.3512 6.05232 12.4876L10.9274 15.315L9.32842 16.2316C9.19196 16.3096 9.0749 16.3096 8.93846 16.2316ZM8.72408 19.4297C6.52057 19.4297 4.90201 17.772 4.90201 15.7246C4.90201 15.5685 4.92158 15.4125 4.94097 15.2565L8.78243 17.4796C9.01637 17.616 9.2505 17.616 9.48444 17.4796L14.3789 14.6522V16.5047C14.3789 16.6607 14.3204 16.7777 14.1839 16.8557L10.4593 19.0007C9.95233 19.2931 9.3478 19.4297 8.72391 19.4297H8.72408ZM13.56 21.75C15.9195 21.75 17.8889 20.073 18.3376 17.85C20.5215 17.2844 21.9256 15.2369 21.9256 13.1505C21.9256 11.7855 21.3406 10.4595 20.2876 9.50401C20.3851 9.09448 20.4437 8.68494 20.4437 8.27559C20.4437 5.48714 18.1816 3.4005 15.5686 3.4005C15.0422 3.4005 14.5351 3.47842 14.0281 3.65401C13.1505 2.79599 11.9415 2.25 10.6156 2.25C8.25602 2.25 6.28663 3.92691 5.83795 6.14999C3.65402 6.71555 2.25 8.76305 2.25 10.8495C2.25 12.2146 2.83494 13.5405 3.88796 14.496C3.79046 14.9055 3.73194 15.315 3.73194 15.7244C3.73194 18.5128 5.99397 20.5994 8.60703 20.5994C9.13344 20.5994 9.64047 20.5216 10.1475 20.346C11.0249 21.204 12.2339 21.75 13.56 21.75Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span class="text">
                  <strong>Open in ChatGPT</strong>
                  <small>Ask questions about this page</small>
                </span>
                <span class="arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 15V6M18 6H9M18 6L6.25 17.75"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <button class="c-page-api__llm__item" type="button" @click="onOpenLlm('perplexity')">
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6 1.86861L11.4919 6.86861V2H12.4919V6.87084L18 1.87084V7.55655L20.2539 7.5567V16.0944H18V22.1884L12.4919 16.8011V22H11.4919V16.837L6.09401 22.1868L6.02703 16H3.5V7.55552L6 7.5557V1.86861ZM7 7.55577L10.7616 7.55604L7 4.1314V7.55577ZM10.7778 8.55604L4.5 8.55559V15H6.01621L5.99774 13.2938L10.7778 8.55604ZM11.4919 9.25623L7.00226 13.7062L7.06837 19.8132L11.4919 15.429V9.25623ZM12.4939 9.25572L12.5041 15.4143L17 19.8116V13.7088L12.4939 9.25572ZM13.2087 8.55621L18 13.2912V15.0944H19.2539V8.55663L13.2087 8.55621ZM13.2247 7.55621L17 7.55648V4.19678L16.9301 4.19261L13.2247 7.55621Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span class="text">
                  <strong>Open in Perplexity</strong>
                  <small>Ask questions about this page</small>
                </span>
                <span class="arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 15V6M18 6H9M18 6L6.25 17.75"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
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
import Toc from "@/components/ui/toc.vue";

export default {
  components: {
    Constrain,
    Toc,
  },

  props: {
    pathname: {},
    tocItems: {
      default: null,
    },
    title: {
      default: "",
    },
  },

  data: function () {
    return {
      menuActive: false,
      pageHref: "",
      fallbackTitle: "",
    };
  },

  computed: {
    pageTitle: function () {
      if (this.title) {
        return this.title;
      }

      if (this.fallbackTitle) {
        return this.fallbackTitle;
      }

      return "Documentation";
    },
  },
  methods: {
    onToggleMenu: function () {
      this.menuActive = !this.menuActive;
    },
    resolveCurrentUrl: function () {
      if (typeof window === "undefined") {
        return "";
      }

      return window.location.href;
    },
    getPromptForLlm: function () {
      let pageUrl = this.pageHref || this.resolveCurrentUrl();
      if (!pageUrl) {
        return "";
      }

      return `Answer questions about this page: ${pageUrl}`;
    },
    getLlmUrl: function (provider) {
      let prompt = this.getPromptForLlm();

      if (provider === "chatgpt") {
        return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
      }

      if (provider === "claude") {
        return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
      }

      if (provider === "perplexity") {
        return `https://www.perplexity.ai/search/new?q=${encodeURIComponent(prompt)}`;
      }

      return "";
    },
    onOpenLlm: function (provider) {
      let url = this.getLlmUrl(provider);
      this.menuActive = false;

      if (!url) {
        return;
      }

      if (typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    onWindowClick: function (event) {
      if (!this.menuActive) {
        return;
      }

      const root = this.$refs.llmMenuRoot;
      if (!root) {
        return;
      }

      if (root.contains(event.target)) {
        return;
      }

      this.menuActive = false;
    },
    onWindowKeydown: function (event) {
      if (event.key === "Escape") {
        this.menuActive = false;
      }
    },
    onCopyMarkdown: async function () {
      this.menuActive = false;

      let root = this.$refs.markdownSource;
      if (!root) {
        return;
      }

      let clone = root.cloneNode(true);
      clone
        .querySelectorAll(".c-card, astro-island, script, style, template, noscript")
        .forEach((node) => node.remove());

      let markdown =
        this.domToMarkdown(clone)
          .replace(/\n{3,}/g, "\n\n")
          .trim() + "\n";

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

        if (
          tag === "astro-island" ||
          tag === "script" ||
          tag === "style" ||
          tag === "template" ||
          tag === "noscript"
        ) {
          return "";
        }

        const children = () =>
          Array.from(node.childNodes)
            .map((n) => walk(n, true))
            .join("");

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

        if (
          tag === "code" &&
          node.parentElement &&
          node.parentElement.tagName.toLowerCase() !== "pre"
        ) {
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

        const block = [
          "div",
          "section",
          "article",
          "main",
          "header",
          "footer",
          "figure",
          "figcaption",
        ];
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

  mounted: function () {
    this.pageHref = this.resolveCurrentUrl();

    let root = this.$refs.markdownSource;
    if (root) {
      let heading = root.querySelector("h1");
      if (heading && heading.textContent) {
        this.fallbackTitle = heading.textContent.trim();
      }
    }

    window.addEventListener("click", this.onWindowClick);
    window.addEventListener("keydown", this.onWindowKeydown);
  },

  beforeUnmount: function () {
    window.removeEventListener("click", this.onWindowClick);
    window.removeEventListener("keydown", this.onWindowKeydown);
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

  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__title {
    margin: 0;
    margin-right: auto;
    line-height: 1.1;
  }

  &__llm {
    position: relative;
    z-index: 5;

    svg {
      width: 24px;
      height: 24px;
    }

    &__controls {
      display: flex;
      border: 1px solid var(--color-bg-5);
      border-radius: var(--border-radius);
      background-color: var(--color-bg-2);
      overflow: hidden;
      width: 100%;
    }

    &__main,
    &__toggle {
      border: 0;
      color: var(--color-font);
      background: transparent;
      cursor: pointer;
      transition: all var(--transition-time-sm) linear;
      padding: 0.5rem;
      padding-left: 0.25rem;

      &:hover {
        background-color: var(--color-bg-3);
      }
    }

    &__toggle {
      padding: 0.25rem;
    }

    &__main {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0 0.5rem;
      font-weight: 500;
      font-size: var(--font-size-sm);
    }

    &__toggle {
      width: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1px solid var(--color-bg-5);
    }

    &__dropdown {
      position: absolute;
      top: calc(100% + 0.375rem);
      right: 0;
      width: 23.5rem;
      overflow: hidden;
      border: 1px solid var(--color-bg-5);
      border-radius: var(--border-radius);
      background-color: var(--color-bg-2);
      backdrop-filter: blur(8px);
    }

    &__item {
      width: 100%;
      border: 0;
      background: transparent;
      color: var(--color-font);
      display: grid;
      grid-template-columns: 2.5rem 1fr auto;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      text-align: left;
      cursor: pointer;
      border-radius: var(--border-radius-sm);
      margin-bottom: 0.125rem;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        background-color: var(--color-bg-3);
      }

      .icon {
        width: 2.5rem;
        height: 2.5rem;
        border: 1px solid var(--color-bg-5);
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .text {
        display: flex;
        flex-direction: column;
      }

      strong {
        line-height: 1;
      }

      small {
        opacity: 0.75;
        line-height: 1.4;
      }

      .arrow {
        opacity: 0.75;
      }
    }
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

    &__header {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    &__title {
      font-size: 1.625rem;
    }

    &__llm {
      width: 100%;

      &__controls {
        width: 100%;
      }

      &__main {
        flex: 1;
        justify-content: center;
      }

      &__dropdown {
        width: 100%;
      }
    }
  }

  @media screen and (max-width: 576px) {
    padding-top: 0;
    padding-bottom: 3rem;

    &__llm {
      &__main {
      }

      &__item {
      }
    }
  }
}
</style>
