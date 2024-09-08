import { MiniComponent, VDOM, TYPE, VDOMNode, Props, Tag } from "./types.js";
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

function createArrayWatcher(array: any, onChange: any) {
  return new Proxy(array, {
    set(target, property, value) {
      const oldValue = target[property];
      const result = Reflect.set(target, property, value);

      // Only trigger change if the value actually changed
      // console.log("change happen");
      if (oldValue !== value) {
        onChange(property, oldValue, value);
      }
      return result;
    },
  });
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
    parent: {},
    events: {},
  };
}

function get(props: Props, ...children: Array<VDOMNode>) {
  // console.log("get:", props);
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

function display(vdom: VDOM, parent: VDOM | null = null): VDOM {
  // console.log("display:", vdom);
  switch (vdom.type) {
    case TYPE.ELEMENT: {
      let { tag, props } = vdom;
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
        display(child as VDOM);
        //@ts-ignore
        if (child.dom) vdom.dom.appendChild(child.dom);
        //@ts-ignore
        child.parent = vdom;
      });
      break;
    }
    case TYPE.SELECTOR: {
      // console.log("type selector:", vdom);

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
      vdom.children?.map((child) => {
        display(child as VDOM, vdom);
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
  }

  return vdom;
}

const Mini = {
  element,
  fragment,
  display,
  get,
  initState,
  loadCSS
};

export default Mini;
