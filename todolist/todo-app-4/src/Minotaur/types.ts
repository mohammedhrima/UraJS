export interface StateMap {
  state: Map<number, any>;
  handler: () => void;
}

export type VDOMNode = VDOM | string | number;
export type Tag = string | Function;
export type Props = { [key: string]: any } | {};

export type VDOM = {
  type: number;
  tag?: Tag;
  props?: Props;
  events?: Record<string, EventListener>;
  value?: string | number;
  dom?: HTMLElement;
  key?: number;
  render?: Function;
  index: number;
  children?: Array<VDOMNode>;
};

export type Rec = {
  mode: number;
  curr: VDOM | null;
  next: VDOM | null;
  children?: Array<Rec>;
};

export type MiniComponent = {
  key: number | null;
  render: () => VDOM;
};
