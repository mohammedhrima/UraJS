import { VDOM } from "./types.js";
import * as UTILS from "./utils.js";

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
      if (tag == "svg" || vdom.dom instanceof SVGElement /*|| parent?.tag == "svg"*/)
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
}

function create(vdom): VDOM {
  switch (vdom.type) {
    case UTILS.ELEMENT: {
      switch (vdom.tag) {
        case "root":
          vdom.dom = document.getElementById("root");
          break;
        default:
          if (vdom.dom) {
            console.error("element already has dom"); // TODO: to be removed
          }
          vdom.dom = document.createElement(vdom.tag);
          setProps(vdom);
          break;
      }
      break;
    }
    case UTILS.FRAGMENT: {
      vdom.dom = document.createElement("fragment");
      break;
    }
    case UTILS.TEXT: {
      vdom.dom = document.createTextNode(vdom.value);
      break;
    }
    default:
      break;
  }
  return vdom;
}

function isSpecialVDOM(vdom) {
  return (
    vdom.tag == "root" ||
    vdom.tag == "if" ||
    vdom.tag == "loop" ||
    vdom.type == UTILS.FRAGMENT
  );
}

function destroy(vdom: VDOM): void {
  if (!isSpecialVDOM(vdom)) {
    removeProps(vdom);
    vdom.dom?.remove();
    vdom.dom = null;
  }
  vdom.children?.map(destroy);
}

const DOM = {
  create,
  destroy,
  removeProps,
  setProps
};

export default DOM;