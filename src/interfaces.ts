export interface WithDataParams<P = any> {
  requiredProp: any;
  // tslint:disable-next-line:ban-types
  fetchMethod: (...args: any[]) => any;
  fetchMethodParams?: any[];
}
