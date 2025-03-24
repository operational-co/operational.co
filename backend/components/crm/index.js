import Crm from "./model.js";

const component = {
  async find(params) {
    const users = await Crm.find(params);

    return users;
  },
};

export default component;
