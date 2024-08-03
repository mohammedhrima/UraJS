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

// RENDERING
class Variable {
  constructor(initialValue) {
    this.aInternal = initialValue;
    this.aListener = function (new_val) {};
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

function Src(props, ...children) {
  const element = {
    tag: "",
    type: "selector",
    props: props,
    children: children,
  };
  return element;
}

function createElement(tag = null, props = {}, ...children) {
  //   console.log(tag);
  if (typeof tag === "function") {
    let funcTag = tag(props || {});
    if (funcTag.type == "selector") {
      // funcTag.props = {
      // 	...funcTag.props,
      // 	...props
      // }
      funcTag.children = [...funcTag.children, ...children];
      //   console.log("the selector is: ", funcTag);
      // funcTag.children = children;
      return funcTag;
    } else if (funcTag.length == 0) {
      console.log(tag);
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

function render(vdom, parent = null) {
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
      } else {
        if (parent?.tagName == "svg") {
          // console.log("parent is svg");
          dom = document.createElementNS(svgNS, tag);
        } else dom = document.createElement(tag);
      }
      const style = {};
      Object.keys(props || {})
        .filter((key) => key != "children")
        .forEach((key) => {
          // console.log(key, ":", props[key]);
          if (validTags[vdom?.tag].includes(key) || key == "parent") {
            if (key.startsWith("on")) {
              dom[key] = props[key];
            } else if (key === "style") {
              Object.assign(style, props[key]);
              if (props[key] instanceof Variable) {
                props[key].registerListener(function (val) {
                  // dom[key] = val;
                  // console.log("set style: ", props[key]);
                  //   console.log("lib: set style: ", props[key].value);
                  dom.style = {
                    ...val,
                    ...dom.style,
                  };
                  //   console.log(dom.style);
                });
                Object.keys(props[key].value).map((skey) => {
                  //   console.log("map: ", skey, " -> ", props[key].value[skey]);
                  dom.style[skey] = props[key].value[skey];
                });
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
              } else {
                dom.style = {
                  ...dom.style,
                  ...props[key],
                };
              }
            }
            // else if (key == "parent") {
            // 	parent = document.querySelector(`[data-tag=${props[key]}]`)
            // 	// parent = document.querySelector(parent);
            // }
            else {
              if (tag == "svg" || parent?.tagName == "svg") {
                if (props[key] instanceof Variable) {
                  props[key].registerListener(function (val) {
                    dom.setAttribute(key, val);
                  });
                } else {
                  dom.setAttribute(key, props[key]);
                }
              } else {
                if (props[key] instanceof Variable) {
                  props[key].registerListener(function (val) {
                    dom[key] = val;
                  });
                } else {
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
      if (parent) parent.appendChild(dom);
      else {
        console.warn("Parent is NULL");
        console.log(children);
      }
      break;
    }

    /*============== FRAGMENT =============*/
    case "fragment": {
      children?.map((child) => {
        render(child, parent);
      });
      break;
    }
    case "selector":
      let parentTag = document.querySelector(`[data-tag=${props.name}]`);
      // console.log("children: ", children);
      children?.map((child) => {
        render(child, parentTag);
      });
      //   console.log("found selector: ", tag);
      break;
    default:
      break;
  }
}

function Fragment(props, ...children) {
  return children || [];
}

// ROUTING
// let app = document.getElementById("app");
let routes = [
  {
    path: "",
    page: "",
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

async function router() {
  // Test routes
  const matches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });
  // find the matche object for the current route
  let match = matches.find((elem) => elem.result !== null);
  if (!match) {
    // if route doesn't exists
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }
  //   console.log("mathc is: ", match);
  // let element = match.route.element(getParams(match));
  // console.log("router: ", element);
  //   app = document.getElementById("app");
  //   app.innerHTML = "";
  //   Mini.render(element, app);
  //   console.log("pathname is", location.pathname);
  //   let pageRoute = routes.find((route) => route.path == location.pathname);
  //   console.log("res: ", pageRoute);

  //   const interval = setInterval(() => {
  //     const iframe = document.getElementById("frame");
  //     if (iframe) {
  //       iframe.src = "dist/pages/Home/home.html";
  //       clearInterval(interval);
  //     }
  //   }, 100);
}

let CurrentRoute = null;

function waitForIframe(selector) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    const maxAttempts = 50;
    let attempts = 0;

    const checkIframe = setInterval(() => {
      const iframe = document.querySelector(selector);
      if (iframe) {
        clearInterval(checkIframe);
        resolve(iframe);
        console.log("found");
        return;
      } else if (attempts >= maxAttempts) {
        clearInterval(checkIframe);
        reject(new Error("Iframe not found after maximum attempts"));
      }
      attempts++;
    }, interval);
  });
}

// Usage with async/await
let Page = {
  iframe: "",
};

function Navigate(path, src) {
  // console.log("call navigate function from ", src);

  // const storedRoute = sessionStorage.getItem(path);
  // if (storedRoute) {
  //   let page = JSON.parse(storedRoute);
  //   console.log("route is", page, "get it from ", routes);
  //   // console.log(parent.window.frames[0].location.pathname);
  //   // parent.window.frames[0].location.pathname = page
  //   (async () => {
  //     try {
  //       const iframe = await waitForIframe("#frame");
  //       iframe.src = page;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  //   CurrentRoute = path;
  //   // let iframe = document.getElementById("frame");
  //   // 	if(iframe) iframe.src = page;
  //   // 	else console.warn("iframe not found");
  // } else {
  //   console.warn(path, " Not found");
  // }
  let page = sessionStorage.getItem(path);
  console.log("page: ", page);
  // const iframe = document.getElementById("frame");
  // iframe.src = page;
  console.log(Page);
  // console.log("iframe: ", iframe);
}

// window.addEventListener("load", (e) => {
//   e.preventDefault();
//   Navigate("/", "load");
// });
window.onload = () => {
  console.log("onload");
  //  let  iframe = document.getElementById("frame");
  // iframe.src = "dist/pages/Home/home.html";
  //   if (!CurrentRoute) Navigate("/", "load");
};

// Listen for manual URI changes
window.addEventListener("popstate", (e) => {
  e.preventDefault();
});

// on loading
document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
});

function Routes({ path, element }) {
  //   if (path === "*") routes[0].element = element;
  //   else routes.push({ path, element });
  //   return "" /*<></>*/;
}

function setRoute(path, page) {
  sessionStorage.setItem(path, page);
  //   routes.push({ path, page });
  console.log("setRoutes:", path);
}

// function Byclass(name) {
//   return document.getElementsByClassName(name)[0];
// }

// function Byid(name) {
//   return document.getElementById(name);
// }
const Byclass = (className) => document.querySelector("." + className);
const Byid = (id) => document.querySelector("#" + id);

export const Mini = {
  createElement,
  Fragment,
  render,
  Src,
  Routes,
  Byclass,
  Byid,
  Variable,
  setRoute,
  Navigate,
  routes,
  Page,
};
