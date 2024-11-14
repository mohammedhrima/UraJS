import * as UTILS from "./utils.js";
import { VDOM, VDOMNode, Props, Tag } from "./types.js";
const { ELEMENT, FRAGMENT, TEXT, CREATE, REMOVE, REPLACE, deepEqual, loadCSS } =
  UTILS;

// JSX
function check(children: Array<VDOMNode>): Array<VDOMNode> {
  //@ts-ignore
  return children.map((child) => {
    if (
      child == null ||
      typeof child === "string" ||
      typeof child === "number"
    ) {
      return {
        type: TEXT,
        value: child,
      };
    }
    return child;
  });
}

function check2(child) {
  if (child == null || typeof child === "string" || typeof child === "number") {
    return {
      type: TEXT,
      value: child,
    };
  }
  return child;
}

function fragment(props: Props, ...children: Array<VDOMNode>) {
  console.log("call fragment", children);
  throw "Fragments (<></>) are not supported please use <fr></fr> tag instead";
}

function element(tag: Tag, props: Props, ...children: Array<VDOMNode>) {
  if (typeof tag === "function") {
    // let funcTag = {
    //   ...tag(props),
    //   isfunc: true,
    //   funcprops: props,
    //   func: tag,
    // };
    // console.log("return", funcTag);
    // return funcTag;
    return tag(props || {});

    // if (props) {
    //   funcTag.isfunc = true;
    //   funcTag.funcProps = props;
    // }
  }
  if (tag === "if") {
    return {
      type: FRAGMENT,
      children: check(props?.cond && children ? children : []),
    };
  } else if (tag === "loop") {
    let res = (props.on || []).flatMap((elem, id) =>
      // @ts-ignore
      (children || []).map((child) => typeof child === "function" ? child(elem, id) : child)
    );
    return {
      type: FRAGMENT,
      children: check(res || []),
    };
  }
  return {
    tag: tag,
    type: ELEMENT,
    props: props,
    children: check(children || []),
  };
}

// DOM
function setProps(vdom) {
  const { tag, props } = vdom;
  const style = {};
  Object.keys(props || {}).forEach((key) => {
    // console.log("set prop");
    if (key == "class")
      console.warn("Invalid property 'class' did you mean 'className' ?");
    else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      vdom.dom.addEventListener(eventType, props[key]);
    } else if (key === "style") Object.assign(style, props[key]);
    else {
      if (
        tag == "svg" ||
        vdom.dom instanceof SVGElement /*|| parent?.tag == "svg"*/
      )
        vdom.dom.setAttribute(key, props[key]);
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

function createDOM(vdom): VDOM {
  switch (vdom.type) {
    case ELEMENT: {
      switch (vdom.tag) {
        case "root":
          vdom.dom = document.getElementById("root");
          break;
        default:
          if (vdom.dom) console.error("element already has dom"); // TODO: to be removed
          vdom.dom = document.createElement(vdom.tag);
          break;
      }
      setProps(vdom);
      break;
    }
    case FRAGMENT: {
      console.log("createDOM: found fragment", vdom);
      if (vdom.dom) console.error("fragment already has dom"); // TODO: to be removed
      vdom.dom = document.createElement("container");
      break;
    }
    case TEXT: {
      vdom.dom = document.createTextNode(vdom.value);
      break;
    }
    default:
      break;
  }
  return vdom;
}

function removeProps(vdom: VDOM) {
  const props = vdom.props;
  Object.keys(props || {}).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      vdom.dom.removeEventListener(eventType, props[key]);
    } else if (key === "style") {
      Object.keys(props.style || {}).forEach((styleProp) => {
        vdom.dom.style[styleProp] = "";
      });
    } else {
      if (vdom.dom[key] !== undefined) delete vdom.dom[key];
      vdom.dom.removeAttribute(key);
    }
  });
  vdom.props = {};
}

// RENDERING
function execute(mode: number, prev: VDOM, next: VDOM = null) {
  switch (mode) {
    case CREATE: {
      // if (prev.isfunc) {
      //   console.log("is func");
      //   //@ts-ignore
      //   return execute(CREATE, prev.func(prev.funcprops));
      // }
      // else {
      createDOM(prev);
      prev.children?.map((child) => {
        child = execute(mode, child as VDOM);
        prev.dom.appendChild((child as VDOM).dom);
      });
      return prev;
      // }
      break;
    }
    case REPLACE: {
      execute(CREATE, next);
      prev.dom.replaceWith(next.dom);
      prev.dom = next.dom;
      removeProps(prev);
      // prev.props = next.props;
      // TODO: te be edited, props must reconciled or something
      // Object.keys(next).forEach(key => {
      //   prev[key] = next[key];
      // })
      return prev;
      // prev.props = next.props;
      break;
    }
    default:
      break;
  }
}

// RECONCILIATION
function reconciliateProps(oldProps: Props, newProps: Props, vdom) {
  let diff = false;
  // Remove old props that are not present in newProps
  Object.keys(oldProps || {}).forEach((key) => {
    if (!(key in newProps) || !UTILS.deepEqual(oldProps[key], newProps[key])) {
      diff = true;
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        vdom.dom.removeEventListener(eventType, oldProps[key]);
      } else if (key === "style") {
        Object.keys(oldProps.style || {}).forEach((styleProp) => {
          vdom.dom.style[styleProp] = "";
        });
      } else {
        if (vdom.dom[key] !== undefined) delete vdom.dom[key];
        else vdom.dom.removeAttribute(key);
      }
    }
  });

  // Add or update props that have changed
  Object.keys(newProps || {}).forEach((key) => {
    if (!UTILS.deepEqual(oldProps[key], newProps[key])) {
      diff = true;
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        vdom.dom.addEventListener(eventType, newProps[key]);
      } else if (key === "style") Object.assign(vdom.dom.style, newProps[key]);
      else {
        if (vdom.tag === "svg" || vdom.dom instanceof SVGElement) {
          vdom.dom.setAttribute(key, newProps[key]); // Use setAttribute for SVG
        } else {
          vdom.dom[key] = newProps[key];
        }
      }
    }
  });
  return diff;
}

function reconciliate(prev: VDOM, next: VDOM) {
  if (
    prev.type != next.type ||
    (prev.type == TEXT && !deepEqual(prev.value, next.value))
  )
    return execute(REPLACE, prev, next);
  if (prev.tag === next.tag) {
    if (reconciliateProps(prev.props, next.props, prev)) {
      console.error("there is diff in props");
      return execute(UTILS.REPLACE, prev, next);
    }
  } else return execute(UTILS.REPLACE, prev, next);

  const prevs = prev.children || [];
  const nexts = next.children || [];
  for (let i = 0; i < Math.max(prevs.length, nexts.length); i++) {
    let child1 = prevs[i];
    let child2 = nexts[i];

    if (child1 && child2) {
      reconciliate(child1 as VDOM, child2 as VDOM);
    } else if (!child1 && child2) {
      execute(CREATE, child2 as VDOM);
      prevs.push(child2);
      prev.dom.appendChild((child2 as VDOM).dom);
    } else if (child1 && !child2) {
      execute(UTILS.REMOVE, child1 as VDOM);
      prevs.splice(i, 1);
      i--;
    }
  }
}

let GlobalVDOM = null;

function display(vdom: VDOM) {
  console.log("display ", vdom);
  if (GlobalVDOM) {
    reconciliate(GlobalVDOM, vdom);
    execute(CREATE, vdom);
  } else {
    execute(CREATE, vdom);
    GlobalVDOM = vdom;
  }
}

// STATES
const States = new Map();
let pos = 0;
function init0(props = null) {
  pos++;
  States.set(pos, {
    store: new Map(),
    index: pos,
    vdom: null,
    state: null,
    props: props,
    JSXfunc: null,
  });

  const curr = States.get(pos);
  // console.log("call init", pos);

  curr.state = (value) => {
    let key = 0;
    key++;
    // console.log("call state", value);

    if (!curr.store.has(key)) {
      curr.store.set(key, value);
      // console.log("init", value, "key:", key, "pos:", pos);
    }
    return [
      () => curr.store.get(key),
      (value) => {
        if (!deepEqual(value, curr.store.get(key))) {
          curr.store.set(key, value);
          if (curr.props) {
            console.log(curr.index, ":", key, "=> has func props", curr.props);
          }
          reconciliate(curr.vdom, curr.JSXfunc(curr.props));
        }
        // console.log("new value", value);
      },
    ];
  };

  return [
    curr.state,
    (JSXfunc) => {
      // pos++;
      console.log("render with props:", curr.props);
      curr.JSXfunc = JSXfunc;
      curr.vdom = JSXfunc(curr.props);
      console.log(curr.vdom);
      return curr.vdom;
    },
  ];
}

function init1() {
  let index = 1;
  let vdom = null;
  let states = {};
  let View = () => <empty></empty>;

  const State = (initValue) => {
    const stateIndex = index++;
    states[stateIndex] = initValue;

    const getter = () => states[stateIndex];
    const setter = (newValue) => {
      if (!Ura.deepEqual(states[stateIndex], newValue)) {
        states[stateIndex] = newValue;
        updateState();
      }
    };
    return [getter, setter];
  };

  const updateState = () => {
    // console.log("call updateState");
    const newVDOM = <root><View /></root>;
    if (vdom) Ura.reconciliate(vdom, newVDOM);
    else vdom = newVDOM;
  };

  const render = (call) => {
    console.log("render :", call);

    View = call;
    updateState();
    return vdom;
  };
  return [render, State];
}

// ROUTING
const Routes: { [path: string]: Function } = {};

function setRoute(path: string, call: Function) {
  Routes[path] = call;
}

//TODO: set * route to not found
function getRoute(hash) {
  return Routes[hash] || Routes["*"];
}

// WEBSOCKET
function sync() {
  const ws = new WebSocket(`ws://${window.location.host}`);
  console.log(window.location.host);
  ws.onmessage = (event) => {
    if (event.data === "reload") window.location.reload();
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

const Ura = {
  element,
  fragment,
  setRoute,
  getRoute,
  display,
  sync,
  loadCSS,
  init: init1,
  Routes,
  reconciliate,
  deepEqual,
};

export default Ura;
