import UserModel from "#components/user/model.js";
import { v4 as uuidv4 } from "uuid";
import config from "#lib/config.js";
import moment from "moment";
import prisma from "#lib/prisma.js";

class Session {
  sessionCache = [];
  loaded = false;

  async setup() {
    // Purposefully removed async so it doesn't hold up startup times
    this.inSetup();

    return true;
  }

  async inSetup() {
    // Remove expired sessions
    await this.removeExpiredSessions();

    // get all sessions and build cache

    await this.buildCache();
    // Once cache is loaded(warmed up), set loaded to true to ensure all api requests fetch the sid from the cache
    this.loaded = true;

    setInterval(() => {
      this.removeExpiredSessions();
      this.buildCache();
    }, 10000);
  }

  async validate(sid) {
    if (!sid) {
      return;
    }
    // Until cache hasn't been loaded, fetch sid directly from the db.
    if (!this.loaded) {
      const session = await prisma.session.findUnique({
        where: {
          sid: sid,
        },
      });
      return session || null;
    }

    // Otherwise, check cache.
    let sessionCache = this.sessionCache;
    let session = null;
    for (let i = 0; i < sessionCache.length; i++) {
      if (sessionCache[i].sid === sid) {
        session = sessionCache[i];
        break;
      }
    }

    return session;
  }

  async buildCache() {
    let sessions = await prisma.session.findMany({});

    if (sessions && sessions.length > 0) {
      this.sessionCache = sessions;
    } else {
      this.sessionCache = [];
    }
  }

  // Updates all sessions with the correct user data
  async updateAllSessions() {
    await this.buildCache();
  }

  async extend(session) {
    const id = session.id;

    const sessionLength = config.sessionLength;

    let expiresAt = moment(session.expiresAt).subtract(sessionLength, "days");
    let currentDate = moment.utc();

    let diff = currentDate.diff(expiresAt, "second");

    // Don't extend if session is more than an hour old
    if (diff < 3600) {
      // 3600
      return session;
    }

    const date = moment.utc().add(sessionLength, "days").toISOString();

    let user = await UserModel.findById(session.userId);

    let newUser = this.userToSessionUser(user);

    let data = {
      user: newUser,
      expiresAt: date,
    };

    /**
     * Update the cache with the expiresDate and a updated user record
     */
    const updatedSession = await prisma.session
      .update({
        where: {
          sid: session.sid,
        },
        data: data,
      })
      .catch((err) => {
        console.log(id);
        console.log(err);
      });

    // Also update the cache
    if (updatedSession) {
      let updatePerformed = false;
      for (let i = 0; i < this.sessionCache.length; i++) {
        let sesh = this.sessionCache[i];
        if (sesh.sid === session.sid) {
          updatePerformed = true;
          this.sessionCache[i] = updatedSession;
          break;
        }
      }
      if (!updatePerformed) {
        this.sessionCache.push(updatedSession);
      }
    }

    return updatedSession;
  }

  async removeExpiredSessions() {
    const now = new Date();

    // Step 1: Find all expired sessions
    const expiredSessions = await prisma.session.findMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
      select: {
        sid: true,
      },
    });

    // Step 2: Invalidate each session (cleans cache + pushes)
    for (const session of expiredSessions) {
      await this.invalidate(session.sid);
    }

    return expiredSessions.length;
  }

  async generate(user, userAgent = "") {
    const sid = uuidv4();

    let sessionDays = config.sessionLength;

    const date = moment.utc().add(sessionDays, "days").toISOString();

    let newUser = this.userToSessionUser(user);

    const session = await prisma.session
      .upsert({
        where: {
          sid: sid,
        },
        update: {
          userId: user.id,
          expiresAt: date,
          user: newUser,
          userAgent,
        },
        create: {
          sid: sid,
          userId: user.id,
          expiresAt: date,
          user: newUser,
          userAgent,
        },
      })
      .catch((err) => {
        console.log(err);
      });

    // also upsert cache
    if (session) {
      let updated = false;
      for (let i = 0; i < this.sessionCache.length; i++) {
        let sess = this.sessionCache[i];
        if (sess.sid === session.sid) {
          this.sessionCache[i] = session;
          updated = true;
          break;
        }
      }
      if (!updated) {
        this.sessionCache.push(session);
      }
    }

    return session;
  }

  // basically, remove session
  async invalidate(sid) {
    // First, find the session to get userId
    const session = await prisma.session.findUnique({
      where: { sid },
      select: { userId: true },
    });

    const condition = await prisma.session.delete({
      where: {
        sid: sid,
      },
    });

    // Then remove from cache
    this.sessionCache = this.sessionCache.filter((session) => {
      if (session.sid === sid) {
        return false;
      }

      return true;
    });

    // and also remove the associated push subscription if any
    await prisma.push.deleteMany({
      where: {
        sid: sid,
        userId: session.userId,
      },
    });

    return condition;
  }

  // Update all sessions associated with a user
  async update(user, sid = null) {
    let updatedSession = null;

    let newUser = this.userToSessionUser(user);

    const session = await prisma.session
      .update({
        where: {
          userId: user.id,
          sid: sid,
        },
        data: {
          user: newUser,
        },
      })
      .catch((err) => {
        console.log(err);
      });

    if (session.sid === sid) {
      updatedSession = session;
    }

    await this.buildCache();

    return updatedSession;
  }

  userToSessionUser(user) {
    let newUser = {
      id: user.id,
      createdAt: user.createdAt,
      primaryWorkspace: user.primaryWorkspace,
      firstName: user.firstName,
      lastName: user.lastName,
      activated: user.activated,
      onboarded: user.onboarded,
      status: user.status,
    };

    return newUser;
  }
}

export default new Session();
