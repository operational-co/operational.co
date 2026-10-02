<template>
  <div class="p-mcp">
    <Constrain>
      <header>
        <h3>MCP</h3>
      </header>

      <section class="p-mcp__intro">
        <p>
          Connect Operational to Claude, ChatGPT, or Codex. Each client uses OAuth to get read-only
          access to events in your current workspace.
        </p>

        <strong>Server URL</strong>
        <Code :text="mcpUrl" lang="bash"></Code>

        <small>OAuth 2.1 · Read-only · Current workspace</small>
      </section>

      <h4>Installation</h4>

      <Tabs :options="{ useUrlFragment: false }">
        <Tab name="Claude">
          <div class="p-mcp__guide">
            <h4>Claude</h4>
            <p>For Claude on web, desktop, or Cowork:</p>

            <ol>
              <li>Open <strong>Customize → Connectors</strong>.</li>
              <li>
                Choose <strong>+ Add → Add custom connector</strong>. Name it
                <strong>Operational</strong> and enter this URL:
                <Code :text="mcpUrl" lang="bash"></Code>
              </li>
              <li>
                Keep detected OAuth settings. Choose <strong>Sign in now</strong> and use Claude's
                published identity.
              </li>
              <li>Approve access in Operational.</li>
              <li>Enable Operational from <strong>+ → Connectors</strong> in a conversation.</li>
            </ol>

            <h4>Claude Code</h4>
            <p>Run this command, then use <code>/mcp</code> inside Claude Code to sign in.</p>
            <Code :text="claudeCommand" lang="bash"></Code>

            <a
              href="https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp"
              target="_blank"
              rel="noreferrer"
            >
              View Claude's MCP guide
            </a>
          </div>
        </Tab>

        <Tab name="ChatGPT">
          <div class="p-mcp__guide">
            <h4>ChatGPT</h4>

            <ol>
              <li>
                Open <strong>Settings → Security and login</strong> and enable
                <strong>Developer mode</strong>.
              </li>
              <li>
                Open <strong>Plugins</strong>, select <strong>+</strong>, and enter this URL:
                <Code :text="mcpUrl" lang="bash"></Code>
              </li>
              <li>Create and install the personal plugin.</li>
              <li>Complete the Operational OAuth prompt.</li>
              <li>
                Start a <strong>Work</strong> chat, type <code>@</code>, and select Operational.
              </li>
            </ol>

            <a
              href="https://developers.openai.com/plugins/quickstart"
              target="_blank"
              rel="noreferrer"
            >
              View ChatGPT's plugin guide
            </a>
          </div>
        </Tab>

        <Tab name="Codex">
          <div class="p-mcp__guide">
            <h4>Codex</h4>

            <ol>
              <li>
                Add Operational:
                <Code :text="codexAddCommand" lang="bash"></Code>
              </li>
              <li>
                Sign in with OAuth:
                <Code text="codex mcp login operational" lang="bash"></Code>
              </li>
              <li>
                Check the connection:
                <Code text="codex mcp list" lang="bash"></Code>
              </li>
            </ol>

            <h4>Manual configuration</h4>
            <p>Add this to <code>~/.codex/config.toml</code>, then run the login command above.</p>
            <Code :text="codexConfig" lang="bash"></Code>

            <a href="https://developers.openai.com/learn/docs-mcp" target="_blank" rel="noreferrer">
              View Codex's MCP guide
            </a>
          </div>
        </Tab>
      </Tabs>

      <section class="p-mcp__tools">
        <h4>Available tools</h4>
        <ul>
          <li><code>operational_find_events</code> searches events using feed filters.</li>
          <li><code>operational_get_event</code> gets one event and its context.</li>
          <li>
            <code>operational_events_context</code> lists workspace event names, categories, and
            filter details.
          </li>
        </ul>
      </section>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Code from "@operational.co/components/code/index.vue";
import { Tabs, Tab } from "vue3-tabs-component";

export default {
  components: {
    Constrain,
    Code,
    Tabs,
    Tab,
  },

  computed: {
    mcpUrl: function () {
      const baseUrl = String(this.$store.app.baseApiUrl || "").replace(/\/$/, "");
      return `${baseUrl}/mcp`;
    },
    claudeCommand: function () {
      return `claude mcp add --transport http --scope user operational ${this.mcpUrl}`;
    },
    codexAddCommand: function () {
      return `codex mcp add operational --url ${this.mcpUrl}`;
    },
    codexConfig: function () {
      return `[mcp_servers.operational]\nurl = "${this.mcpUrl}"`;
    },
  },
};
</script>

<style lang="scss">
.p-mcp {
  position: relative;
  height: 100%;

  header {
    position: relative;
    display: flex;
    padding: 0.5rem 0;

    h3 {
      margin-bottom: 0;
    }
  }

  &__intro,
  &__tools {
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    border-radius: 0.75rem;
    background-color: var(--color-bg-2);

    p:last-child,
    ul:last-child {
      margin-bottom: 0;
    }
  }

  &__intro {
    > strong {
      display: block;
      margin-bottom: 0.5rem;
    }

    > small {
      display: block;
      color: var(--color-font-lighter);
    }

    .c-code {
      margin-bottom: 0.5rem;
      background-color: var(--color-bg-1);
    }
  }

  &__guide {
    padding: 0.75rem;

    > p {
      color: var(--color-font-light);
    }

    > h4:not(:first-child) {
      padding-top: 0.75rem;
    }

    ol {
      margin-bottom: 1rem;
    }

    li {
      padding-bottom: 0.25rem;

      .c-code {
        margin-top: 0.5rem;
        margin-bottom: 0.25rem;
      }
    }

    > .c-code {
      margin-bottom: 1rem;
    }

    > a {
      display: inline-block;
      margin-bottom: 0.25rem;
      font-size: var(--font-size-sm);
      font-weight: 500;
    }
  }

  &__tools {
    h4 {
      margin-bottom: 0.5rem;
    }

    ul {
      margin-top: 0;
    }
  }

  .tabs-component {
    margin-bottom: 1.5rem;

    > ul {
      margin: 0 0 0.5rem;
      padding: 0;
      list-style: none;
      border-bottom: var(--color-bg-3) solid 2px;

      > li {
        display: inline-block;
        margin: 0;
        padding: 0;

        &:before {
          display: none;
        }

        > a {
          position: relative;
          display: inline-block;
          padding: 0.375rem 0.75rem;
          color: var(--color-font);
          font-size: var(--font-size-sm);
          font-weight: 500;

          &:after {
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: var(--color-bg-3);
            content: "";
          }

          &.is-active {
            color: var(--color-primary);

            &:after {
              background-color: var(--color-primary);
            }
          }
        }
      }
    }

    .tabs-component-panels {
      border: var(--color-bg-3) solid 1px;
      border-radius: var(--border-radius);
      background-color: var(--color-bg-2);
    }
  }

  @media screen and (max-width: 940px) {
    padding-top: 0.75rem;
  }
}
</style>
