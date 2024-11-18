export type Tag = string | Function;
export type Props = { [key: string]: any };

export type VDOM = {
  type: any;
  tag?: Tag;
  props?: Props;
  funcProps?: Props;
  value?: string | number;
  dom?: HTMLElement;
  key?: number;
  render?: Function;
  index: number;
  children?: any;
  isfunc?: Boolean;
};
