import * as React from 'react';
import { WithDataParams } from './interfaces';
import { isFunction } from 'util';

export interface FetchProps {
  isFetching: boolean;
}

interface State {
  requestedProps: any[];
}

export const withData = <P extends { [key: string]: any }>(
  params: (props: Partial<P>) => WithDataParams<P>[]
) => (WrappedComponent: React.ComponentClass | React.SFC) => {
  return class RequestData extends React.Component<P & FetchProps, Readonly<State>> {
    requests = new Map();

    componentDidMount() {
      this.fetchDataIfRequired();
    }

    componentDidUpdate(prevProps: P & FetchProps) {
      this.fetchDataIfRequired();
    }

    getParams() {
      if (!isFunction(params)) {
        return;
      }

      return params(this.props);
    }

    fetchDataIfRequired() {
      const { props, state, setState } = this;
      const parsedParams = this.getParams();

      if (!parsedParams) {
        return;
      }

      parsedParams.forEach(({ requiredProp, fetchMethod, fetchMethodParams = [] }) => {
        const hasAllParams = fetchMethodParams.every(p => p !== undefined);
        const existingRequest = this.requests && this.requests.get(fetchMethod);

        if (!hasAllParams || !fetchMethod) {
          return;
        }

        const isFetchRequired =
          !existingRequest ||
          fetchMethodParams.some((p, idx) => p !== existingRequest.fetchMethodParams[idx]);

        if (isFetchRequired) {
          this.requests.set(fetchMethod, {
            fetchMethod,
            requiredProp,
            fetchMethodParams
          });
          fetchMethod(...fetchMethodParams);
        }
      });
    }

    get isFetching() {
      const parsedParams = this.getParams();

      if (!parsedParams) {
        return false;
      }

      return parsedParams.map(p => p.requiredProp).some(p => p === undefined);
    }

    get hasError() {
      return this.getParams() === undefined;
    }

    render() {
      const propsBag = Object.assign({}, this.props, {
        isFetching: this.isFetching,
        hasError: this.hasError
      });
      return <WrappedComponent {...propsBag} />;
    }
  };
};
