import { spawn } from "child_process";
import { EventEmitter } from "events";

export default class FEH extends EventEmitter {
  constructor(basePath, options = {}) {
    super();
    this.basePath = basePath;
    this.process = null;
    this.reloadInterval = options.reloadInterval || 60;
    this.slideshowDelay = options.slideshowDelay || 10;
    this.errors = "";
  }

  kill() {
    if (this.process) {
      console.log("Killing FEH process");
      this.process.kill();
      this.process = null;
    }
  }

  start() {
    console.log("Starting FEH");
    if (this.process) {
      throw new Error("FEH already started");
    }
    const params = [
      "--fullscreen",
      "--reload",
      this.reloadInterval,
      "--slideshow-delay",
      this.slideshowDelay,
      "--auto-zoom",
      this.basePath,
    ];
    this.process = spawn("feh", params);

    this.process.stdout.on("data", (data) => {
      console.log(data.toString());
      this.emit("stdout", data);
    });

    this.process.stderr.on("data", (data) => {
      console.error(data.toString());
      this.errors += data.toString();
      // Only get the last 10000 characters
      this.errors = this.errors.slice(-10000);
      this.emit("stderr", data);
    });

    this.process.on("close", (code) => {
      console.log("FEH process exited with code", code);
      const reason = this.errors.match(/Error:.*\n/)?.[0] || "Unknown error";
      this.emit("close", { code, reason, errors: this.errors });
      this.kill();
      console.log("Waiting a second to restart FEH");
      // Restart the process after a second
      setTimeout(() => this.start(), 1000);
    });
  }
}
