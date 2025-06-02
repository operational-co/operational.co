import User from "./model.js";
import Workspace from "#components/workspace/model.js";

import config from "#lib/config.js";
import generateJwt from "#lib/generate-jwt.js";
import verifyJwt from "#lib/verify-jwt.js";
import prisma from "#lib/prisma.js";

import Pdf from "#services/pdf/index.js";
import Key from "#services/key/index.js";
import Email from "#services/email/index.js";
import Session from "#services/session/index.js";
import Billing from "#services/billing/index.js";

import Stripe from "stripe";
import { customAlphabet } from "nanoid";
import ops from "#lib/ops.js";
import moment from "moment";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 24);

const stripe = Stripe(`${config.stripe.TEST_SECRET}`);

const component = {
  async switchWorkspace(user, newWorkspace, sid) {
    newWorkspace = parseInt(newWorkspace);
    user = await User.client.update({
      where: {
        id: user.id,
      },
      data: {
        primaryWorkspace: newWorkspace,
      },
    });

    const updatedSession = await Session.update(user, sid);

    //let session = await Session.generate(user);

    const jwt = generateJwt(updatedSession.sid);

    return jwt;
  },

  async resetPasswordRequest(form = {}) {
    if (!form.email) {
      return;
    }

    let user = await User.findByEmail(form.email).catch((err) => {
      console.log(err);
    });

    if (!user) {
      return;
    }

    let token = `tk_${nanoid()}`;

    user = await User.client
      .update({
        where: {
          id: user.id,
        },
        data: {
          resetPasswordToken: token,
        },
      })
      .catch((err) => {
        console.log(err);
      });

    if (user) {
      // send email to user
      await Email.onResetPasswordRequest(user);
    }
  },

  async login(form = { email: "", password: "", userAgent: "" }) {
    let resource = {
      email: form.email,
      password: form.password,
    };
    try {
      let user = await User.login(resource).catch((err) => {
        throw err;
      });

      const session = await Session.generate(user, form.userAgent);

      const jwt = generateJwt(session.sid);

      user = await User.getPie(user.id);

      return {
        jwt,
        user,
      };
    } catch (err) {
      throw err;
    }
  },

  async signup(form = null) {
    if (!form) {
      throw `Signup data is empty`;
    }
    form = {
      ...form,
      settings: {
        snooze: 0,
        timezone: form.timezone || "",
        utcOffset: form.utcOffset || "",
        military_time: false,
      },
      meta: form.meta || {},
    };
    try {
      console.time("user record creation");
      const user = await User.signup(form).catch((err) => {
        throw err;
      });
      console.timeEnd("user record creation");

      let temp = {
        ...user,
        workspaceId: user.primaryWorkspace,
        workspace: user.primaryWorkspace,
      };

      console.time("key generation");
      // then generate api key
      const apikey = await Key.generate(
        user.primaryWorkspace,
        "Default key - created on signup",
      ).catch((err) => {
        // log something here
      });
      console.timeEnd("key generation");

      console.time("key cache");
      await Key.buildCache();
      console.timeEnd("key cache");

      console.time("pie");
      const newUser = await User.getPie(user.id);
      console.timeEnd("pie");

      await Billing.createCustomer(user, user.primaryWorkspace).catch((err) => {
        console.log(err);
      });

      // send activation code
      console.time("activation send");
      await this.sendActivation(user);
      console.timeEnd("activation send");

      // generate session
      console.time("session creation");
      const session = await Session.generate(temp);

      const jwt = generateJwt(session.sid);
      console.timeEnd("session creation");

      await ops.events.ingest({
        avatar: "😃",
        name: `User signup`,
        category: "user",
        contextStart: true,
        contextId: `user-signup-${user.id}`,
      });

      return {
        jwt,
        user: newUser,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // Sets code to activate the user and sends it off in a email
  async sendActivation(user) {
    // generate a 6 digit code
    let code = Math.floor(100000 + Math.random() * 900000);
    code = `ops-activate-${code}`;

    let form = {
      id: user.id,
      activationCode: code,
    };

    await User.update(form);

    const workspace = await Workspace.findById(user.primaryWorkspace);

    await Email.sendActivationEmail(user, workspace, code);

    await ops.events.ingest({
      avatar: "✉️",
      name: `User activation email sent`,
      contextId: `user-signup-${user.id}`,
    });
  },

  async logout(token) {
    const decoded = verifyJwt(token);

    const sid = decoded.sid;

    if (!sid) {
      return;
    }

    await ops.events.ingest({
      avatar: "🚪",
      name: `User logged out`,
      category: "user",
      type: "json",
      content: decoded,
    });

    await Session.invalidate(sid);
  },

  async update(form) {
    await ops.events.ingest({
      avatar: "📋",
      name: `User updated their settings`,
      category: "user",
      type: "json",
      content: form,
    });

    if (form.hasOwnProperty("notify")) {
      await prisma.workspaceUser.update({
        where: {
          userId_workspaceId: {
            userId: form.id,
            workspaceId: form.workspaceId,
          },
        },
        data: {
          notify: form.notify,
        },
      });
      delete form.notify;
    }
    delete form.workspaceId;

    let user = await User.update(form);

    // refers to the sent form
    if (form.onboarded) {
      await Email.userWelcome(user).catch((err) => {
        console.log(err);
      });
    }

    //console.log(user);

    return user;
  },

  async updatePassword(form, user) {
    user = await User.client.findUnique({
      where: {
        id: user.id,
      },
    });

    // first, check if old password matches
    let matches = await User.checkPassword(form.currentPassword, user.password);

    if (!matches) {
      throw "Your old password is incorrect";
    }

    // then check if new passwords match
    if (form.password1 !== form.password2) {
      throw `Your new passwords don't match`;
    }

    // finally, a simple validity check
    if (form.password1.length < 8) {
      throw "Your new password should be at least 8 characters long";
    }

    // Update password
    let newPassword = await User.signPassword(form.password1);

    user = await User.update({
      id: user.id,
      password: newPassword,
    });

    // Then email user and send me a notification
    //Events.sendBotMessage(`${user.email} ${user.id} | password has changed`);
    //Email.onUserPasswordUpdate(user);

    return user;
  },

  async updateEmail(form, user) {
    // first, check if any user has this email already
    let users = await User.client.findMany({
      where: {
        email: form.email,
      },
    });

    if (users.length > 0) {
      throw "This email cannot be used, please try another email.";
    }

    // first, generate a unique token
    let token = nanoid();

    // Then send this token to the user's new email address. See if they click the link in the token.

    // Lastly, save this token on the user model
  },

  async createIntent(baseUser) {
    const workspace = await Workspace.findById(baseUser.primaryWorkspace);

    console.log(workspace);

    let customerId = workspace.customerId;

    const paymentIntent = await stripe.setupIntents.create({
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const date = moment().utc().toISOString();

    await Workspace.client.update({
      where: {
        id: baseUser.primaryWorkspace,
      },
      data: {
        status: "NORMAL",
        paymentStartedAt: date,
        holdAt: null,
      },
    });

    console.log(paymentIntent);

    return paymentIntent;
  },

  async billCustomer() {
    let customerId = `cus_QHJmGtWfUi83L5`;

    let paymentMethods = await stripe.customers.listPaymentMethods(customerId, {
      limit: 3,
    });

    if (!paymentMethods) {
      return;
    }

    if (paymentMethods.data.length === 0) {
      return;
    }

    let paymentMethod = paymentMethods.data[0];

    const intent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "USD",
      customer: customerId,
      confirm: true,
      off_session: true,
      payment_method: paymentMethod.id,
    });

    await this.afterSuccessfullCharge(customerId);
  },

  async afterSuccessfullCharge() {
    const workspace = {
      id: 1,
      companyName: "Shash7 pty ltd",
      admin: {
        email: "shash122tfu@gmail.com",
      },
    };

    const invoice = {
      period_start: `2024-06-12T09:42:58+0000`,
      period_end: `2024-06-12T09:42:58+0000`,
      total: 1000,
      subtotal: 1000,
      amount_due: 1000,
      number: 1,
    };

    await Pdf.createInvoice(workspace, invoice);
  },

  async getBillingData(user) {
    let workspace = await Workspace.findById(user.primaryWorkspace);

    let customerId = workspace.customerId;

    if (!customerId) {
      const customer = await Billing.createCustomer(user, workspace.id);
      customerId = customer.id;
    }

    let setupIntents = await Billing.getSetupIntents(workspace.customerId);
    let paymentMethods = await Billing.getPaymentMethods(workspace.customerId);

    return { setupIntents, paymentMethods };
  },

  async cancelSubscription(user) {
    let workspace = await Workspace.findById(user.primaryWorkspace);

    // Cancel all setupIntents - we won't be able to charge their card again after this
    await Billing.cancelSetupIntents(workspace.customerId);

    // Mark them as deactivated
    let date = moment().utc().toISOString();
    await Workspace.update({
      id: workspace.id,
      paymentStoppedAt: date,
    });
  },

  async setup(form) {
    if (!form) {
      throw `Signup data is empty`;
    }
    form = {
      ...form,
      settings: {
        snooze: 0,
        timezone: form.timezone || "",
        utcOffset: form.utcOffset || "",
        military_time: false,
      },
      meta: form.meta || {},
    };

    try {
      console.time("user record creation");
      const user = await User.signup(form, true).catch((err) => {
        throw err;
      });
      console.timeEnd("user record creation");

      let temp = {
        ...user,
        workspaceId: user.primaryWorkspace,
        workspace: user.primaryWorkspace,
      };

      // generate session
      console.time("session creation");
      const session = await Session.generate(temp);

      const jwt = generateJwt(session.sid);
      console.timeEnd("session creation");

      console.time("key generation");
      // then generate api key
      const apikey = await Key.generate(
        user.primaryWorkspace,
        "Default key - created on signup",
      ).catch((err) => {
        // log something here
      });
      console.timeEnd("key generation");

      console.time("key cache");
      await Key.buildCache();
      console.timeEnd("key cache");

      console.time("pie");
      const newUser = await User.getPie(user.id);
      console.timeEnd("pie");

      await ops.log(`avatar:😃 User signup`);

      return {
        jwt,
        user: newUser,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async demoLogin(form) {
    const name = form.name;

    if (name !== "kevin") {
      return;
    }

    const email = "kevinbacon@mailinator.com";

    let resource = {
      email: email,
    };

    try {
      let user = await User.login(resource, true).catch((err) => {
        throw err;
      });

      const session = await Session.generate(user, form.userAgent);

      const jwt = generateJwt(session.sid);

      user = await User.getPie(user.id);

      return {
        jwt,
        user,
      };
    } catch (err) {
      throw err;
    }
  },
};

export default component;
