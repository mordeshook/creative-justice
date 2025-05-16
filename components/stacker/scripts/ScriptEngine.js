// components/stacker/scripts/ScriptEngine.js

export class ScriptEngine {
  constructor() {
    this.logs = [];
  }

  execute(scripts, context = {}) {
    if (!Array.isArray(scripts)) return;
    for (const script of scripts) {
      try {
        if (typeof script === "function") {
          script(context);
        } else if (typeof script === "string") {
          const fn = new Function("ctx", script);
          fn(context);
        }
      } catch (err) {
        this.logs.push(`[Script Error]: ${err.message}`);
        console.error("ScriptEngine Error:", err);
      }
    }
  }

  log(msg) {
    this.logs.push(`[Log]: ${msg}`);
    console.log(msg);
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}
