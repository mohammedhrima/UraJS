import { Props, ResponseConfig } from "./types.js";
import Mino from "./code.js";

export function loadCSS(filename: string) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = filename;
  document.head.appendChild(link);
}

export function Error(props: Props | null) {
  return {
    key: null,
    render: () => {
      return Mino.element(
        "root",
        {},
        Mino.element(
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

export function deepEqual(a: any, b: any) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === "function" && typeof b === "function")
    return a.toString() === b.toString();
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

// HTTP
const defaultHeaders = {
  "Content-Type": "application/json",
};

export async function send_HTTP_Request<T>(
  method: string,
  url: string,
  headers: { [key: string]: any } = {},
  body?: any
): Promise<ResponseConfig<T>> {
  try {
    const response = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData: T = await response.json();

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error) {
    throw error;
  }
}

// FLAGS
export const ELEMENT = "element";
export const FRAGMENT = "fragment";
export const TEXT = "text";

export const CREATE = 12;
export const KEEP = 4;
export const INSERT = 5;
export const REPLACE = 6;
export const REMOVE = 7;
export const UPDATE = 8;

export const PROP_INSERT = 9;
export const PROP_REPLACE = 10;
export const PROP_REMOVE = 11;

// VALID TAGS
export const validTags: any = {
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
    "submit",
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
    "d",
    "cx",
    "cy",
    "r",
    "rx",
    "ry",
    "x1",
    "y1",
    "x2",
    "y2",
    "points",
    "offset",
    "gradientUnits",
    "gradientTransform",
    "spreadMethod",
    "href",
    "xlink:href",
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
  br: [],
  script: [],
};
