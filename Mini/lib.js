      
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
    "d",  // for path element
    "cx", // for circle and ellipse elements
    "cy", // for circle and ellipse elements
    "r",  // for circle element
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
    "desc"
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
    "desc"
  ]
};

// RENDERING
class Variable {
  constructor(initialValue) {
    this.aInternal = initialValue;
    this.aListener = function (new_val) { };
  }

  set value(new_val) {
    this.aInternal = new_val;
    this.aListener(new_val);
  }

  get value() {
    return this.aInternal;
  }

  registerListener(listener) {
    this.aListener = listener.bind(this);
  }
}

function check(child) {
  if (typeof child === "string" || typeof child === "number") {
    return {
      type: "text",
      value: child,
    };
  }
  if (child instanceof Variable) {
    return {
      type: "variable",
      value: child,
    };
  }
  return child;
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
    // if (funcTag.type == "text") {
    //   console.log("is text");
    // }
    return createElement(funcTag.tag, funcTag.props, ...funcTag.children);
  }
  if (children && children.length) children = children.map(check);
  const element = {
    tag: tag,
    type: tag && tag != "Route" ? "element" : "fragment",
    props: props,
    children: children,
  };
  // console.log("createElement: ", element);
  return element;
}

function render(vdom, parent) {
  if (!vdom) return;
  if (typeof vdom === "function") {
    let func = vdom();
    return render(func, parent);
  }

  let { type, tag, props, children } = vdom;
  switch (type) {
    /*==============  TEXT  ===============*/
    case "text": {
      parent?.appendChild(document.createTextNode(vdom.value));
      break;
    }

    /*============== VARIABLE ==============*/
    case "variable": {
      //   console.log("found var", vdom.value);
      vdom.value.registerListener(function (val) {
        console.log("Someone changed the value of value to " + val);
        console.log("vdom.value: ", vdom.value.value);
        parent.innerHTML = val;
        // vdom.value.value = val;
        // parent?.appendChild(document.createTextNode(vdom.value.value));
      });
      parent?.appendChild(document.createTextNode(vdom.value.value));
      break;
    }

    /*============== ELEMENT ==============*/
    case "element": {
      if (!validTags.hasOwnProperty(tag))
        throw new Error(`Invalid tag "${tag}"`);
      let dom;
      const svgNS = "http://www.w3.org/2000/svg";
      if (tag == "svg") {
        // console.log("is svg");
        dom = document.createElementNS(svgNS, "svg");
      }
      else {
        if (parent?.tagName == "svg") {
          // console.log("parent is svg");
          dom = document.createElementNS(svgNS, tag);
        }
        else
          dom = document.createElement(tag);
      }
      const style = {};
      Object.keys(props || {})
        .filter((key) => key != "children")
        .forEach((key) => {
          // console.log(key, ":", props[key]);
          if (validTags[vdom?.tag].includes(key)) {
            if (key.startsWith("on")) {
              dom[key] = props[key];
            }
            else if (key === "style") {
              Object.assign(style, props[key]);

              if (props[key] instanceof Variable) {
                props[key].registerListener(function (val) {
                  // dom[key] = val;
                  // console.log("set style: ", props[key]);
                  console.log("lib: set style: ", props[key].value);
                  dom.style = {
                    ...val,
                    ...dom.style,
                  };
                  console.log(dom.style);
                })
                Object.keys(props[key].value).map(skey=>{
                  console.log("map: ", skey , " -> ", props[key].value[skey]);
                  dom.style[skey] = props[key].value[skey];
                })
                // console.log(props[key].value);
                // dom.style = props[key].value;
                // dom.style = {
                //   ...dom.style,
                //   ...props[key].value
                // }
                // dom.style = props[key].value
                // props[key].registerListener(function (val) {
                //   dom.style = {
                //     ...dom.style,
                //     ...val
                //   }
                // })
              }
              else {
                dom.style = {
                  ...dom.style,
                  ...props[key]
                }
              }
            }
            else {
              if (tag == "svg" || parent.tagName == "svg") {
                if (props[key] instanceof Variable) {
                  props[key].registerListener(function (val) {
                    dom.setAttribute(key, val);
                  })
                }
                else {
                  dom.setAttribute(key, props[key]);
                }
              }
              else {
                if (props[key] instanceof Variable) {
                  props[key].registerListener(function (val) {
                    dom[key] = val;
                  })
                }
                else {
                  dom[key] = props[key];
                }
              }
            }
          } else {
            console.warn(`Invalid attribute "${key}" ignored.`);
          }
        });

      if (Object.keys(style).length > 0) {
        dom.style.cssText = Object.keys(style)
          .map((styleProp) => {
            const Camelkey = styleProp.replace(
              /[A-Z]/g,
              (match) => `-${match.toLowerCase()}`
            );
            return `${Camelkey}:${style[styleProp]}`;
          })
          .join(";");
      }

      children?.map((child) => {
        render(child, dom);
      });
      parent.appendChild(dom);
      break;
    }

    /*============== FRAGMENT =============*/
    case "fragment": {
      children?.map((child) => {
        render(child, parent);
      });
      break;
    }
    default:
      break;
  }
}

function Fragment(props, ...children) {
  return children || [];
}

// ROUTING
// let app = document.getElementById("app");
const routes = [
  {
    path: "",
    element: () => "" /*<h4 className="Mini_Error_Not_Found">Error: Not Found</h4>*/,
  },
];

function pathToRegex(path) {
  return new RegExp(
    "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
  );
}

function getParams(match) {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );
  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
}

// async function router() {
//   // Test routes
//   const matches = routes.map((route) => {
//     return {
//       route: route,
//       result: location.pathname.match(pathToRegex(route.path)),
//     };
//   });
//   // find the matche object for the current route
//   let match = matches.find((elem) => elem.result !== null);
//   if (!match) {
//     // if route doesn't exists
//     match = {
//       route: routes[0],
//       result: [location.pathname],
//     };
//   }
//   let element = match.route.element(getParams(match));
//   // console.log("router: ", element);
//   app = document.getElementById("app");
//   app.innerHTML = "";
//   Mini.render(element, app);
// }

// // when going back and forward
// window.addEventListener("popstate", router);
// // on loading
// document.addEventListener("DOMContentLoaded", () => {
//   router();
// });

function Routes({ path, element }) {
  if (path === "*") routes[0].element = element;
  else routes.push({ path, element });
  return "" /*<></>*/;
}

const Mini = { createElement, Fragment, render, Routes, Variable };
export default Mini;
window.Mini = Mini;
