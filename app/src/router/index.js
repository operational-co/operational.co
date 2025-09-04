import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/pages/index.vue";
import Crm from "../components/pages/crm.vue";
import Dashboards from "../components/pages/dashboards.vue";
import Docs from "../components/pages/docs.vue";

import Login from "../components/pages/login.vue";
import Signup from "../components/pages/signup.vue";

import Notifications from "../components/settings/notifications.vue";
import Profile from "../components/settings/profile.vue";
import Token from "../components/settings/token.vue";
import Project from "../components/settings/project.vue";
import Billing from "../components/settings/billing.vue";
import Invoices from "../components/settings/invoices.vue";
import Usage from "../components/settings/usage.vue";
import Server from "../components/settings/server.vue";

import Settings from "../components/pages/settings.vue";

import Picker from "../components/picker/index.vue";

import Playground from "../components/pages/playground.vue";

import Offline from "../components/pages/offline.vue";

import Styleguide from "../components/pages/styleguide.vue";

import { useUserStore } from "@/store/user.js";
import { useAppStore } from "@/store/app.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/crm",
    name: "Crm",
    component: Crm,
  },
  {
    path: "/dashboards",
    name: "Dashboards",
    component: Dashboards,
  },
  {
    path: "/docs",
    name: "Docs",
    component: Docs,
  },

  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    children: [
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
      },
      {
        path: "profile",
        name: "Profile",
        component: Profile,
      },
      {
        path: "token",
        name: "API Token",
        component: Token,
      },
      {
        path: "project",
        name: "Project",
        component: Project,
      },
      {
        path: "billing",
        name: "Billing",
        component: Billing,
      },
      {
        path: "invoices",
        name: "Invoices",
        component: Invoices,
      },
      {
        path: "usage",
        name: "Usage",
        component: Usage,
      },
      {
        path: "server",
        name: "Server",
        component: Server,
      },
    ],
  },

  {
    path: "/picker",
    name: "Picker",
    component: Picker,
  },

  {
    path: "/playground",
    name: "Playground",
    component: Playground,
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },

  {
    path: "/offline",
    name: "Offline",
    component: Offline,
  },

  {
    path: "/styleguide",
    name: "Styleguide",
    component: Styleguide,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
