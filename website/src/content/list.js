export const list = [
  {
    name: "Start here",
    slug: "start-here",
    baseSlug: "docs",
  },
  {
    name: "Setup",
    slug: "docs",
    children: [
      {
        name: "Get started",
        slug: "introduction",
      },
      {
        name: "Send your first event",
        slug: "send-your-first-event",
      },
      {
        name: "Structured Events",
        slug: "structured-events",
      },
      {
        name: "Actions",
        slug: "add-actions",
      },
      {
        name: "Contexts",
        slug: "group-events-with-contexts",
      },
      {
        name: "Log limits and errors",
        slug: "log-limits-and-errors",
      },
    ],
  },
  {
    name: "Events API",
    slug: "api",
    children: [
      {
        name: "Log event",
        slug: "log-event",
      },
      {
        name: "Event parameters",
        slug: "event-parameters",
      },
      {
        name: "Actions",
        slug: "actions",
      },
      {
        name: "Error handling",
        slug: "error-handling",
      },
    ],
  },
  {
    name: "The Manual",
    slug: "manual",
    children: [
      {
        name: "Introduction",
        slug: "introduction",
      },
      {
        name: "PWA & push notifications",
        slug: "pwa",
      },
      // {
      //   name: "Basics",
      //   slug: "basics",
      // },
      {
        name: "Conventions",
        slug: "conventions",
      },
      {
        name: "Setup",
        slug: "setup",
      },
      {
        name: "Manage projects and teammates",
        slug: "manage-projects-and-teammates",
      },
      {
        name: "Categories and search",
        slug: "categories-and-search",
      },
      {
        name: "View events in your project",
        slug: "view-events-in-your-project",
      },
      {
        name: "Setup PWA on phone",
        slug: "setup-pwa-on-phone",
      },
      {
        name: "Test mode",
        slug: "test-mode",
      },
      {
        name: "Notifications",
        slug: "notifications",
      },
    ],
  },
  {
    name: "Integrations",
    slug: "integrations",
    children: [
      {
        name: "Nodejs SDK",
        slug: "nodejs-sdk",
      },
      {
        name: "PHP SDK",
        slug: "php-sdk",
      },
      {
        name: "Wordpress plugin",
        slug: "wordpress-plugin",
      },
    ],
  },
  {
    name: "Self hosting",
    slug: "selfhosted",
    children: [
      {
        name: "Introduction",
        slug: "introduction",
      },
      {
        name: "Install locally",
        slug: "install-locally",
      },
      {
        name: "Install on VPS",
        slug: "install-on-vps",
      },
      {
        name: "Install on Render",
        slug: "install-on-render",
      },
      {
        name: "Install via Docker",
        slug: "install-via-docker",
      },
      {
        name: "Install via Docker and Coolify",
        slug: "install-via-docker-and-coolify",
      },
      // {
      //   name: "Docker",
      //   path: "/selfhosted/docker",
      //   depth: 1
      // },
      {
        name: "Onboarding",
        slug: "onboarding",
      },
      {
        name: "Setup .env",
        slug: "setup-env",
      },
      {
        name: "Setup PWA & push notifications",
        slug: "setup-pwa-and-push-notifications",
      },
      {
        name: "Best practices",
        slug: "best-practices",
      },
      {
        name: "Durability testing",
        slug: "durability",
      },
    ],
  },
  {
    name: "Other",
    slug: "docs",
    children: [
      {
        name: "Vision",
        slug: "vision",
      },
      {
        name: "Roadmap",
        slug: "roadmap",
      },
      {
        name: "Contributing",
        slug: "contributing",
      },
    ],
  },
];

export const usecasesList = [
  {
    name: "Track user sign ups",
    description: "Receive notifications when a new user registers on your platform.",
    path: "/usecases/track-user-signups",
    icon: "📩",
  },
  {
    name: "Track user cancellations",
    description: "Receive notifications when users cancel their accounts or subscriptions.",
    path: "/usecases/track-user-cancellations",
    icon: "❌",
  },
  {
    name: "Track user trial ends",
    description:
      "Receive notifications when a user's trial period ends to trigger follow-ups or analyze conversions.",
    path: "/usecases/track-user-trial-ends",
    icon: "⏳",
  },
  {
    name: "Uncover cron jobs",
    description: "Monitor scheduled background tasks to ensure they run as expected.",
    path: "/usecases/uncover-cron-jobs",
    icon: "🔄",
  },
  {
    name: "Catch webhooks",
    description: "Log incoming webhooks to verify payloads, debug integrations, and detect issues.",
    path: "/usecases/catch-webhooks",
    icon: "📨",
  },
  {
    name: "Debug server starts",
    description:
      "Receive notifications when your server restarts to identify downtimes or deployment changes.",
    path: "/usecases/debug-server-starts",
    icon: "🚀",
  },
  {
    name: "Catch known errors",
    description: "Log and categorize recurring errors to fix bugs and improve stability.",
    path: "/usecases/catch-known-errors",
    icon: "⚠️",
  },
  // {
  //   name: "Track your webapp's telemetry",
  //   description:
  //     "Understand user signups, get visibility over who signed up, where did they signup from and take actions on users",
  //   path: "/usecases/track-webapp-telemetry",
  //   icon: "🛠️"
  // }
];

export const getItems = function (list, path) {
  let listItem = null;
  let prevListItem = null;
  let nextListItem = null;

  for (let i = 0; i < list.length; i++) {
    let p = list[i];
    let s = p.slug;

    let children = p.children;

    if (p.baseSlug && `${p.baseSlug}/${p.slug}` === path) {
      listItem = p;
    }

    if (children) {
      for (let j = 0; j < children.length; j++) {
        const child = children[j];

        let childPath = `${s}/${child.slug}`;

        if (childPath === path) {
          if (children[j - 1]) {
            prevListItem = children[j - 1];
          }
          if (children[j + 1]) {
            nextListItem = children[j + 1];
          }
          listItem = child;
          break;
        }
      }
    }
  }

  return {
    listItem,
    prevListItem,
    nextListItem,
  };
};
