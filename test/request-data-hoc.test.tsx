import { withData } from '../src/request-data-hoc';
import { WithDataParams } from './../src/interfaces';
import { FetchProps } from './../src/request-data-hoc';
import React from 'react';
import { mount, shallow } from 'enzyme';

const Wrapped = () => <div />;
const buildComponent = (params: (props) => WithDataParams[]) => withData(params)(Wrapped);
const getDefaultParams = (requiredProp, fetchMethod, fetchMethodParams = []) => ({
  requiredProp,
  fetchMethod,
  fetchMethodParams
});

const onCompletion = test =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        test();
      } catch (e) {
        reject(e);
      }

      resolve();
    });
  });

describe('withData', () => {
  describe('WHEN params are not provided', () => {
    it('should render a wrapped component with hasError', async () => {
      const Component = buildComponent(null);
      const component = mount(<Component />);
      const wrapped = component.find(Wrapped);

      expect(wrapped.props().isFetching).toEqual(false);
      expect(wrapped.props().hasError).toEqual(true);
    });
  });

  describe('WHEN params are empty', () => {
    it('should render a wrapped component', async () => {
      const Component = buildComponent(props => []);
      const component = mount(<Component />);
      const wrapped = component.find(Wrapped);

      expect(wrapped.props().isFetching).toEqual(false);
      expect(wrapped.props().hasError).toEqual(false);
    });
  });

  describe('WHEN requiredProp is undefined', () => {
    it('should call fetchMethod with no params', () => {
      const requiredPropSpy = jest.fn();
      const fetchSpy = jest.fn();
      const fetchParams = [];
      const params = getDefaultParams(undefined, fetchSpy, fetchParams);
      const Component = buildComponent(props => [params]);
      const component = mount(<Component />);
      const wrapped = component.find(Wrapped);

      expect(fetchSpy).toHaveBeenCalledWith();
      expect(wrapped.props().isFetching).toEqual(true);
    });

    it('should call fetchMethod with empty params', () => {
      const requiredPropSpy = jest.fn();
      const fetchSpy = jest.fn();
      const fetchParams = [];
      const params = getDefaultParams(undefined, fetchSpy, fetchParams);
      const Component = buildComponent(props => [params]);
      const component = mount(<Component />);
      const wrapped = component.find(Wrapped);

      expect(fetchSpy).toHaveBeenCalledWith();
      expect(wrapped.props().isFetching).toEqual(true);
    });

    it('should call fetchMethod with multiple params', () => {
      const requiredPropSpy = jest.fn();
      const fetchSpy = jest.fn();
      const Component = buildComponent(props => [
        getDefaultParams(props.foo, props.getFoo, [props.value1, props.value2])
      ]);

      const component = shallow(
        <Component getFoo={fetchSpy} value1="someValue1" value2="someValue2" />
      );
      const wrapped = component.find(Wrapped);

      expect(fetchSpy).toHaveBeenCalledWith('someValue1', 'someValue2');
      expect(wrapped.props().isFetching).toEqual(true);
    });

    it('should not call fetchMethod with one of the fetch params undefined', () => {
      const requiredPropSpy = jest.fn();
      const fetchSpy = jest.fn();
      const Component = buildComponent(props => [
        getDefaultParams(props.foo, props.getFoo, [props.value1, props.value2])
      ]);

      const component = shallow(<Component getFoo={fetchSpy} value1="someValue1" />);
      const wrapped = component.find(Wrapped);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(wrapped.props().isFetching).toEqual(true);
    });
  });

  describe('WHEN required prop becomes defined', () => {
    it('should set isFetching to false', async () => {
      const fetchSpy = jest.fn();
      const Component = buildComponent(props => [
        getDefaultParams(props.foo, props.getFoo, [props.baz])
      ]);
      const component = shallow(<Component getFoo={fetchSpy} baz="someValue" />);

      let wrapped = component.find(Wrapped);
      expect(wrapped.props().isFetching).toEqual(true);

      component.setProps({ foo: 'bar' });

      wrapped = component.find(Wrapped);
      expect(wrapped.props().isFetching).toEqual(false);
      expect(wrapped.props().foo).toEqual('bar');
    });
  });

  describe('WHEN fetchParams change', () => {
    it('should re-fetch data', async () => {
      const fetchSpy = jest.fn();
      const Component = buildComponent(props => [
        getDefaultParams(props.foo, props.getFoo, [props.baz])
      ]);
      const component = mount(<Component getFoo={fetchSpy} baz="someValue1" />);

      let wrapped = component.find(Wrapped);
      expect(wrapped.props().isFetching).toEqual(true);
      expect(fetchSpy).toHaveBeenNthCalledWith(1, 'someValue1');

      component.setProps({ baz: 'someValue2' });
      component.update();

      wrapped = component.find(Wrapped);
      // expect(wrapped.props().isFetching).toEqual(true);
      expect(fetchSpy).toHaveBeenNthCalledWith(2, 'someValue2');
    });
  });
});
