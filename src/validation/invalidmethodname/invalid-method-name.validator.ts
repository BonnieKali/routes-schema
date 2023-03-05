import { ISegmentNode } from '../../parser';
import { Optional } from '../route-schema.exception';
import { InvalidMethodNameGenerationException } from './invalid-method-name.exception';

export const INVALID_METHOD_NAME_GENERATION_VALIDATORS = [InvalidMethodNameGenerationValidator];

function InvalidMethodNameGenerationValidator(
  node: ISegmentNode,
  path: string,
): Optional<InvalidMethodNameGenerationException> {
  if (!InvalidMethodNameGenerationException.VALID_METHOD_NAME_REGEX.test(node.name)) {
    return new InvalidMethodNameGenerationException(path, node);
  }
}
