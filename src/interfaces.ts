type Fn<P> = (props: P) => any;

export interface WithDataParams<P = any> {
  requiredProp: keyof P | Fn<P>;
  // tslint:disable-next-line:ban-types
  fetchMethod: keyof P | Fn<P>;
  fetchMethodParams?: any[];
}