// type.ts

export type VDOMNode = VDOM | string | number;
export type Props = { [key: string]: any } | {};
export type Tag = string | Function;

export const TYPE = {
  ELEMENT: "element",
  FRAGMENT: "fragment",
  TEXT: "text",
  SELECTOR: "selector",
  STATE: "state",
  FUNCTION: "function",
  ROUTE: "route",
};

export type VDOM = {
  tag?: Tag;
  type: string;
  props?: Props;
  index?: number;
  children?: Array<VDOMNode>;
  value?: string | number;
  dom?: HTMLElement;
  // parent?: any | VDOM;
  events?: Record<string, EventListener>;
  func?: Function;
  states?: Object;
};

export type MiniComponent = {
  key: any | null;
  component: () => VDOM;
};

// export type MiniRoute = {
//   path: string;
//   call: (props?: Props) => MiniComponent;
// };

// export type MiniMatch = {
//   route: MiniRoute;
//   result: RegExpMatchArray | null;
// };
