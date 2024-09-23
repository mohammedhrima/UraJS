class Logger {
  log(...args) {
    console.log(...args);
  }
  info(...args) {
    console.log("%c" + args.join(" "), "color: blue;");
  }
  warn(...args) {
    console.warn("%c" + args.join(" "), "color: orange;");
  }
  error(...args) {
    console.error("%c" + args.join(" "), "color: red;");
  }
  check(...args) {
    console.log("%c" + args.join(" "), "color: green;");
  }
}

// Example usage
const debug = new Logger();
export default debug;
