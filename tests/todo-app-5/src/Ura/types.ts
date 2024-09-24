export interface StateMap {
  store: Map<number, any>;
  vdom: VDOM;
  render?: () => VDOM;
  state?: <T>(initialValue: T) => [() => T, (newValue: T) => void];
}

export type VDOMNode = VDOM | string | number;
export type Tag = string | Function;
export type Props = { [key: string]: any };

export type VDOM = {
  type: any;
  tag?: Tag;
  props?: Props;
  value?: string | number;
  dom?: HTMLElement;
  key?: number;
  render?: Function;
  index: number;
  children?: Array<VDOMNode>;
};

// export type Rec = {
//   mode: number;
//   left: VDOM | null;
//   right: VDOM | null;
//   children?: Array<Rec>;
// };

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