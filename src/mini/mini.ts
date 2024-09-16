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
      let currTag: VDOM;
      if (funcTag.key && maps.get(funcTag.key)) {
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
  console.log("call refresh");
  let hash = window.location.hash.slice(1) || "/";
  hash = normalizePath(hash);
  // TODO: in case '*' check ifit's error Component
  // if so give it the path as parameter
  const RouteConfig = Routes[hash] || Routes["*"];
  if (currentRoute) destroyDOM(currentRoute);
  //@ts-ignore
  currentRoute = display(element(RouteConfig));
};

const navigate = (route, params = {}) => {
  console.log("call navigate");
  route = route.split("?")[0];
  route = normalizePath(route);
  window.history.pushState({}, "", `#${route}`);
  const RouteConfig = Routes[route] || Routes["*"];
  if (currentRoute) destroyDOM(currentRoute);
  //@ts-ignore
  currentRoute = display(element(RouteConfig));
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

function display(vdom: VDOM, parent: VDOM = null): VDOM {
  switch (vdom.type) {
    case TYPE.ELEMENT: {
      let { tag, props } = vdom;
      if (tag == "get") {
        if (!vdom.dom) vdom.dom = document.querySelector(props["by"]);
        vdom.children?.map((child) => {
          //@ts-ignore
          child.parent = vdom;
          //@ts-ignore
          display(child as VDOM, vdom);
        });
        vdom.children?.map((child) => {
          // append(child, vdom);
          //@ts-ignore
          display(child, vdom);
          //@ts-ignore
          vdom.dom.appendChild(child.dom);
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
        if (vdom.isfunc && maps.get(vdom.key)) {
          // maps.get(vdom.key).handler = () => {
          //   let newTag = vdom.func();
          //   newTag.isfunc = true;
          //   newTag.key = vdom.key;
          //   newTag.func = vdom.func;
          //   display(newTag, parent);
          //   newTag.children?.map((child) => {
          //     display(child, newTag);
          //   });
          //   // newTag.children?.map((child) => {
          //   //   append(child, newTag);
          //   // });
          // };
        }
        // TODO: add an else here
        if (!isvalid(tag)) throw `Invalid tag ${tag}`;
        if (!vdom.dom) vdom.dom = document.createElement(vdom.tag as string);
        else {
          console.log("element already has dom");
          vdom.dom.replaceWith(document.createElement(vdom.tag as string));
        }
        vdom.children?.map((child) => {
          //@ts-ignore
          display(child, vdom);
          //@ts-ignore
          vdom.dom.appendChild(child.dom);
        });
      }
      break;
    }
    case TYPE.FRAGMENT: {
      console.log("handle fragment");
      //@ts-ignore
      vdom.dom = document.createDocumentFragment();
      vdom.children?.map((child) => {
        // destroyDOM(child as VDOM);
        display(child as VDOM, vdom);
      });
      vdom.children?.map((child) => {
        //@ts-ignore
        // append(child, vdom);
        vdom.dom.appendChild(child.dom);
      });
      break;
    }
    case TYPE.TEXT: {
      console.log("handle text");
      const { value } = vdom;
      if (!vdom.dom) {
        //@ts-ignore
        vdom.dom = document.createTextNode(value as string);
      } else {
        console.log("Text has dom", value);
        // vdom.dom.replaceWith(document.createTextNode(value as string));
        //@ts-ignore
        // vdom.dom = document.createTextNode(value as string);
      }
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
