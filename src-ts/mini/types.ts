// type.ts

export type VDOMNode = VDOM | string | number;
export type Props = { [key: string]: any } | {};
export type Tag = string | Function;

export enum TYPE {
  ELEMENT = 1,
  FRAGMENT,
  TEXT,
  SELECTOR,
  STATE,
  FUNCTION,
}

export type VDOM = {
  tag?: Tag;
  type: TYPE;
  props?: Props;
  index?: number;
  children?: Array<VDOMNode>;
  value?: string | number;
  dom?: HTMLElement;
  parent?: any | VDOM;
  events?: Record<string, EventListener> ;
  func?: Function;
  states?: Object;
};

export type MiniComponent = {
  key: any | null;
  component: () => VDOM;
};

