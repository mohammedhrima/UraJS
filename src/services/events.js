import Ura from "ura";
import api from "./api.js";
import Toast from "../components/Toast.js";

const Allowed = []
const handlers = {}

function check(name) {
  if (Allowed.includes(name)) return
  throw new Error(`Unknown event ${name} add it to allowed events`);
}

function add(name, handler) {
  console.warn("add event", name);
  check(name)
  if (handlers[name]) throw new Error(`${name} already exists`)
  handlers[name] = {
    handler: handler,
    children: {}
  }
}

function emit(name, ...args) {
  check(name)
  handlers[name].handler(args);
  Object.keys(handlers[name].children).forEach(key => {
    console.log("emit child", key, "func:", handlers[name].children[key], "with arg", args);

    const isAsyncFunction = (fn) => fn.constructor.name === "AsyncFunction";
    if (isAsyncFunction(handlers[name].children[key]))
      (async () => await handlers[name].children[key](args))();
    else handlers[name].children[key](args)
  });
}

function emitChildren(name, ...args) {
  check(name)
  Object.keys(handlers[name].children).forEach(key => {
    console.log("emit child", key, "func:", handlers[name].children[key], "with arg", args);

    const isAsyncFunction = (fn) => fn.constructor.name === "AsyncFunction";
    if (isAsyncFunction(handlers[name].children[key]))
      (async () => await handlers[name].children[key](args))();
    else handlers[name].children[key](args)
  });
}

function addChild(name, childname, child) {
  check(name)
  console.log(handlers[name]);
  handlers[name].children[childname] = child;
}

function remove(name) {
  check(name)
  handlers[name] = undefined;
}

const events = {
  add,
  addChild,
  emit,
  emitChildren,
  remove,
}

export default events