import pino from "pino";

// Create a Pino logger instance
let option = {
  level: "info",
  transport: {
    ignore: "pid,hostname",
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS: mm/dd hh:mm",
    },
  },
};
const logger = pino(option);

export default logger;
