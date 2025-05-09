function modifyConsoleLog() {
  ["log", "warn", "error"].forEach((methodName) => {
    const originalMethod = console[methodName];
    console[methodName] = (...args) => {
      let initiator = "unknown place";
      try {
        throw new Error();
      } catch (e) {
        if (typeof e.stack === "string") {
          let isFirst = true;
          for (const line of e.stack.split("\n")) {
            const matches = line.match(/^\s+at\s+(.*)/);
            if (matches) {
              if (!isFirst) {
                initiator = matches[1]
                  .replace(/^(.+?) \((file:\/\/)?/, "$1 ")
                  .replace(/\)$/, "")
                  .replace(/^file:\/\//, "")
                  .replace(/\/{2,}/g, "/");
                break;
              }
              isFirst = false;
            }
          }
        }
      }
      const gray = "\x1b[90m";
      const reset = "\x1b[0m";
      originalMethod.apply(console, [...args, `\n`, `${gray}-> ${initiator}${reset}`]);
    };
  });
}

export default modifyConsoleLog;
