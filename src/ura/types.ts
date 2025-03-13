export type Tag = string | Function;
export type Props = { [key: string]: any };

export type VDOM = {
  type: any;
  tag?: Tag;
  props?: Props | any;
  value?: string | number;
  dom?: HTMLElement;
  key?: number;
  render?: Function;
  children?: any;
  call?: Function;
  // funcProps?: Props;
  // isfunc?: Boolean;
};
