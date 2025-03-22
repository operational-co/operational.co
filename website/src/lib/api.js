import axios from "axios";

const api = {
  user: {
    get: async () => {
      const resource = await axios.get("/api/user");

      const data = resource.data || {};

      const users = data.resources || [];

      return users;
    },
  },
};

export default api;
