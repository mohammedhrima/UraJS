export type Tag = string | Function;
export type Props = { [key: string]: any };

export type VDOM = {
  "ura-if"?: string;
  "ura-loop"?: string;
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
  func?: Function;
};
