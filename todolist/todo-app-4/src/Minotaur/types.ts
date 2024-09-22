export interface StateMap {
  state: Map<number, any>;
  handler: () => void;
}

export type VDOMNode = VDOM | string | number;
export type Tag = string | Function;
export type Props = { [key: string]: any };

export type VDOM = {
  type: any;
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
  left: VDOM | null;
  right: VDOM | null;
  children?: Array<Rec>;
};

export type MiniComponent = {
  key: number | null;
  render: () => VDOM;
};

export interface ResponseConfig<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}
