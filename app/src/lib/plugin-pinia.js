// pinia-plugin.js
import { useEventsStore } from "../store/events";
import { useCrmStore } from "../store/crm";
import { useAppStore } from "../store/app";
import { useUserStore } from "../store/user";
import { useReportsStore } from "../store/reports";
import { useWorkspaceStore } from "../store/workspace";
import { useMetricStore } from "../store/metric";
import { useInvoicesStore } from "../store/invoices";

export default {
  install: (app) => {
    // Set your store(s) as global properties
    app.config.globalProperties.$store = {
      events: useEventsStore(),
      crm: useCrmStore(),
      app: useAppStore(),
      user: useUserStore(),
      reports: useReportsStore(),
      workspace: useWorkspaceStore(),
      metric: useMetricStore(),
      invoices: useInvoicesStore(),
    };
  },
};
