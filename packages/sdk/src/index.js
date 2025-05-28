import axios from "axios";

class Operational {
  key;
  http;
  version = "v1";
  baseUrl = `https://api.operational.co`;
  silentError = false;
  test = false;
  debug = false;

  constructor(key, opts = {}) {
    if (!key) {
      if (typeof process !== "undefined" && process.env) {
        this.key = process.env.OPERATIONAL_API_KEY;
      }

      if (!this.key) {
        throw "Missing API key. Pass it to the constructor";
      }
    }

    if (opts.debug) {
      this.debug = true;
    }

    this.key = key;

    let baseUrl = opts.baseUrl || this.baseUrl;

    if (opts.test) {
      this.test = true;
    }

    this.http = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json"
      }
    });
  }

  logError(str) {
    if (this.debug) {
      console.log(str);
    }
  }

  formatError(err) {
    if (err && err.response && err.response.data) {
      let status = err.response.status;
      status = parseInt(status);
      if (status >= 500) {
        this.logError(`Err ${status}`);
      } else {
        this.logError(err.response.data);
        this.logError(err.response.status);
      }
    } else {
      this.logError(err);
    }
  }

  events = {
    ingest: async (event) => {
      let data = null;
      if (!event) {
        throw `missing event data`;
      }
      let url = `api/${this.version}/log`;
      if (this.test) {
        event.test = true;

        console.log(`Sending test event`);
      }
      try {
        data = await this.http.post(url, event);
      } catch (err) {
        if (!this.silentError) {
          //throw err;
        }
        this.formatError(err);
      }

      return data;
    }
  };

  // depreciated but we'll bring it back
  users = {
    identify: async (user) => {
      if (!user) {
        throw `missing user data`;
      }
      let url = `api/${this.version}/identify`;
      try {
        await this.http.post(url, user);
      } catch (err) {
        if (!this.silentError) {
          //throw err;
        }
        this.formatError(err);
      }
    }
  };

  // for the future
  reports = {
    //maybe send custom data source
    sendData: async () => {}
  };

  // for the future
  crm = {
    updateProfile: async () => {}
  };
}

export default Operational;
