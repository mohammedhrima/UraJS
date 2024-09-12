"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validTags = {
    children: [],
    nav: ["props", "path"],
    a: ["accesskey", "hidden", "charset", "className", "coords", "download",
        "href", "hreflang", "id", "name", "ping", "rel", "rev", "shape",
        "style", "target", "title",],
    img: ["className", "alt", "src", "hidden", "srcset", "sizes", "crossorigin",
        "usemap", "ismap", "width", "height", "referrerpolicy", "loading",
        "decoding", "onmouseenter", "onmouseleave", "onmouseover", "onmouseout",
        "onclick", "style",],
    i: ["class", "id", "title", "style", "dir", "lang", "accesskey", "tabindex"],
    div: ["id", "className", "style", "data-*", "aria-*", "title", "dir", "lang",
        "tabindex", "accesskey", "contenteditable", "draggable", "spellcheck",
        "hidden", "onclick", "ondblclick", "onmousedown", "onmouseup",
        "onmouseover", "onmousemove", "onmouseout", "onmouseenter", "onmouseleave",
        "onkeydown", "onkeyup", "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    p: ["textContent", "hidden", "id", "className", "style", "data-*", "aria-*",
        "title", "dir", "lang", "tabindex", "accesskey", "contenteditable", "spellcheck",
        "onclick", "ondblclick", "onmousedown", "onmouseup", "onmouseover",
        "onmousemove", "onmouseout", "onmouseenter", "onmouseleave", "onkeydown",
        "onkeyup", "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    h1: ["hidden", "id", "className", "style", "data-*", "aria-*", "title", "dir",
        "lang", "tabindex", "accesskey", "contenteditable", "spellcheck", "onclick",
        "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove",
        "onmouseout", "onmouseenter", "onmouseleave", "onkeydown", "onkeyup",
        "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    h2: ["hidden", "id", "className", "style", "data-*", "aria-*", "title", "dir",
        "lang", "tabindex", "accesskey", "contenteditable", "spellcheck", "onclick",
        "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove",
        "onmouseout", "onmouseenter", "onmouseleave", "onkeydown", "onkeyup",
        "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    h3: ["hidden", "id", "className", "style", "data-*", "aria-*", "title", "dir",
        "lang", "tabindex", "accesskey", "contenteditable", "spellcheck", "onclick",
        "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove",
        "onmouseout", "onmouseenter", "onmouseleave", "onkeydown", "onkeyup",
        "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    h4: ["hidden", "id", "className", "style", "data-*", "aria-*", "title", "dir",
        "lang", "tabindex", "accesskey", "contenteditable", "spellcheck", "onclick",
        "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove",
        "onmouseout", "onmouseenter", "onmouseleave", "onkeydown", "onkeyup",
        "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    h5: ["hidden", "id", "className", "style", "data-*", "aria-*", "title", "dir",
        "lang", "tabindex", "accesskey", "contenteditable", "spellcheck", "onclick",
        "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove",
        "onmouseout", "onmouseenter", "onmouseleave", "onkeydown", "onkeyup",
        "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    h6: ["hidden", "id", "className", "style", "data-*", "aria-*", "title", "dir",
        "lang", "tabindex", "accesskey", "contenteditable", "spellcheck", "onclick",
        "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove",
        "onmouseout", "onmouseenter", "onmouseleave", "onkeydown", "onkeyup",
        "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    span: ["hidden", "id", "className", "style", "data-*", "aria-*", "title", "dir",
        "lang", "tabindex", "accesskey", "contenteditable", "spellcheck", "onclick",
        "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove",
        "onmouseout", "onmouseenter", "onmouseleave", "onkeydown", "onkeyup",
        "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    input: ["style", "hidden", "type", "name", "value", "id", "className",
        "placeholder", "readonly", "disabled", "checked", "size", "maxlength",
        "min", "max", "step", "pattern", "required", "autofocus", "autocomplete",
        "autocapitalize", "autocorrect", "list", "multiple", "accept", "capture",
        "form", "formaction", "formenctype", "formmethod", "formnovalidate",
        "formtarget", "height", "width", "alt", "src", "usemap", "ismap",
        "tabindex", "title", "accesskey", "aria-*", "role", "aria-*", "aria-*",
        "onchange", "oninput", "oninvalid", "onsubmit", "onreset", "onclick",
        "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove",
        "onmouseout", "onmouseenter", "onmouseleave", "onkeydown", "onkeyup",
        "onkeypress", "onfocus", "onblur", "oncontextmenu",],
    button: ["style", "hidden", "type", "name", "value", "id", "className",
        "autofocus", "disabled", "form", "formaction", "formenctype", "formmethod",
        "formnovalidate", "formtarget", "onclick", "ondblclick", "onmousedown",
        "onmouseup", "onmouseover", "onmousemove", "onmouseout", "onmouseenter",
        "onmouseleave", "onkeydown", "onkeyup", "onkeypress", "onfocus", "onblur",
        "oncontextmenu",],
    textarea: ["hidden", "id", "className", "name", "rows", "cols", "readonly",
        "disabled", "placeholder", "autofocus", "required", "maxlength", "minlength",
        "wrap", "spellcheck", "onchange", "oninput", "onfocus", "onblur",
        "onkeydown", "onkeyup", "onkeypress", "onselect", "oncontextmenu",],
    select: ["hidden", "id", "className", "name", "size", "multiple", "disabled",
        "autofocus", "required", "form", "onchange", "oninput", "onfocus", "onblur",
        "onkeydown", "onkeyup", "onkeypress", "onselect", "oncontextmenu",],
    ul: ["hidden", "id", "className", "style", "type", "compact"],
    ol: ["hidden", "id", "className", "style", "type", "reversed", "start"],
    li: ["hidden", "id", "className", "style", "value"],
    table: ["hidden", "id", "className", "style", "border", "cellpadding",
        "cellspacing", "summary", "width",],
    tr: ["hidden", "id", "className", "style", "bgcolor", "align", "valign"],
    td: ["hidden", "id", "className", "style", "colspan", "rowspan", "headers",
        "headers", "abbr", "align", "axis", "bgcolor", "char", "charoff", "valign",
        "nowrap", "width", "height", "scope",],
    form: ["style", "hidden", "id", "className", "style", "action", "method",
        "enctype", "name", "target", "accept-charset", "novalidate", "autocomplete",
        "autocapitalize", "autocorrect", "accept", "rel", "title", "onsubmit",
        "onreset", "onformdata", "oninput", "oninvalid", "onchange", "onblur",
        "onfocus",],
    svg: ["style", "hidden", "id", "className", "x", "y", "width", "height",
        "viewBox", "preserveAspectRatio", "xmlns", "version", "baseProfile",
        "contentScriptType", "contentStyleType", "fill", "stroke", "stroke-width",
        "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-dasharray",
        "stroke-dashoffset", "stroke-opacity", "fill-opacity", "fill-rule",
        "opacity", "color", "display", "transform", "transform-origin", "d", "cx",
        "cy", "r", "rx", "ry", "x1", "y1", "x2", "y2", "points", "offset",
        "gradientUnits", "gradientTransform", "spreadMethod", "href", "xlink:href",
        "role", "aria-hidden", "aria-label", "aria-labelledby", "aria-describedby",
        "tabindex", "focusable", "title", "desc",],
    circle: ["style", "hidden", "id", "className", "cx", "cy", "r", "fill", "stroke",
        "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit",
        "stroke-dasharray", "stroke-dashoffset", "stroke-opacity", "fill-opacity",
        "fill-rule", "opacity", "color", "display", "transform", "transform-origin",
        "role", "aria-hidden", "aria-label", "aria-labelledby", "aria-describedby",
        "tabindex", "focusable", "title", "desc",],
};
exports.default = validTags;
