import { ISegmentNode } from '../../parser';
import { INVALID_METHOD_NAME_GENERATION_VALIDATORS } from './invalid-method-name.validator';

describe('testing invalid method name validator', () => {
  const invalidSegmentPaths = ['methodName<', 'methodName>', '2MethodName', '?methodName'];
  const validSegmentPaths = ['$MethodName', 'method123Name', 'method_n4m3', 'method-n', 'metho_', '_me'];

  invalidSegmentPaths.forEach((segmentPath) => {
    test(`should create an exception for route segment ${segmentPath}`, () => {
      const node = {
        name: segmentPath,
      } as ISegmentNode;
      const exceptions = INVALID_METHOD_NAME_GENERATION_VALIDATORS.map((validator) => validator(node, '')).filter(
        (e) => !!e,
      );

      expect(exceptions).toHaveLength(1);
    });
  });

  validSegmentPaths.forEach((segmentPath) => {
    test(`should not create an exception for segment path ${segmentPath}`, () => {
      const node = {
        name: segmentPath,
      } as ISegmentNode;
      const exceptions = INVALID_METHOD_NAME_GENERATION_VALIDATORS.map((validator) => validator(node, '')).filter(
        (e) => !!e,
      );

      expect(exceptions).toHaveLength(0);
    });
  });
});
