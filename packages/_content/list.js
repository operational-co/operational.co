export const list = [
  {
    name: "Start here",
    slug: "api"
  },
  {
    name: "API Docs",
    slug: "api",
    children: [
      {
        name: "Introduction",
        slug: "introduction"
      },
      {
        name: "Send your first event",
        slug: "send-your-first-event"
      },
      {
        name: "Event parameters",
        slug: "event-parameters"
      },
      {
        name: "Structured Events",
        slug: "structured-events"
      },
      {
        name: "Actions",
        slug: "actions"
      },
      {
        name: "Contexts",
        slug: "contexts"
      },
      {
        name: "Categories",
        slug: "categories"
      },
      {
        name: "Error handling",
        slug: "error-handling"
      }
    ]
  },
  {
    name: "The Manual",
    slug: "manual",
    children: [
      {
        name: "Introduction",
        slug: "introduction"
      },
      {
        name: "Basics",
        slug: "basics"
      },
      {
        name: "Conventions",
        slug: "conventions"
      },
      {
        name: "Setup",
        slug: "setup"
      },
      {
        name: "Test mode",
        slug: "test-mode"
      },
      {
        name: "Notifications",
        slug: "notifications"
      },
      {
        name: "PWA",
        slug: "pwa"
      }
    ]
  },
  {
    name: "Self hosting",
    slug: "selfhosted",
    children: [
      {
        name: "Introduction",
        slug: "introduction"
      },
      {
        name: "Install locally",
        slug: "install-locally"
      },
      {
        name: "Install on VPS",
        slug: "install-on-vps"
      },
      {
        name: "Install on Render",
        slug: "install-on-render"
      },
      {
        name: "Install via Docker",
        slug: "install-via-docker"
      },
      {
        name: "Install via Docker and Coolify",
        slug: "install-via-docker-and-coolify"
      },
      // {
      //   name: "Docker",
      //   path: "/selfhosted/docker",
      //   depth: 1
      // },
      {
        name: "Onboarding",
        slug: "onboarding"
      },
      {
        name: "Setup .env",
        slug: "setup-env"
      },
      {
        name: "Setup Notifications",
        slug: "setup-notifications"
      },
      {
        name: "Integrations",
        slug: "integrations"
      },
      {
        name: "Best practices",
        slug: "best-practices"
      }
    ]
  },
  {
    name: "Other",
    slug: "other",
    children: [
      {
        name: "Vision",
        slug: "vision"
      },
      {
        name: "Roadmap",
        slug: "roadmap"
      },
      {
        name: "Contributing",
        slug: "contributing"
      }
    ]
  }
];

export const apiList = [
  {
    name: "API Docs"
  },
  {
    name: "Introduction",
    path: "/api/introduction",
    depth: 1
  },
  {
    name: "Send your first event",
    path: "/api/send-your-first-event",
    depth: 1
  },
  {
    name: "Event parameters",
    path: "/api/event-parameters",
    depth: 1
  },
  {
    name: "Structured Events",
    path: "/api/structured-events",
    depth: 1
  },
  {
    name: "Actions",
    path: "/api/actions",
    depth: 1
  },
  {
    name: "Contexts",
    path: "/api/contexts",
    depth: 1
  },
  {
    name: "Categories",
    path: "/api/categories",
    depth: 1
  },
  {
    name: "Error handling",
    path: "/api/error-handling",
    depth: 1
  }
];

export const manualList = [
  {
    name: "Manual"
  },
  {
    name: "Introduction",
    path: "/manual/introduction",
    depth: 1
  },
  {
    name: "Basics",
    path: "/manual/basics",
    depth: 1
  },
  {
    name: "Conventions",
    path: "/manual/conventions",
    depth: 1
  },
  {
    name: "Setup",
    path: "/manual/setup",
    depth: 1
  },
  {
    name: "Test mode",
    path: "/manual/test-mode",
    depth: 1
  },
  {
    name: "Notifications",
    path: "/manual/notifications",
    depth: 1
  },
  {
    name: "PWA",
    path: "/manual/pwa",
    depth: 1
  }
];

export const selfhostedList = [
  {
    name: "Self hosting"
  },
  {
    name: "Introduction",
    path: "/selfhosted/introduction",
    depth: 1
  },
  {
    name: "Install locally",
    path: "/selfhosted/install-locally",
    depth: 1
  },
  {
    name: "Install on VPS",
    path: "/selfhosted/install-on-vps",
    depth: 1
  },
  {
    name: "Install on Render",
    path: "/selfhosted/install-on-render",
    depth: 1
  },
  {
    name: "Install via Docker",
    path: "/selfhosted/install-via-docker",
    depth: 1
  },
  {
    name: "Install via Docker and Coolify",
    path: "/selfhosted/install-via-docker-and-coolify",
    depth: 1
  },
  // {
  //   name: "Docker",
  //   path: "/selfhosted/docker",
  //   depth: 1
  // },
  {
    name: "Onboarding",
    path: "/selfhosted/onboarding",
    depth: 1
  },
  {
    name: "Setup .env",
    path: "/selfhosted/setup-env",
    depth: 1
  },
  {
    name: "Setup Notifications",
    path: "/selfhosted/setup-notifications",
    depth: 1
  },
  {
    name: "Integrations",
    path: "/selfhosted/integrations",
    depth: 1
  },
  {
    name: "Best practices",
    path: "/selfhosted/best-practices",
    depth: 1
  }
];

export const otherList = [
  {
    name: "Other"
  },
  {
    name: "Vision",
    path: "/other/vision",
    depth: 1
  },
  {
    name: "Roadmap",
    path: "/other/roadmap",
    depth: 1
  },
  {
    name: "Contributing",
    path: "/other/contributing",
    depth: 1
  }
];

export const usecasesList = [
  {
    name: "Track user sign ups",
    description: "Receive notifications when a new user registers on your platform.",
    path: "/usecases/track-user-signups",
    icon: "📩"
  },
  {
    name: "Track user cancellations",
    description: "Receive notifications when users cancel their accounts or subscriptions.",
    path: "/usecases/track-user-cancellations",
    icon: "❌"
  },
  {
    name: "Track user trial ends",
    description: "Receive notifications when a user's trial period ends to trigger follow-ups or analyze conversions.",
    path: "/usecases/track-user-trial-ends",
    icon: "⏳"
  },
  {
    name: "Uncover cron jobs",
    description: "Monitor scheduled background tasks to ensure they run as expected.",
    path: "/usecases/uncover-cron-jobs",
    icon: "🔄"
  },
  {
    name: "Catch webhooks",
    description: "Log incoming webhooks to verify payloads, debug integrations, and detect issues.",
    path: "/usecases/catch-webhooks",
    icon: "📨"
  },
  {
    name: "Debug server starts",
    description: "Receive notifications when your server restarts to identify downtimes or deployment changes.",
    path: "/usecases/debug-server-starts",
    icon: "🚀"
  },
  {
    name: "Catch known errors",
    description: "Log and categorize recurring errors to fix bugs and improve stability.",
    path: "/usecases/catch-known-errors",
    icon: "⚠️"
  }
  // {
  //   name: "Track your webapp's telemetry",
  //   description:
  //     "Understand user signups, get visibility over who signed up, where did they signup from and take actions on users",
  //   path: "/usecases/track-webapp-telemetry",
  //   icon: "🛠️"
  // }
];

export const getItems = function (list, slug) {
  let listItem = null;
  let prevListItem = null;
  let nextListItem = null;

  for (let i = 0; i < list.length; i++) {
    let p = list[i];
    let s = p.slug;

    let children = p.children;

    if (children) {
      for (let j = 0; j < children.length; j++) {
        const child = children[j];

        if (child.slug === slug) {
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
    nextListItem
  };
};
