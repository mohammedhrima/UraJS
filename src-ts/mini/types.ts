// type.ts

export type VDOMNode = VDOM | string | number;
export type Props = { [key: string]: any } | {};
export type Tag = string | Function;

export const TYPE = {
  ELEMENT: 1,
  FRAGMENT: 2,
  TEXT: 3,
  SELECTOR: 4,
  STATE: 5,
  FUNCTION: 6,
};

export type VDOM = {
  tag?: Tag;
  type: number;
  props?: Props;
  index?: number;
  children?: Array<VDOMNode>;
  value?: string | number;
  dom?: HTMLElement;
  parent?: any | VDOM;
  events?: Record<string, EventListener>;
  func?: Function;
  states?: Object;
};

export type MiniComponent = {
  key: any | null;
  component: () => VDOM;
};
