import Events from "#components/events/model.js";

//import Person from "#models/person.js";

import Webpush from "#services/webpush/index.js";

const component = {
  async ingestLog(payload, user) {
    const log = await Events.ingest(payload).catch((err) => {
      throw err;
    });

    await Webpush.sendNotification(log, user);

    return log;
  },

  async ingestUser(body) {
    // const person = await Person.ingest(body).catch((err) => {
    //   throw err;
    // });
    // return person;
  },

  async find(workspaceId) {
    const events = await Events.client
      .findMany({
        where: {
          workspaceId: workspaceId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      .catch((err) => {
        throw err;
      });

    return events;
  },
};

export default component;
