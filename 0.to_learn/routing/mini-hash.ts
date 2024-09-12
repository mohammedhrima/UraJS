import { MiniComponent, StateMap, VDOM, TYPE, VDOMNode, Props, Tag } from "./types.js";
import validTags from "./validTags.js";

// UTILS
function loadCSS(filename: string) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = filename;
  document.head.appendChild(link);
}

// STATES
const maps = new Map<number, StateMap>();

let index = 1;
function initState<T>() {
  maps.set(index, {
    state: new Map<number, any>(),
    handler: () => {},
  });
  const map = maps.get(index);
  index++;
  let key = 1;
  return [
    index - 1,
    <T>(initialValue: T) => {
      key++;
      map.state.set(key, initialValue);

      return [
        (): T => {
          return map.state.get(key) as T;
        },
        (newValue: T) => {
          map.state.set(key, newValue);
          if (map.handler) map.handler();
        },
      ] as [() => T, (newValue: T) => void];
    },
  ] as [number, <T>(value: T) => [() => T, (newValue: T) => void]];
}

// JSX HANDLING
function check(children: Array<VDOMNode>): Array<VDOMNode> {
  let i: number = 0;
  return children.map((child) => {
    if (child === null) throw "check found NULL";
    if (typeof child === "string" || typeof child === "number") {
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
    if (funcTag.component) {
      let currTag = funcTag.component();
      if (funcTag.key && maps.get(funcTag.key)) {
        maps.get(funcTag.key).handler = () => {
          destroyDOM(currTag);
          let parent = currTag.parent;
          currTag = funcTag.component();
          currTag.parent = parent;
          Mini.display(currTag, parent);
          parent.dom.appendChild(currTag.dom);
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
  for (const eventType in vdom.events) {
    if (vdom.events.hasOwnProperty(eventType)) {
      const callback = vdom.events[eventType];
      vdom.dom.removeEventListener(eventType, callback);
    }
    vdom.events = {};
  }
  vdom.dom?.remove();
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

// ROUTING
const Routes = new Map();
Routes["*"] = Error;

const matchPath = (pathname) => {
  // console.log("call matchPath");
  // const { path } = options;
  // if (!path) {
  //   return {
  //     path: null,
  //     url: pathname,
  //     isExact: true,
  //   };
  // }
  const match = new RegExp(`^${pathname}`).exec(pathname);
  console.log(match);
  if (!match) return null;

  const url = match[0];
  // const isExact = pathname === url;

  return { pathname, url };
};

//@ts-ignore
let routeDom: HTMLElement = document.getElementById("root");

function formatRoute(path: string) {
  if (path.startsWith("/")) return "#" + path.slice(1);
  else if (!path.startsWith("#")) return "#" + path;
  return path;
}

function reverseformatRoute(path: string) {
  if (path.startsWith("#")) return "/" + path.slice(1);
  else if (!path.startsWith("/")) return "#" + path;
  return path;
}

function navigate(path, parentDom) {
  path = formatRoute(path);
  if (!parentDom) parentDom = routeDom;
  routeDom.innerHTML = "";
  if (Routes.get("*"))
    //@ts-ignore
    display(Routes["*"]().component(), { dom: routeDom });
  else if (!Routes.get(path))
    //@ts-ignore
    display(Error({ message: reverseformatRoute(path) }).component(), { dom: routeDom });
  else {
    //@ts-ignore
    display(Routes[path]().component(), { dom: routeDom });
    if (window.location.hash !== `#${path}`) {
      // TODO: check this line
      window.location.hash = path;
    }
  }
}

window.addEventListener("popstate", function (event) {
  // console.log("popstate", window.location.pathname);
  navigate(window.location.hash || "#", routeDom);
});

document.addEventListener("DOMContentLoaded", (event) => {
  // console.log("DOMContentLoaded");
  navigate(window.location.hash || "#", routeDom);
});

window.addEventListener("load", (event) => {
  // console.log("load");
  navigate(window.location.hash || "#", routeDom);
});

// DISPLAY
function display(vdom: VDOM, parent: VDOM = null): VDOM {
  // console.log("vdom", vdom);
  // console.log("parent", parent);

  switch (vdom.type) {
    case TYPE.ELEMENT: {
      let { tag, props } = vdom;
      if (tag == "navigate") {
        vdom.dom = document.createElement("a");
        // vdom.dom.innerHTML = "hh";

        parent.dom.appendChild(vdom.dom);
        vdom.dom.onclick = (event) => {
          // console.log("navigate to ", Routes[props.to]);
          // parent.children.map(destroyDOM);
          // //@ts-ignore
          // display(Routes[props.to]().component(), parent);
          // // event.preventDefault();
          // // console.log("go to ", event);
          // //@ts-ignore
          // history.pushState(null, null, props.to);
          //@ts-ignore
          navigate(props.to, parent.dom);
        };
        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          display(child as VDOM, vdom);
        });
      } else if (tag == "route") {
        // console.log("found route", vdom);
        // @ts-ignore
        let { path, call, render } = props;
        path = formatRoute(path);
        if (call) {
          Routes[path] = call;
        }

        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          // @ts-ignore
          if (child.tag != "route")
            throw "'route' tag can only have children of type route";
          // @ts-ignore
          child.props.path = path + child.props.path;
          display(child as VDOM, parent);
        });

        // if (render) return render({ match });
      } else if (tag == "get") {
        vdom.dom = document.querySelector(props["by"]);
        vdom.dom.innerHTML = "";
        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          display(child as VDOM, vdom);
        });
        if (props["by"] === "root") routeDom = vdom.dom;
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
              vdom.dom.setAttribute(key, props[key]);
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
        parent.dom?.appendChild(vdom.dom);
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
  }
  return vdom;
}

// ROUTING
function Error(props: Props | null) {
  return {
    key: null,
    component: () => {
      return Mini.element(
        "get",
        { by: "#root" },
        Mini.element(
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
  display,
  element,
  fragment,
  loadCSS,
  Error,
  Routes,
};

export default Mini;
