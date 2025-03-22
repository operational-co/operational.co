class Hook {
  constructor() {
    this.hooks = {};
  }

  async setup() {}

  // Register a hook with an additional stack trace
  registerHook(name, callback) {
    if (!this.hooks[name]) {
      this.hooks[name] = [];
    }
    const error = new Error();
    const stack = error.stack || "";
    this.hooks[name].push({ callback, stack });
  }

  // Execute all hooks for a given name
  async executeHooks(name, context) {
    if (this.hooks[name]) {
      for (const hook of this.hooks[name]) {
        console.log(`Executing hook for '${name}' registered at: ${this.getStackLocation(hook.stack)}`);
        await hook.callback(context);
      }
    }
  }

  // Extracts approximate registration location from the stack trace
  getStackLocation(stack) {
    const stackLines = stack.split("\n");
    // Adjust the index below depending on where the relevant line usually appears in your environment
    return stackLines[3] || "unknown location";
  }

  // Function to execute hooks
  async hook(name, context) {
    await this.executeHooks(name, context);
  }
}

// Example usage of registering and executing hooks with logging of their registration points
// registerHook("preRoute", async (context) => {
//   console.log("First preRoute hook", context);
// });
// registerHook("preRoute", async (context) => {
//   console.log("Second preRoute hook", context);
// });

export default new Hook();
