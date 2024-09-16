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
      let currTag: VDOM = funcTag.render();
      if (funcTag.key && maps.get(funcTag.key)) {
        currTag.isfunc = true;
        currTag.key = funcTag.key;
        currTag.func = funcTag.render;
        // maps.get(funcTag.key).handler = () => {
        //   destroyDOM(currTag);
        //   // let parent = currTag.parent;
        //   currTag = funcTag.render();
        //   // console.log("parent : ", parent);
        //   // console.log("currtag: ", currTag);
        //   // currTag.parent = parent;
        //   Mini.display(currTag);
        // };
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
  // if (vdom.tag != "get") {
  //   for (const eventType in vdom.events) {
  //     if (vdom.events.hasOwnProperty(eventType)) {
  //       const callback = vdom.events[eventType];
  //       vdom.dom.removeEventListener(eventType, callback);
  //     }
  //     vdom.events = {};
  //   }
  //   vdom.dom?.remove();
  //   vdom.dom = null;
  // }
  // vdom.children?.map(destroyDOM);
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
  const RouteConfig = Routes[hash] || Routes["*"];
  if (currentRoute) destroyDOM(currentRoute);
  currentRoute = display(<RouteConfig />);
};

const navigate = (route, params = {}) => {
  route = route.split("?")[0];
  route = normalizePath(route);
  window.history.pushState({}, "", `#${route}`);
  const RouteConfig = Routes[route] || Routes["*"];
  if (currentRoute) destroyDOM(currentRoute);
  currentRoute = display(<RouteConfig />);
};

function append(vdom: VDOM, parent: VDOM) {
  if (vdom.dom) parent.dom.appendChild(vdom.dom);
  vdom.children?.map((child) => {
    //@ts-ignore
    if (vdom.dom) append(child, vdom);
    //@ts-ignore
    else append(child, parent);
  });
}

function display(vdom: VDOM, parent: VDOM = null, index = 0): VDOM {
  // vdom.parent = parent;
  switch (vdom.type) {
    case TYPE.ELEMENT: {
      let { tag, props } = vdom;
      if (tag == "get") {
        if (!vdom.dom) vdom.dom = document.querySelector(props["by"]);
        // let i = 0;
        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          //@ts-ignore
          child.parent = vdom;
          //@ts-ignore
          display(child as VDOM, vdom, child.index);
        });
        vdom.children?.map((child) => {
          //@ts-ignore
          append(child, vdom);
        });

        // return vdom;
      } else if (tag == "route") {
        // @ts-ignore
        let { path, call } = props;
        path = normalizePath(path);
        if (call) Routes[path] = call;

        // let i = 0;
        vdom.children?.map((child) => {
          destroyDOM(child as VDOM);
          // @ts-ignore
          if (child.tag != "route")
            throw "'route' tag can only have children of type route";
          // @ts-ignore
          child.props.path = normalizePath(path + "/" + child.props.path);
          //@ts-ignore
          display(child as VDOM, parent, child.index);
        });
      } else {
        if (!isvalid(tag)) throw `Invalid tag ${tag}`;
        if (!vdom.dom) vdom.dom = document.createElement(vdom.tag as string);
        else {
          console.log("element already has dom");
          vdom.dom.replaceWith(document.createElement(vdom.tag as string));
        }
        if (vdom.isfunc && maps.get(vdom.key)) {
          maps.get(vdom.key).handler = () => {
            // destroyDOM(currTag);
            // // let parent = currTag.parent;
            // currTag = funcTag.render();
            // // console.log("parent : ", parent);
            // // console.log("currtag: ", currTag);
            // // currTag.parent = parent;
            // Mini.display(currTag);
            // destroyDOM(vdom)
            // console.log("parent", parent);
            // console.log("event", vdom);
            let newTag = vdom.func();
            newTag.isfunc = true;
            newTag.key = vdom.key;
            newTag.func = vdom.func;
            // newTag.dom = vdom.dom;
            // console.log("append", newTag);
            display(newTag, parent);
            // append(newTag, parent);
            newTag.children?.map((child) => {
              // destroyDOM(child as VDOM);
              //@ts-ignore
              // child.parent = vdom;
              display(child as VDOM, newTag);
            });
            newTag.children?.map((child) => {
              //@ts-ignore
              append(child, newTag);
            });
          };
        }

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
        // let i = 0;
        vdom.children?.map((child) => {
          // destroyDOM(child as VDOM);
          //@ts-ignore
          // child.parent = vdom;
          display(child as VDOM, vdom);
        });
        vdom.children?.map((child) => {
          //@ts-ignore
          append(child, vdom);
        });

        // let referenceElement = vdom;
        // console.log("vdom", vdom);
        // console.log("parent", parent);
        // console.log("reference", referenceElement);

        // Insert the new element before the reference element
        // let cond = 0;
        //@ts-ignore
        // if (index) {
        //   console.log("index: ", index - 1, vdom.children[index - 1]);

        //   // parent.dom.insertBefore(vdom.dom, vdom.children[index - 1].dom);
        //   parent.dom.insertBefore(
        //     vdom.dom,
        //     //@ts-ignore
        //     parent.dom.childNodes[index]
        //   );
        // } else {
        //   console.log("index: ", index);
        // }
        // parent.dom.appendChild(vdom.dom);
        // if (index) {
        //   //@ts-ignore
        //   parent.dom.insertBefore(vdom.dom, index - 1);
        // } else {
        //   // If the index is out of range, append the new element at the end
        //   parent.dom.appendChild(vdom.dom);
        // }
      }
      break;
    }
    case TYPE.FRAGMENT: {
      console.log("handle fragment");
      //@ts-ignore
      // vdom.dom = document.createDocumentFragment();

      vdom.children?.map((child) => {
        destroyDOM(child as VDOM);
        display(child as VDOM, parent, index++);
        //@ts-ignore
        // child.parent = parent;
      });
      vdom.children?.map((child) => {
        //@ts-ignore
        append(child, parent);
      });
      // return vdom;
      break;
    }
    case TYPE.TEXT: {
      const { value } = vdom;
      if (!vdom.dom) {
        //@ts-ignore
        vdom.dom = document.createTextNode(value as string);
      } else {
        console.log("Text has dom", value);
        // vdom.dom.replaceWith(document.createTextNode(value as string));
        //@ts-ignore
        vdom.dom = document.createTextNode(value as string);
      }

      // (vdom as any).dom = document.createTextNode(value as string);
      // append(vdom, parent);
      // if (parent) parent.dom.appendChild(vdom.dom);
      // vdom.parent = parent;
      break;
    }
    default:
      break;
  }
  // if (vdom.isfunc) {
  //   console.log("found function", vdom);
  //   // console.log("has parent", parent);
  // }
  // vdom.parent = parent;
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
