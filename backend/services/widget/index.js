import prisma from "#lib/prisma.js";
import axios from "axios";

class Widget {
  async setup() {
    return true;
  }

  async check() {
    let widgets = await prisma.widget.findMany({
      include: {},
    });

    for (let i = 0; i < widgets.length; i++) {
      let widget = widgets[i];

      let url = widget.url;

      //url = url.replace(`https://api.swipekit.app`, `https://bear-regular-shrimp.ngrok-free.app`);

      let res = null;

      try {
        res = await axios.get(url);
      } catch (err) {
        if (err?.response?.data) {
          console.log(err.response.data);
        } else {
          console.log(err);
        }
      }

      if (!res) {
        continue;
      }

      let data = res.data;

      res = await prisma.widgetCache.create({
        data: {
          widgetId: widget.id,
          data: data,
        },
      });
    }
  }
}

export default new Widget();
