export type Tag = string | Function;
export type Props = { [key: string]: any };

export type VDOM = {
  type: any;
  tag?: Tag;
  props?: Props | any;
  value?: string | number;
  dom?: HTMLElement;
  key?: number;
  children?: any;
  call?: Function; // for exec tag
  funcProps?: Props;
  isfunc?: Boolean;
  func?: Function
};
