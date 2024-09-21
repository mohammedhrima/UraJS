export type VDOMNode = VDOM | string | number;
export type Props = { [key: string]: any } | {};
export type Tag = string | Function;

export const TYPE = {
  ELEMENT: "element",
  FRAGMENT: "fragment",
  TEXT: "text",
};

export interface StateMap {
  state: Map<number, any>;
  handler: () => void;
}

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
  // states?: Object;
  isfunc?: boolean;
  func?: Function;
  key?: number;
};

// export type Recon = {
//   left?: VDOM;
//   right?: VDOM;
//   action: string;
//   subs?: Array<Recon>;
// };

export type MiniComponent = {
  key: number | null;
  render: () => VDOM;
};
