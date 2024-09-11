import {
  MiniComponent,
  VDOM,
  TYPE,
  VDOMNode,
  Props,
  Tag,
  // MiniRoute,
  // MiniMatch,
} from "./types.js";
import validTags from "./validTags.js";

function loadCSS(filename: string) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = filename;
  document.head.appendChild(link);
}

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
    children: children || [],
  };
}

let index = 1;
interface StateMap {
  state: Map<number, any>;
  handler: () => void;
}
let maps = new Map<number, StateMap>();

function initState<T>() {
  maps.set(index, {
    state: new Map<number, any>(),
    handler: () => {},
  });
  const map = maps.get(index);
  index++;
  let key = 0;

  return [
    index - 1,
    <T>(initialValue: T) => {
      key++;
      map.state.set(key, initialValue);

      return [
        (): T => {
          // console.log("call getter", map.state.get(key));
          return map.state.get(key) as T;
        },
        (newValue: T) => {
          // console.log("call setter");
          map.state.set(key, newValue);
          if (map.handler) map.handler();
        },
      ] as [() => T, (newValue: T) => void];
    },
  ] as [number, <T>(value: T) => [() => T, (newValue: T) => void]];
}

function element(tag: Tag, props: Props, ...children: Array<VDOMNode>): VDOM {
  if (typeof tag === "function") {
    let funcTag = tag(props || {});
    // console.log("function", funcTag);
    if (funcTag.component) {
      // console.log("element", funcTag);
      // console.log("0>", maps);
      // console.log("1>", maps.get(funcTag.key));

      let currTag = funcTag.component();
      if (maps.get(funcTag.key))
        maps.get(funcTag.key).handler = () => {
          destroyDOM(currTag);
          let parent = currTag.parent;
          currTag = funcTag.component();
          currTag.parent = parent;
          Mini.display(currTag, parent);
          parent.dom.appendChild(currTag.dom);
        };

      return currTag;
    } else if (funcTag.type) {
      return {
        ...funcTag,
        children: check(children || []),
      };
    } else throw "function must return JSX";
  }
  return {
    tag: tag,
    type: TYPE.ELEMENT,
    props: props,
    children: check(children || []),
    // parent: {},
    events: {},
  };
}

function get(props: Props, ...children: Array<VDOMNode>): VDOM {
  console.log("get:", children);
  return {
    type: TYPE.SELECTOR,
    dom: document.querySelector(props["by"]),
    children: check(children || []),
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

const routes: Map<string, (props?: Props) => MiniComponent> = new Map([
  ["", (props?: Props): MiniComponent => Error(props)],
]);

function display(vdom: VDOM, parent: VDOM | null = null): VDOM {
  console.log("call display", vdom, parent);
  
  // console.log("display:", vdom);
  switch (vdom.type) {
    case TYPE.ELEMENT: {
      console.log("display element", vdom);
      let { tag, props } = vdom;
      if (tag == "get") {
        vdom.type = TYPE.SELECTOR;
        vdom.dom = document.querySelector(props["by"]);
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
      }

      vdom.children?.map((child) => {
        display(child as VDOM, vdom);
        //@ts-ignore
        if (child.dom) vdom.dom.appendChild(child.dom);
        //@ts-ignore
        child.parent = vdom;
      });
      break;
    }
    case TYPE.SELECTOR: {
      console.log("display selector:", vdom);

      vdom.children?.map((child) => {
        display(child as VDOM, vdom);
        //@ts-ignore
        if (child.dom) vdom.dom.appendChild(child.dom);
        //@ts-ignore
        child.parent = vdom;
      });
      break;
    }
    case TYPE.FRAGMENT: {
      console.log("display fragment");
      
      // console.log(parent);
      // console.log(vdom);
      vdom.children?.map((child) => {
        display(child as VDOM, parent);
        //@ts-ignore
        if (child.dom) parent.dom.appendChild(child.dom);
        //@ts-ignore
        child.parent = parent;
      });
      break;
    }
    case TYPE.TEXT: {
      // console.log("type text", vdom);
      const { value } = vdom;
      // @ts-ignore
      vdom.dom = document.createTextNode(value);
      break;
    }
    case TYPE.ROUTE: {
      console.log("display route");
      const { props } = vdom;
      if (props["path"] == "/") props["path"] = "";
      props["call"].parent = parent;
      routes.set(props["path"], props["call"]);

      vdom.children?.map((child) => {
        display(child as VDOM, parent);
        //@ts-ignore
        if (child.dom) parent.dom.appendChild(child.dom);
        //@ts-ignore
        child.parent = parent;
      });
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
        Mini.get,
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

function pathToRegex(path: string) {
  // console.log(path); // TODO: is nothing
  if (path === "") return new RegExp("^/$"); // For the root path ("/")
  return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$");
}

// function pathToRegex(path: string): string {
//   if (path === "") return "^/$"; // For the root path ("/")

//   // Replace dynamic segments like ":id" with a capturing group "([^/]+)"
//   // Ensure proper escaping of slashes
//   return "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$";
// }

// function getParams(match: MiniMatch): Record<string, string> {
//   const values = match.result ? match.result.slice(1) : [];
//   const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
//     (result) => result[1]
//   );
//   return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
// }

function getParams(result: RegExpMatchArray | null): { [key: string]: string } {
  const values = result ? result.slice(1) : [];
  const keys = Array.from(location.pathname.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
}

async function router() {
  // console.log("call router");

  // Test routes
  const matches = Array.from(routes.entries()).map(([path, call]) => {
    const regex = pathToRegex(path);
    return {
      path: path,
      call: call,
      result: location.pathname.match(regex),
    };
  });

  console.log("Routes:", routes);
  console.log("Matches:", matches);

  let match = matches.find((elem) => elem.result !== null);

  if (match) {
    console.log("Matched route:", match.call);
    // const component = match.call;
    // console.log(match.call);

    // @ts-ignore
    display(match.call, match.call.parent);
    // @ts-ignore
    match.call.parent.dom.appendChild(match.call.dom)
  } else if (routes.has("")) {
    // Handle default route if no match is found
    console.log("No match found. Using default route.");
    const defaultRoute = routes.get("")!;
    const component = defaultRoute(getParams(null)).component();
    display(component);
  } else {
    // Handle error if no route matches and no default route exists
    console.log("No route found. Displaying error.");
    const errorVDOM = Error({ message: location.pathname }).component();
    display(errorVDOM);
  }
}

window.addEventListener("popstate", router); // when going back and forward
document.addEventListener("DOMContentLoaded", router); // on loading

function Routes(props: Props, ...children: Array<VDOMNode>): VDOM {
  // console.log("call Routes", children);

  // return props["call"];
  return {
    type: TYPE.ROUTE,
    props: props,
    children: check(children || []), // TODO: add sub routes
  };
  // return {
  //   type: TYPE.FRAGMENT,
  //   children:  [()=>routes[0].call],
  // };
}

const Mini = {
  element,
  fragment,
  display,
  get,
  initState,
  loadCSS,
  Error,
  Routes,
};

export default Mini;
