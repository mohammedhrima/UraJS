import {
   IF, ELSE, LOOP, EXEC, CREATE, REPLACE, REMOVE,
   ELEMENT, FRAGMENT, TEXT, deepEqual, loadCSS, svgElements, deepCopy,
} from "./utils.js";
import { VDOM, Props, Tag } from "./types.js";

// JSX
function check(children: any): any {
   let result = [];
   children.forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
         result.push({
            type: TEXT,
            props: {
               value: child,
            },
         });
      }
      else if (Array.isArray(child)) {
         result.push(...check(child));
      }
      else if (child != undefined && child) result.push(child);
   });
   return result;
}

function fr(props: Props = {}, ...children: any) {
   return children;
}

let uraifTag = null;
let conds = [];
function e(tag: Tag, props: Props = {}, ...children: any) {
   if (typeof tag === "function") {
      let functag = null;
      let tmp = deepCopy(conds);
      conds = [];
      try {
         functag = tag(props, children);
         if (!functag) throw `function must return render(()=>(JSX)): ${tag}`;
      } catch (error) {
         console.error(error);
      }
      conds = tmp;
      if (!functag) return [];
      functag.isfunc = true;
      functag.funcProps = props;
      functag.func = tag;
      return functag;
   }

   if (tag === "ura-if") {
      conds.push({ cond: props.cond }); // push current statement
      if (props.cond === true) return check(children || []);
      return [];
   } else if (tag === "ura-elif") {
      const last = conds[conds.length - 1];
      if (!last) {
         console.error("ura-elif tag should have a previous ura-if/ura-elif statament tag");
         return [];
      }

      if (last.cond) return []; // if last if/elif is true
      conds.pop(); // remove last if/elif statament
      conds.push({ cond: props.cond }); // push current statement
      if (!props.cond) return [];
      return check(children || []);
   } else if (tag === "ura-else") {
      const last = conds[conds.length - 1];
      if (!last) {
         console.error("ura-else tag should have a previous ura-if/ura-elif statament tag");
         return [];
      }
      conds.pop(); // remove last if/elif statament
      if (last.cond) return []; // if last if/elif is true
      return check(children || []);
   } else if (tag === "exec") {
      return {
         type: EXEC,
         tag: "exec",
         call: props.call,
         children: [],
      };
   } else if (tag === "ura-loop") {
      // console.warn("loop / dloop tags are depricated");
      let loopChildren = (props.on || []).flatMap((elem, id) =>
         (children || []).map((child) => {
            const evaluatedChild = typeof child === "function" ? child(elem, id) : child;
            return deepCopy(evaluatedChild);
         })
      );
      return check(loopChildren || []);
   }
   //@ts-ignore
   else if (props && props["ura-if"] !== undefined) {
      conds.push({ cond: props["ura-if"] }); // push current statement
      if (!props["ura-if"]) return [];
      return {
         type: ELEMENT,
         tag: tag,
         props: props,
         children: check(children || [])
      };
   }
   // @ts-ignore
   else if (props && props["ura-elif"] !== undefined) {
      const last = conds[conds.length - 1];
      if (!last) {
         console.error("ura-elif tag should have a previous ura-if/ura-elif statament tag");
         return [];
      }
      
      if (last.cond) return []; // if last if/elif is true

      conds.pop(); // remove last if/elif statament
      conds.push({ cond: props["ura-elif"] }); // push current statement
      if (!props["ura-elif"]) return [];

      return {
         type: ELEMENT,
         tag: tag,
         props: props,
         children: check(children || [])
      };
   }
   // @ts-ignore
   else if (props && props["ura-else"] !== undefined) {
      const last = conds[conds.length - 1];
      if (!last) {
         console.error(tag, "with attribute ura-else should have a previous ura-if/ura-elif statament tag");
         return [];
      }

      conds.pop(); // remove last if/elif statament
      if (last.cond) return []; // if last if/elif is true

      return {
         type: ELEMENT,
         tag: tag,
         props: props,
         children: check(children || []),
      };
   }
   else if (tag === "ura-loop") {
      let loopChildren = (props["on"] || []).flatMap((elem, id) =>
         (children || []).map((child) => {
            const evaluatedChild = typeof child === "function" ? child(elem, id) : child;
            return deepCopy(evaluatedChild);
         })
      );
      return loopChildren;
   }
   //@ts-ignore
   else if (props && props["ura-loop"] != undefined) {
      let loopChildren = (props["ura-loop"] || []).flatMap((elem, id) =>
         (children || []).map((child) => {
            const evaluatedChild = typeof child === "function" ? child(elem, id) : child;
            return deepCopy(evaluatedChild);
         })
      );
      return {
         type: ELEMENT,
         tag: tag,
         props: props,
         children: loopChildren,
      };
   }
   return {
      type: ELEMENT,
      tag: tag,
      props: props,
      children: check(children || []),
   };
}

// DOM
function setProps(vdom) {
   const { tag, props } = vdom;
   const style = {};
   Object.keys(props || {}).forEach((key) => {
      if (key === "class") {
         console.warn("Invalid property 'class' did you mean 'className' ?", vdom);
         key = "className";
      }
      if (key.startsWith("on")) {
         const eventType = key.slice(2).toLowerCase();
         if (eventType === "hover") {
            vdom.dom.addEventListener("mouseover", props[key]);
            vdom.dom.addEventListener("mouseout", props[key]);
         } else vdom.dom.addEventListener(eventType, props[key]);
      } else if (key === "style") Object.assign(style, props[key]);
      else {
         if (svgElements.has(tag)) vdom.dom.setAttribute(key, props[key]);
         else vdom.dom[key] = props[key];
      }
   });
   if (Object.keys(style).length > 0) {
      vdom.dom.style.cssText = Object.keys(style)
         .map((styleProp) => {
            const Camelkey = styleProp.replace(
               /[A-Z]/g,
               (match) => `-${match.toLowerCase()}`
            );
            return `${Camelkey}:${style[styleProp]}`;
         })
         .join(";");
   }
}

let ExecStack = [];
let GlobalVDOM = null;

function createDOM(vdom): VDOM {
   switch (vdom.type) {
      case ELEMENT: {
         if (!vdom.tag) return vdom;
         switch (vdom.tag) {
            case "root":
               vdom.dom = document.getElementById("root");
               break;
            case "get":
               console.log("get by ", vdom.props.by);
               vdom.dom = document.querySelector(vdom.props.by);
               break;
            default:
               if (vdom.dom) {
                  console.error("vdom already has dom"); // TODO: to be removed
               } else {
                  if (svgElements.has(vdom.tag))
                     vdom.dom = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        vdom.tag
                     );
                  else vdom.dom = document.createElement(vdom.tag);
               }
               break;
         }
         break;
      }
      case FRAGMENT: {
         vdom.dom = document.createElement("container");
         break;
      }
      case TEXT: {
         if (vdom.props.value === undefined || vdom.props.value === "undefined") {
            console.error("TEXT: found undefiend");
         }
         vdom.dom = document.createTextNode(vdom.props.value);
         break;
      }
      case IF:
      case ELSE:
      case LOOP: {
         vdom.dom = document.createElement(vdom.tag);
         // keep it commented it causes problem when condition change
         // vdom.dom = document.createDocumentFragment();
         break;
      }
      case EXEC: {
         ExecStack.push(vdom.call);
         break;
      }
      default:
         break;
   }
   setProps(vdom);
   return vdom;
}

function removeProps(vdom: VDOM) {
   try {
      const props = vdom.props;
      for (const key of Object.keys(props || {})) {
         if (key == "func" || key == "call") continue;
         if (vdom.dom) {
            if (key.startsWith("on")) {
               const eventType = key.slice(2).toLowerCase();
               vdom.dom?.removeEventListener(eventType, props[key]);
            } else if (key === "style") {
               Object.keys(props.style || {}).forEach((styleProp) => {
                  vdom.dom.style[styleProp] = "";
               });
            } else if (vdom.dom) {
               if (vdom.dom[key] !== undefined) delete vdom.dom[key];
               else vdom.dom?.removeAttribute(key);
            }
         } else delete props[key];
      }
      vdom.props = {};
   } catch (error) {
      // console.log("remove props");
   }
}

function destroy(vdom: VDOM): void {
   removeProps(vdom);
   vdom.dom?.remove();
   vdom.dom = null;
   vdom.children?.map(destroy);
}

// RENDERING
function execute(mode: number, prev: VDOM, next: VDOM = null) {
   switch (mode) {
      case CREATE: {
         createDOM(prev);
         prev.children?.map((child) => {
            if (child) {
               child = execute(mode, child as VDOM);
               prev.dom.appendChild((child as VDOM).dom);
            }
         });
         break;
      }
      case REPLACE: {
         removeProps(prev);
         execute(CREATE, next);

         if (prev.dom && next.dom) prev.dom.replaceWith(next.dom);

         prev.dom = next.dom;
         prev.children = next.children;
         // I commented it because it caused me an error
         // in the slider
         // removeProps(prev);
         prev.props = next.props;
         break;
      }
      case REMOVE: {
         destroy(prev);
         break;
      }
      default:
         break;
   }
   return prev;
}

// RECONCILIATION
function reconciliate(prev: VDOM, next: VDOM) {

   if (prev.type != next.type || prev.tag != next.tag || !deepEqual(prev.props, next.props))
      return execute(REPLACE, prev, next);

   if (next.type === EXEC) {
      prev.call();
      next.call();
   }

   const prevs = prev.children || [];
   const nexts = next.children || [];
   for (let i = 0; i < Math.max(prevs.length, nexts.length); i++) {
      let child1 = prevs[i];
      let child2 = nexts[i];

      if (child1 && child2 && (child1.isfunc || child2.isfunc)) {
         if (!deepEqual(child1.func, child2.func)) {
            execute(REPLACE, child1, child2);
            prevs[i] = child2;
         } else if (!deepEqual(child1.funcProps, child2.funcProps)) {
            execute(REPLACE, child1, child2);
            prevs[i] = child2;
         }
      } else if (child1 && child2) {
         reconciliate(child1 as VDOM, child2 as VDOM);
      } else if (!child1 && child2) {
         if (i >= prevs.length) { // append
            execute(CREATE, child2 as VDOM);
            prevs.push(child2);
            prev.dom.appendChild(child2.dom);
         }
         else { // replace
            execute(CREATE, child2 as VDOM);
            prevs[i] = child2;
         }
      } else if (child1 && !child2) {
         execute(REMOVE, child1 as VDOM);
         prevs[i] = null;
      }
   }
}

function display(vdom: VDOM) {
   if (GlobalVDOM !== null) reconciliate(GlobalVDOM, vdom);
   else {
      execute(CREATE, vdom);
      GlobalVDOM = vdom;
   }
   return GlobalVDOM;
}

export function create(vdom: VDOM) {
   return execute(CREATE, vdom);
}

export function init() {
   let index = 1;
   let vdom = null;
   let states = {};

   let View = () => <empty></empty>;

   const State = (initValue) => {
      const stateIndex = index++;
      states[stateIndex] = initValue;

      const getter = () => states[stateIndex];
      const setter = (newValue) => {
         if (!deepEqual(states[stateIndex], newValue)) {
            states[stateIndex] = newValue;
            updateState();
         }
      };
      return [getter, setter];
   };

   const ForcedState = (initValue) => {
      const stateIndex = index++;
      states[stateIndex] = initValue;

      const getter = () => states[stateIndex];
      const setter = (newValue) => {
         states[stateIndex] = newValue;
         updateState();
      };
      return [getter, setter];
   };

   const WeakState = (initValue) => {
      const stateIndex = index++;
      states[stateIndex] = initValue;

      const getter = () => states[stateIndex];
      const setter = (newValue) => {
         states[stateIndex] = newValue;
      };
      return [getter, setter];
   };

   const updateState = () => {
      const newVDOM = View();
      if (vdom !== null) reconciliate(vdom, newVDOM);
      else vdom = newVDOM;
   };

   const render = (call) => {
      View = call;
      updateState();
      return vdom;
   };
   return [render, State, ForcedState, WeakState];
}

// ROUTING
function ErrorPage(props: Props | null) {
   const [render, State] = init();
   return render(() => (
      <h4 style={{
         fontFamily: "sans-serif", fontSize: "6vw", display: "flex",
         justifyContent: "center", alignItems: "center", textAlign: "center", height: "100%"
      }}>
         Error: [{props.message}] Not Found, check browser console for any details
      </h4>
   ));
}

const Routes: { [path: string]: Function } = {};

function resetRoutes() {
   Object.keys(Routes).forEach((key) => {
      delete Routes[key];
   });
   Routes["*"] = () => ErrorPage({ message: window.location.pathname });
}

resetRoutes();

function cleanPath(path) {
   if (path === "*") return path;
   if (!path.startsWith("/")) path = "/" + path;
   path = path.replace(/\/+/g, "/");
   if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
   return path;
}

function setRoute(path: string, call: Function) {
   Routes[path] = call;
}

function getRoute(path = window.location.pathname) {
   return Routes[cleanPath(path)] || Routes["*"];
}

function setRoutes(currRoutes) {
   resetRoutes();
   Object.keys(currRoutes).forEach((key) => {
      setRoute(cleanPath(key), currRoutes[key]);
   });
}

let navigate_handler = null;

export function onNavigate(callback) {
   navigate_handler = callback;
}

function normalizePath(path) {
   if (!path || path == "") return "/";
   path = path.replace(/^\s+|\s+$/gm, "");
   if (!path.startsWith("/") && !path.startsWith("./")) path = "/" + path;
   path = path.replace(/\/{2,}/g, "/");
   if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
   return path;
}

export function getParams() {
   const res = {};
   const urlParams = new URLSearchParams(window.location.search);
   for (const [key, value] of urlParams) {
      res[key] = value;
   }
   return res;
}

export function setQuery(key, value) {
   const url = new URL(window.location.href);
   const urlParams = url.searchParams;
   if (value === null || value === undefined) urlParams.delete(key);
   else urlParams.set(key, value);
   window.history.replaceState({}, "", `${url.pathname}?${urlParams}`);
}

function refresh(params = null) {
   // console.log("call refresh", params);
   if (navigate_handler) navigate_handler();
   let path = window.location.pathname || "*";
   path = normalizePath(path);
   const RouteConfig = getRoute(path);
   return display(<RouteConfig props={params} />);
}

export function navigate(route, params = {}) {
   route = normalizePath(route);
   if (Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      route = `${route}?${queryString}`;
   }
   window.history.pushState({}, "", route);
   return refresh(params);
}

// loadfiles
async function loadRoutes() {
   try {
      const response = await fetch("/pages/routes.json");
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error loading routes.json:", error);
      throw error;
   }
}

function loadCSSFiles(styles) {
   styles?.forEach((style) => {
      Ura.loadCSS(Ura.normalizePath(style));
   });
}

async function loadJSFiles(routes, base) {
   for (const route of Object.keys(routes)) {
      try {
         const module = await import(routes[route]);
         if (!module.default) {
            throw new Error(
               `${route}: ${routes[route]} must have a default export`
            );
         }
         Ura.setRoute(Ura.normalizePath(route), module.default);
         if (base && route === base) {
            Ura.setRoute("*", module.default);
         }
      } catch (error) {
         console.error("Error loading JavaScript module:", error);
      }
   }
}

function setEventListeners() {
   window.addEventListener("DOMContentLoaded", () => {
      // console.error("load dom");
      Ura.refresh();
   });
   window.addEventListener("popstate", () => {
      // console.error("popstate");
      Ura.refresh();
   });
}

function handleCSSUpdate(filename) {
   const path = normalizePath(filename);
   let found = false;
   document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      //@ts-ignore
      const linkUri = new URL(link.href).pathname;
      if (linkUri === path) {
         found = true;
         const newLink = link.cloneNode();
         //@ts-ignore
         newLink.href = link.href.split("?")[0] + "?t=" + new Date().getTime(); // Append timestamp to force reload
         link.parentNode.replaceChild(newLink, link);
         return;
      }
   });
   if (!found) loadCSS(path);
}

async function sync() {
   const ws = new WebSocket(`ws://${window.location.host}`);
   ws.onmessage = async (socket_event) => {
      const event = JSON.parse(socket_event.data);
      // console.log("recieved", event);
      if (event.action === "reload") window.location.reload();
      else
         switch (event.ext) {
            case ".ts": case ".tsx": case ".jsx": case ".js": {
               window.location.reload();
               break;
            }
            case ".css": {
               handleCSSUpdate(event.pathname);
               break;
            }
            default:
               break;
         }
   };

   ws.onopen = () => {
      console.log("WebSocket connection established");
   };

   ws.onerror = (error) => {
      console.error("WebSocket error:", error);
   };

   ws.onclose = () => {
      console.log("WebSocket connection closed");
   };
}

async function setStyles(list) {
   list.forEach((elem) => {
      handleCSSUpdate(elem);
   });
}

async function start() {
   setEventListeners();
   console.log(Ura.Routes);
   //@ts-ignore
   if (window.location.protocol == "http:") sync();
   else console.warn("protocol is not HTTP", window.location.protocol);
}

export function getCookie(name) {
   const cookies = document.cookie.split(";").map((cookie) => cookie.split("="));
   const cookie = cookies.find(([key]) => key === name);
   return cookie ? decodeURIComponent(cookie[1]) : null;
}

export function rmCookie(name, path = "/", domain) {
   if (domain) {
      document.cookie = `${name}=; path=${path}; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
   } else {
      document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
   }
}

function getCurrentRoute() {
   let path = window.location.pathname || "*";
   path = normalizePath(path);
   return path;
}

function In(path) {
   return normalizePath(path) === getCurrentRoute();
}

// @ts-ignore
window.seeTree = function () {
   console.log(GlobalVDOM);
};

const Ura = {
   e, fr, setRoute, getRoute, display, create, sync, loadCSS, init, Routes,
   reconciliate, deepEqual, normalizePath, refresh, navigate, setRoutes,
   setStyles, In, start, getCookie, rmCookie, onNavigate, getParams,
   setQuery, getCurrentRoute,
};

export default Ura;
