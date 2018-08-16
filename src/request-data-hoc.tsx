import * as React from 'react';
import { WithDataParams } from './interfaces';

export interface FetchProps {
  isFetching: boolean;
}

interface State {
  requestedProps: any[];
}

export const withData = <P extends { [key: string]: any }>(params: WithDataParams<P>[]) => (
  WrappedComponent: React.ComponentClass | React.SFC
) => {
  return class RequestData extends React.Component<P & FetchProps, Readonly<State>> {
    requests = new Map();

    componentDidMount() {
      this.fetchDataIfRequired();
    }

    componentDidUpdate(prevProps: P & FetchProps) {
      params.forEach(el => {
        const fetchMethod = this.getFromProps(el.fetchMethod);
        const existingRequest = this.requests && this.requests.get(fetchMethod);
      });
      // TODO: investigate fetch on params change
      // this.fetchDataIfRequired();
    }

    // tslint:disable-next-line:ban-types
    getFromProps(prop?: keyof P | any[] | Function) {
      let requiredProp;

      if (typeof prop === 'function') {
        requiredProp = prop(this.props);
      }

      if (typeof prop === 'string') {
        requiredProp = this.props[prop];
      }

      return requiredProp;
    }

    fetchDataIfRequired() {
      const { props, state, setState } = this;

      params.forEach(el => {
        const fetchMethod = this.getFromProps(el.fetchMethod);
        const requiredProp = this.getFromProps(el.requiredProp);
        const { fetchMethodParams = [] } = el;
        const hasAllParams = fetchMethodParams.every(p => p !== undefined);
        const existingRequest = this.requests && this.requests.get(fetchMethod);

        if (!hasAllParams || !fetchMethod) {
          return;
        }

        const isFetchRequired =
          !existingRequest || fetchMethodParams !== existingRequest.fetchMethodParams;

        if (isFetchRequired) {
          this.requests.set(fetchMethod, { fetchMethod, requiredProp, fetchMethodParams });
          fetchMethod(...fetchMethodParams);
        }
      });
    }

    getRequestedProps() {
      return params.map(p => ({
        ...p,
        requiredProp: this.getFromProps(p.requiredProp)
      }));
    }

    get isFetching() {
      const requestedProps = params.map(p => this.getFromProps(p.requiredProp));
      return requestedProps.some(prop => prop === undefined);
    }

    render() {
      const propsBag = Object.assign({}, this.props, { isFetching: this.isFetching });
      return <WrappedComponent {...propsBag} />;
    }
  };
};
