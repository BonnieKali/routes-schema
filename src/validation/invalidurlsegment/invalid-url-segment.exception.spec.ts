import { ISegmentNode } from '../../parser';
import { InvalidMethodNameGenerationException } from '../invalidmethodname/invalid-method-name.exception';

describe('testing exception toString', () => {
  test('should pretty print for an exception with no path', () => {
    const name = '<>methodName';
    const node = {
      name,
    } as ISegmentNode;
    const path = '';

    const exception = new InvalidMethodNameGenerationException(path, node);

    const message = exception.toString();
    expect(message).toContain(InvalidMethodNameGenerationException.EXCEPTION_MESSAGE);
    expect(message).toContain(`Invalid Path Segment: [${name}].`);
    expect(message).toContain(InvalidMethodNameGenerationException.RESOLUTION_MESSAGE);
  });

  const path = 'p/a/t/h/';
  test(`should pretty print for an exception with path ${path}`, () => {
    const name = '<>methodName';
    const node = {
      name,
    } as ISegmentNode;

    const exception = new InvalidMethodNameGenerationException(path, node);

    const message = exception.toString();
    expect(message).toContain(InvalidMethodNameGenerationException.EXCEPTION_MESSAGE);
    expect(message).toContain(`Invalid Path Segment: p/a/t/h/[${name}].`);
    expect(message).toContain(InvalidMethodNameGenerationException.RESOLUTION_MESSAGE);
  });
});
