//@ts-ignore
import send_HTTP_Request from "./http.js";
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
  children = children.map((child) => {
    if (child == null || typeof child === "string" || typeof child === "number") {
      return {
        type: TYPE.TEXT,
        index: i++,
        value: child,
        events: {},
      };
    } else {
      child.index = i++;
      return child;
    }
  });
  return children;
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
      let currTag: VDOM;
      if (funcTag.key && maps.get(funcTag.key)) {
        // console.log("element is a function");
        currTag = funcTag.render();
        currTag.isfunc = true;
        currTag.key = funcTag.key;
        currTag.func = funcTag.render;
      } else {
        currTag = funcTag;
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
  let { tag, type } = vdom;
  if (tag != "get" && tag != "root" && tag != "loop" && type != TYPE.FRAGMENT) {
    for (const eventType in vdom.events) {
      if (vdom.events.hasOwnProperty(eventType)) {
        const callback = vdom.events[eventType];
        vdom.dom.removeEventListener(eventType, callback);
      }
      vdom.events = {};
    }
    vdom.dom?.remove();
    vdom.dom = null;
  }
  vdom.children?.map(destroyDOM);
}

const Routes: { [path: string]: Function } = {};
//@ts-ignore
Routes["*"] = Error;
let currentRoute: VDOM = null;

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
  // TODO: in case '*' check if it's error Component
  // if so give it the path as parameter
  const RouteConfig = Routes[hash] || Routes["*"];

  /* 
  | I did <RoutConfig/> because
  | I need the key attribute
  */
  display(<RouteConfig />);
};

const navigate = (route, params = {}) => {
  // console.log("call navigate");
  route = route.split("?")[0];
  route = normalizePath(route);
  window.history.pushState({}, "", `#${route}`);
  const RouteConfig = Routes[route] || Routes["*"];
  //@ts-ignore
  display(<RouteConfig />);
};

function replaceChildAt(parentDOM, index, newDOM) {
  const children = parentDOM.children;

  if (index >= 0 && index < children.length) {
    // Replace the child at the given index
    parentDOM.replaceChild(newDOM, children[index]);
  } else {
    console.error("Index out of bounds");
  }
}

function display(vdom: VDOM, parent: VDOM = null): VDOM {
  //@ts-ignore
  // console.log("call display", vdom);

  switch (vdom.type) {
    case TYPE.ELEMENT: {
      let { tag, props } = vdom;
      if (tag == "loop") {
        //@ts-ignore
        let { on, exec } = props;
        // console.log("on", on, " type", typeof on);
        let res = on?.map((elem) => {
          // console.log(elem);
          return exec(elem);
        });
        // console.log(res);
        //@ts-ignore
        vdom.dom = document.createDocumentFragment();
        res.map((child) => {
          display(child, parent);
          //@ts-ignore
          vdom.children.push(child);
          if (child.dom) vdom.dom.appendChild(child.dom);
          else vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
        });
      } else if (tag == "root") {
        if (currentRoute) destroyDOM(currentRoute);
        vdom.dom = document.getElementById("root");
        vdom.children?.map((child) => {
          //@ts-ignore
          destroyDOM(child);
          //@ts-ignore
          display(child as VDOM, vdom);
          // console.log(child);

          // console.log("child", child);

          //@ts-ignore
          if (child.dom) vdom.dom.appendChild(child.dom);
          else vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
        });
        currentRoute = vdom;
      } else if (tag == "get") {
        if (!vdom.dom) vdom.dom = document.querySelector(props["by"]);

        vdom.children?.map((child) => {
          //@ts-ignore
          destroyDOM(child);
          display(child as VDOM, vdom);
        });
        vdom.children?.map((child) => {
          // append(child, vdom);
          //@ts-ignore
          // display(child, vdom);
          //@ts-ignore
          if (child.dom) vdom.dom.appendChild(child.dom);
          else vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
        });
      } else if (tag == "route") {
        // @ts-ignore
        let { path, call } = props;
        path = normalizePath(path);
        if (call) Routes[path] = call;
        vdom.children?.map((child) => {
          // destroyDOM(child as VDOM);
          // @ts-ignore
          if (child.tag != "route")
            throw "'route' tag can only have children of type route";
          // @ts-ignore
          child.props.path = normalizePath(path + "/" + child.props.path);
          //@ts-ignore
          display(child as VDOM, parent);
        });
      } else {
        if (!((tag as string) in validTags)) {
          console.warn(
            `Invalid tag '${tag}',if it's a function, first character should be uppercase`
          );
        }
        if (!vdom.dom) vdom.dom = document.createElement(vdom.tag as string);
        else {
          // console.log("element already has dom");
          vdom.dom.replaceWith(document.createElement(vdom.tag as string));
        }
        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          //@ts-ignore
          display(child, vdom);
          //@ts-ignore
          // console.log(child);
          //@ts-ignore
          if (child.dom) vdom.dom.appendChild(child.dom);
          else vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
        });

        const style = {};
        Object.keys(props || {}).forEach((key) => {
          // if (validTags[tag as string].includes(key)) {
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
          // } else console.warn(`Invalid attribute "${key}" ignored.`);
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
      }
      if (vdom.isfunc && maps.get(vdom.key)) {
        maps.get(vdom.key).handler = () => {
          // console.log("call handle");

          let newTag = vdom.func();
          newTag.isfunc = true;
          newTag.key = vdom.key;
          newTag.func = vdom.func;
          newTag.index = vdom.index;

          display(newTag, parent);
          newTag.children?.map((child) => {
            destroyDOM(child);
            display(child, newTag);
            // console.log(child);
            if (child.dom) newTag.dom.appendChild(child.dom);
            else newTag.dom.appendChild(document.createTextNode(JSON.stringify(child)));
          });
          if (newTag.tag != "root") {
            parent.dom.appendChild(newTag.dom);
            replaceChildAt(parent.dom, newTag.index, newTag.dom);
          }
        };
      }
      break;
    }
    case TYPE.FRAGMENT: {
      // console.log("handle fragment");
      //@ts-ignore
      vdom.dom = document.createDocumentFragment();
      vdom.children?.map((child) => {
        display(child as VDOM, vdom);
      });
      vdom.children?.map((child) => {
        //@ts-ignore
        if (child.dom) vdom.dom.appendChild(child.dom);
        else vdom.dom.appendChild(document.createTextNode(JSON.stringify(child)));
      });
      break;
    }
    case TYPE.TEXT: {
      const { value } = vdom;
      // console.log("handle text", value);
      //@ts-ignore
      vdom.dom = document.createTextNode(value as string);
      // if (!vdom.dom) {
      //   //@ts-ignore
      //   vdom.dom = document.createTextNode(value as string);
      // } else {
      //   console.log("Text has dom", value);
      //   vdom.dom.replaceWith(document.createTextNode(value as string));
      //   //@ts-ignore
      //   // vdom.dom = document.createTextNode(value as string);
      // }
      break;
    }
  }
  return vdom;
}

// ROUTING
function Error(props: Props | null) {
  return {
    key: null,
    render: () => {
      return element(
        "root",
        {},
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

const Mino = {
  initState,
  display,
  element,
  fragment,
  loadCSS,
  Error,
  Routes,
  navigate,
  refresh,
  send: send_HTTP_Request,
};

export default Mino;
