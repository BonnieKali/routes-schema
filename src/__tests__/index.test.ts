import {hello} from '../index';


describe('hello', () => {
  it('should print Hello world', () => {
    expect(hello()).toBe('Hello world');
  });
});