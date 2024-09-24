import { VDOM, Tag, Props, VDOMNode } from "./types.js";
import * as UTILS from "./utils.js";

// JSX HANDLING
let vdom_index: number = 1;
export function check(children: Array<VDOMNode>): Array<VDOMNode> {
  //@ts-ignore
  return children.map((child) => {
    if (child == null || typeof child === "string" || typeof child === "number") {
      return {
        type: UTILS.TEXT,
        index: vdom_index++,
        value: child,
      };
    }
    return child;
  });
}

export function fragment(props: Props, ...children: Array<VDOMNode>): VDOM {
  return {
    type: UTILS.FRAGMENT,
    index: vdom_index++,
    children: check(children || []),
  };
}

export function element(tag: Tag, props: Props, ...children: Array<VDOMNode>): VDOM {
  // try {
  if (typeof tag === "function") {
    // console.log("before:", tag);
    let funcTag = tag(props || {});
    // console.log("after:", funcTag);

    if (funcTag.type == UTILS.FRAGMENT) {
      funcTag = {
        ...funcTag, 
        children: check(children || []),
      }
      console.log("found fragment", funcTag);
      return funcTag
    } else if (funcTag.type) return funcTag;
    throw `function ${tag} must return JSX`;
  }
  if (tag === "if") {
    return {
      index: vdom_index++,
      type: UTILS.FRAGMENT,
      children: check(props?.cond && children ? children : []),
    };
  } else if (tag === "loop") {
    let res = (props.on || []).flatMap((elem, id) =>
      (children || []).map((child) => {
        if (typeof child === "function") {
          //@ts-ignore
          return child(elem, id);
        }
        return child;
      })
    );
    return {
      index: vdom_index++,
      type: UTILS.FRAGMENT,
      children: check(res || []),
    };
  }
  return {
    index: vdom_index++,
    tag: tag,
    type: UTILS.ELEMENT,
    props: props,
    children: check(children || []),
  };
  // } catch (error) {
  //   console.error(`failed to render ${tag}`);
  // }
}
