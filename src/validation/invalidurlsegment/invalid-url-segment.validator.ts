import { ISegmentNode } from '../../parser';
import { Optional } from '../route-schema.exception';
import { InvalidUrlSegmentException } from './invalid-url-segment.exception';

export const INVALID_URL_VALIDATORS = [InvalidUrlSegmentValidator];

function InvalidUrlSegmentValidator(node: ISegmentNode, path: string): Optional<InvalidUrlSegmentException> {
  if (!InvalidUrlSegmentException.VALID_URL_SEGMENT_REGEX.test(node.name)) {
    return new InvalidUrlSegmentException(path, node);
  }
}
