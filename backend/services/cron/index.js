import { Cron } from "croner";
import Db from "#services/db/index.js";
import Workspace from "#components/workspace/index.js";
import ops from "#lib/ops.js";
import config from "#lib/config.js";
import Session from "#services/session/index.js";

function temp() {
  //console.log("ran temp");
}

class CronTab {
  options = {
    utcOffset: 0,
    start: false,
  };

  async setup() {
    this.setupJobs();
  }

  async setupJobs() {
    /**
     * This one will wipe test events after some time
     */
    new Cron("0 9 * * *", this.options, Db.removeTestEvents.bind(Db));

    /**
     * Removes events after x num of days. Only for self_hosted for now
     */
    new Cron("0 9 * * *", this.options, Db.removeOldEvents.bind(Db));

    /**
     * Build a event name cache for all workspaces. Runs every 6 hours
     */
    new Cron("0 */6 * * *", this.options, Workspace.generateEventNames.bind(Workspace));

    /**
     * Builds categories every 10 seconds
     */
    new Cron("*/10 * * * * *", this.options, Workspace.recomputeCategories.bind(Workspace));

    /**
     * Most important cronjob. Run billing cycle on the 1st,2nd,3rd and 4th of the month
     */
    if (!config.SELFHOSTED) {
      new Cron("0 0 1 * *", this.options, Workspace.billUsers.bind(Workspace));
      new Cron("0 0 2 * *", this.options, Workspace.billUsers.bind(Workspace));
      new Cron("0 0 3 * *", this.options, Workspace.billUsers.bind(Workspace));
      new Cron("0 0 4 * *", this.options, Workspace.billUsers.bind(Workspace));
    }

    /**
     * Calculates usage every 10 minutes for all workspaces
     */
    new Cron("*/10 * * * *", this.options, Workspace.calculateMetrics.bind(Workspace));

    /**
     * Sends marketing-esque emails
     */
    if (!config.SELFHOSTED) {
      new Cron("12 * * * *", this.options, Workspace.sendLifecycleEmails.bind(Workspace));
    }

    /**
     * Calculates usedFreeEvents for workspaces. Runs every 15 minutes. Depends on metrics to be precalculated.
     * Also deactivates Workspaces
     */
    if (!config.SELFHOSTED) {
      new Cron("*/15 * * * *", this.options, Workspace.calculateUsedFreeEvents.bind(Workspace));
    }

    /**
     * Basic healthcheck
     */
    new Cron("* * * * *", this.options, temp);
  }
}

export default new CronTab();
