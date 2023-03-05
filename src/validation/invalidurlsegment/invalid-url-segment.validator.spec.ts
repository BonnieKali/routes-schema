import { ISegmentNode } from '../../parser';
import { INVALID_URL_VALIDATORS } from './invalid-url-segment.validator';

describe('testing invalid url segment validator', () => {
  const invalidUrlSegmentPaths = ['page(*', '$Oji39$', 'so?exe'];
  const validUrlSegmentPaths = ['url', '12345', 'resource:customMethod', 'page#123', '_me'];

  invalidUrlSegmentPaths.forEach((segmentPath) => {
    test(`should create an exception for route segment ${segmentPath}`, () => {
      const node = {
        name: segmentPath,
      } as ISegmentNode;
      const exceptions = INVALID_URL_VALIDATORS.map((validator) => validator(node, '')).filter((e) => !!e);

      expect(exceptions).toHaveLength(1);
    });
  });

  validUrlSegmentPaths.forEach((segmentPath) => {
    test(`should not create an exception for segment path ${segmentPath}`, () => {
      const node = {
        name: segmentPath,
      } as ISegmentNode;
      const exceptions = INVALID_URL_VALIDATORS.map((validator) => validator(node, '')).filter((e) => !!e);

      expect(exceptions).toHaveLength(0);
    });
  });
});
