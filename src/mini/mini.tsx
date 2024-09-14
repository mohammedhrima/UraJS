import { maps, initState } from "./states.js";
import { MiniComponent, StateMap, VDOM, TYPE, VDOMNode, Props, Tag } from "./types.js";
import validTags from "./validTags.js";

// UTILS
function loadCSS(filename: string) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = filename;
  document.head.appendChild(link);
}

// JSX HANDLING
function check(children: Array<VDOMNode>): Array<VDOMNode> {
  let i: number = 0;
  //@ts-ignore
  return children.map((child) => {
    if (child == null || typeof child === "string" || typeof child === "number") {
      return {
        type: TYPE.TEXT,
        index: i,
        value: child,
        events: {},
      };
    } else {
      child.index = i;
      return child;
    }
    i++;
  });
}

function fragment(props: Props, ...children: Array<VDOMNode>): VDOM {
  return {
    type: TYPE.FRAGMENT,
    children: check(children || []),
  };
}

function element(tag: Tag, props: Props, ...children: Array<VDOMNode>): VDOM {
  if (typeof tag === "function") {
    let funcTag = tag(props || {});
    if (funcTag.render) {
      let currTag = funcTag.render();
      if (funcTag.key && maps.get(funcTag.key)) {
        maps.get(funcTag.key).handler = () => {
          // destroyDOM(currTag);
          
          let parent = currTag.parent;
          currTag = funcTag.render();
          console.log("parent: ", currTag);
          currTag.parent = parent;
          Mini.display(currTag, parent);
        };
      }
      return currTag;
    } else if (funcTag.type) {
      return {
        ...funcTag,
        children: check(children || []),
      };
    } else throw `function ${tag} must return JSX`;
  }
  return {
    tag: tag,
    type: TYPE.ELEMENT,
    props: props,
    children: check(children || []),
    events: {},
  };
}

function destroyDOM(vdom: VDOM): void {
  if (vdom.tag != "get") {
    for (const eventType in vdom.events) {
      if (vdom.events.hasOwnProperty(eventType)) {
        const callback = vdom.events[eventType];
        vdom.dom.removeEventListener(eventType, callback);
      }
      vdom.events = {};
    }
    vdom.dom?.remove();
  }
  vdom.children?.map(destroyDOM);
}

function isvalid(tag: Tag) {
  if (!((tag as string) in validTags)) {
    console.warn(
      `Invalid tag '${tag}',if it's a function, first character should be uppercase`
    );
    return false;
  }
  return true;
}

const Routes: { [path: string]: Function } = {};
Routes["*"] = Error;
let currentRoute = null;

const normalizePath = (path: string) => {
  if (!path || path == "") return "/";
  // console.log(typeof path);
  path = path.replace(/^\s+|\s+$/gm, "");
  if (!path.startsWith("/")) path = "/" + path;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
};

const refresh = () => {
  let hash = window.location.hash.slice(1) || "/";
  hash = normalizePath(hash);
  const RouteConfig = Routes[hash] || Routes["*"];
  if (currentRoute) destroyDOM(currentRoute);
  currentRoute = display(<RouteConfig/>);
};

const navigate = (route, params = {}) => {
  route = route.split("?")[0];
  route = normalizePath(route);
  window.history.pushState({}, "", `#${route}`);
  const RouteConfig = Routes[route] || Routes["*"];
  if (currentRoute) destroyDOM(currentRoute);
  currentRoute = display(<RouteConfig/>);
};

function display(vdom: VDOM, parent: VDOM = null): VDOM {
  switch (vdom.type) {
    case TYPE.ELEMENT: {
      let { tag, props } = vdom;
      if (tag == "get") {

        vdom.dom = document.querySelector(props["by"]);
        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          display(child as VDOM, vdom);
        });
      } else if (tag == "route") {
        // @ts-ignore
        let { path, call } = props;
        path = normalizePath(path);
        if (call) Routes[path] = call;

        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          // @ts-ignore
          if (child.tag != "route")
            throw "'route' tag can only have children of type route";
          // @ts-ignore
          child.props.path = normalizePath(path + "/" + child.props.path);
          display(child as VDOM, parent);
        });
        return call;
      } else {
        if (!isvalid(tag)) throw `Invalid tag ${tag}`;
        vdom.dom = document.createElement(vdom.tag as string);
        const style = {};
        Object.keys(props || {}).forEach((key) => {
          if (validTags[tag as string].includes(key)) {
            if (key.startsWith("on")) {
              const eventType = key.slice(2).toLowerCase();
              vdom.dom.addEventListener(eventType, props[key]);
              vdom.events[eventType] = vdom.props[key];
            } else if (key === "style") Object.assign(style, props[key]);
            else {
              if (tag == "svg" || parent?.tag == "svg")
                vdom.dom.setAttribute(key, props[key]);
              else vdom.dom[key] = props[key];
            }
          } else console.warn(`Invalid attribute "${key}" ignored.`);
        });
        if (Object.keys(style).length > 0) {
          vdom.dom.style.cssText = Object.keys(style)
            .map((styleProp) => {
              const Camelkey = styleProp.replace(
                /[A-Z]/g,
                (match) => `-${match.toLowerCase()}`
              );
              return Camelkey + ":" + style[styleProp];
            })
            .join(";");
        }
        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          display(child as VDOM, vdom);
        });
        parent?.dom?.appendChild(vdom.dom);
      }
      break;
    }
    case TYPE.FRAGMENT: {
      vdom.children?.map((child) => {
        destroyDOM(child as VDOM);
        display(child as VDOM, parent);
      });
      break;
    }
    case TYPE.TEXT: {
      const { value } = vdom;
      (vdom as any).dom = document.createTextNode(value as string);
      if (parent) parent.dom.appendChild(vdom.dom);
      break;
    }
    default:
      break;
  }
  return vdom;
}

// ROUTING
function Error(props: Props | null) {
  return {
    key: null,
    render: () => {
      return element(
        "get",
        { by: "#root" },
        element(
          "h4",
          {
            style: {
              fontFamily: "sans-serif",
              fontSize: "6vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            },
          },
          "Error:",
          props && props["message"] ? ` Path '${props["message"]}'` : "",
          " Not Found"
        )
      );
    },
  };
}

const Mini = {
  initState,
  display,
  element,
  fragment,
  loadCSS,
  Error,
  Routes,
  navigate,
  refresh,
};

export default Mini;
