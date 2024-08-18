const validTags = {
  children: [],
  nav: ["props", "path"],
  a: [
    "accesskey",
    "hidden",
    "charset",
    "className",
    "coords",
    "download",
    "href",
    "hreflang",
    "id",
    "name",
    "ping",
    "rel",
    "rev",
    "shape",
    "style",
    "target",
    "title",
  ],
  img: [
    "className",
    "alt",
    "src",
    "hidden",
    "srcset",
    "sizes",
    "crossorigin",
    "usemap",
    "ismap",
    "width",
    "height",
    "referrerpolicy",
    "loading",
    "decoding",
    "onmouseenter",
    "onmouseleave",
    "onmouseover",
    "onmouseout",
    "onclick",
    "style",
  ],
  i: ["class", "id", "title", "style", "dir", "lang", "accesskey", "tabindex"],
  div: [
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "draggable",
    "spellcheck",
    "hidden",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  p: [
    "textContent",
    "hidden",
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "spellcheck",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  h1: [
    "hidden",
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "spellcheck",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  h2: [
    "hidden",
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "spellcheck",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  h3: [
    "hidden",
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "spellcheck",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  h4: [
    "hidden",
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "spellcheck",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  h5: [
    "hidden",
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "spellcheck",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  h6: [
    "hidden",
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "spellcheck",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  span: [
    "hidden",
    "id",
    "className",
    "style",
    "data-*",
    "aria-*",
    "title",
    "dir",
    "lang",
    "tabindex",
    "accesskey",
    "contenteditable",
    "spellcheck",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  input: [
    "style",
    "hidden",
    "type",
    "name",
    "value",
    "id",
    "className",
    "placeholder",
    "readonly",
    "disabled",
    "checked",
    "size",
    "maxlength",
    "min",
    "max",
    "step",
    "pattern",
    "required",
    "autofocus",
    "autocomplete",
    "autocapitalize",
    "autocorrect",
    "list",
    "multiple",
    "accept",
    "capture",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "height",
    "width",
    "alt",
    "src",
    "usemap",
    "ismap",
    "tabindex",
    "title",
    "accesskey",
    "aria-*",
    "role",
    "aria-*",
    "aria-*",
    "onchange",
    "oninput",
    "oninvalid",
    "onsubmit",
    "onreset",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  button: [
    "style",
    "hidden",
    "type",
    "name",
    "value",
    "id",
    "className",
    "autofocus",
    "disabled",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmouseup",
    "onmouseover",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onfocus",
    "onblur",
    "oncontextmenu",
  ],
  textarea: [
    "hidden",
    "id",
    "className",
    "name",
    "rows",
    "cols",
    "readonly",
    "disabled",
    "placeholder",
    "autofocus",
    "required",
    "maxlength",
    "minlength",
    "wrap",
    "spellcheck",
    "onchange",
    "oninput",
    "onfocus",
    "onblur",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onselect",
    "oncontextmenu",
  ],
  select: [
    "hidden",
    "id",
    "className",
    "name",
    "size",
    "multiple",
    "disabled",
    "autofocus",
    "required",
    "form",
    "onchange",
    "oninput",
    "onfocus",
    "onblur",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onselect",
    "oncontextmenu",
  ],
  ul: ["hidden", "id", "className", "style", "type", "compact"],
  ol: ["hidden", "id", "className", "style", "type", "reversed", "start"],
  li: ["hidden", "id", "className", "style", "value"],
  table: [
    "hidden",
    "id",
    "className",
    "style",
    "border",
    "cellpadding",
    "cellspacing",
    "summary",
    "width",
  ],
  tr: ["hidden", "id", "className", "style", "bgcolor", "align", "valign"],
  td: [
    "hidden",
    "id",
    "className",
    "style",
    "colspan",
    "rowspan",
    "headers",
    "headers",
    "abbr",
    "align",
    "axis",
    "bgcolor",
    "char",
    "charoff",
    "valign",
    "nowrap",
    "width",
    "height",
    "scope",
  ],
  form: [
    "style",
    "hidden",
    "id",
    "className",
    "style",
    "action",
    "method",
    "enctype",
    "name",
    "target",
    "accept-charset",
    "novalidate",
    "autocomplete",
    "autocapitalize",
    "autocorrect",
    "accept",
    "rel",
    "title",
    "onsubmit",
    "onreset",
    "onformdata",
    "oninput",
    "oninvalid",
    "onchange",
    "onblur",
    "onfocus",
  ],
  svg: [
    "style",
    "hidden",
    "id",
    "className",
    "x",
    "y",
    "width",
    "height",
    "viewBox",
    "preserveAspectRatio",
    "xmlns",
    "version",
    "baseProfile",
    "contentScriptType",
    "contentStyleType",
    "fill",
    "stroke",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-opacity",
    "fill-opacity",
    "fill-rule",
    "opacity",
    "color",
    "display",
    "transform",
    "transform-origin",
    "d", // for path element
    "cx", // for circle and ellipse elements
    "cy", // for circle and ellipse elements
    "r", // for circle element
    "rx", // for ellipse and rect elements
    "ry", // for ellipse and rect elements
    "x1", // for line element
    "y1", // for line element
    "x2", // for line element
    "y2", // for line element
    "points", // for polygon and polyline elements
    "offset", // for gradient elements
    "gradientUnits", // for gradient elements
    "gradientTransform", // for gradient elements
    "spreadMethod", // for gradient elements
    "href", // for use element
    "xlink:href", // for use element (deprecated, use href instead)
    "role",
    "aria-hidden",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "tabindex",
    "focusable",
    "title",
    "desc",
  ],
  circle: [
    "style",
    "hidden",
    "id",
    "className",
    "cx",
    "cy",
    "r",
    "fill",
    "stroke",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-opacity",
    "fill-opacity",
    "fill-rule",
    "opacity",
    "color",
    "display",
    "transform",
    "transform-origin",
    "role",
    "aria-hidden",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "tabindex",
    "focusable",
    "title",
    "desc",
  ],
};

function assert(condition, message = "Assertion failed") {
  if (!condition) {
    throw message;
  }
}

class State {
  constructor() {
    this.map = new Map();
    this.render = null;
  }
  setRender(func) {
    this.render = func;
  }
  setItem(key, value) {
    console.log("set item", key);
    this.map.set(key, value);
    if (this.render) this.render();
  }
  // TODO: if key not found throw an Error
  getItem(key) {
    if (!this.map.get(key)) throw `State ${key} not found`;
    return this.map.get(key);
  }
  removeItem(key) {
    this.map.delete(key);
  }
  clear() {
    this.map.clear();
  }
}

function check(child) {
  if (!child) throw "check found NULL child";
  else if (typeof child === "string" || typeof child === "number") {
    return {
      type: "text",
      value: child,
    };
  }
  return child;
}

function createFragment(props, ...children) {
  return children || [];
}

function createElement(tag = null, props = {}, ...children) {
  if (typeof tag === "function") {
    let funcTag = tag(props || {});
    if (funcTag.length == 0) {
      return {
        type: "fragment",
        props: props || {},
        children: (children || []).map(check),
      };
    }
    return createElement(funcTag.tag, funcTag.props, ...funcTag.children);
  }
  if (children && children.length) children = children.map(check);
  const element = {
    tag: tag,
    type: tag && tag != "Route" && tag != "state" ? "element" : "fragment",
    props: props,
    children: children,
  };
  return element;
}

function Routes({ path, element }) {
  return "";
}
// TODO: remove event listen like onclick
function destroyDOM(vdom) {
  // console.log("destory: ", vdom);
  const { type, element } = vdom;
  assert(!!element, "Can only destroy DOM nodes that have been mounted");
  switch (type) {
    case "text": {
      vdom.element.remove();
      break;
    }
    case "element": {
      vdom.element.remove();
      vdom.children.map(destroyDOM);
      break;
    }
    case "fragment": {
      vdom.children.map(destroyDOM);
      break;
    }
    default: {
      break;
    }
  }
}

function mountDOM(vdom, parentDOM) {
  // console.log("mountDOM", vdom, "to", parentDOM);
  const style = {};
  switch (vdom.type) {
    case "element": {
      const { tag, props } = vdom;

      vdom.element = document.createElement(tag);
      console.log(vdom.children);

      Object.keys(props || {}).forEach((key) => {
        if (validTags[vdom?.tag].includes(key)) {
          if (key.startsWith("on")) {
            vdom.element[key] = props[key];
          } else if (key === "style") {
            Object.assign(style, props[key]);
          } else {
            if (tag == "svg" || parent.tagName == "svg")
              vdom.element.setAttribute(key, props[key]);
            else vdom.element[key] = props[key];
          }
        } else {
          console.warn(`Invalid attribute "${key}" ignored.`);
        }
      });
      parentDOM.append(vdom.element);
      vdom.children?.forEach((child) => {
        // console.log(child);
        // child.parent = vdom;
        mountDOM(child, vdom.element);
      });

      break;
    }
    case "fragment": {
      const { tag, props } = vdom;
      if (tag == "state") console.log("found state");
      console.log(vdom);
      vdom.props.state.render = () => {
        console.log("call render");
        vdom.children.map((child) => {
          destroyDOM(child);
        });
        vdom.children.map((child) => {
          mountDOM(child, parentDOM);
        });
        console.log(vdom.props.state);
      };
      vdom.children.map((child) => {
        mountDOM(child, parentDOM);
      });
      break;
    }
    // case "state": {
    //   console.log("mount state", vdom);
    //   vdom.props.state.render = () => {
    //     console.log("call render");
    //     destroyDOM(vdom);
    //     // mountDOM(vdom, parentDOM);
    //   };

    //   vdom.children.map((child) => {
    //     mountDOM(child, parentDOM);
    //   });
    // }
    case "text": {
      const { value } = vdom;
      vdom.element = document.createTextNode(value);
      parentDOM.append(vdom.element);
      break;
    }
    default:
      break;
  }

  if (Object.keys(style).length > 0) {
    vdom.element.style.cssText = Object.keys(style)
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

function createApp({ viewfunc }) {
  let vdom = null;
  //   let states = {};
  let view = viewfunc;
  function renderApp(parent) {
    if (vdom) destroyDOM(vdom);
    console.log(view);
    vdom = view;
    vdom.parent = {};
    vdom.parent.element = parent;
    // vdom.states = view.states;

    // console.log("mount:", vdom);
    // console.log("to parent:", parent);
    mountDOM(vdom, vdom.parent.element);

    // vdom.states.render = () => {
    //   console.log("call render", parent);
    //   renderApp(parent);
    //   // mountDOM(vdom, vdom.parent.element);
    // };
  }
  return {
    mount(parent) {
      // console.log("mount ", vdom);
      renderApp(parent);
      return vdom;
    },
    umount() {
      destroyDOM(vdom);
      vdom = null;
    },
  };
}

export { createApp, createElement, createFragment, State, Routes };
