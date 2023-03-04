import { ISegmentNode } from '../parser';
import { Optional, RouteSchemaException } from './route-schema.exception';

export const INVALID_METHOD_NAME_GENERATION_VALIDATORS = [InvalidMethodNameGenerationValidator];

class InvalidMethodNameGenerationException extends RouteSchemaException {
  // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  public static readonly VALID_METHOD_NAME_REGEX = /^[$A-Z_][0-9A-Z_$]*$/i;
  static readonly RESOLUTION_MESSAGE = 'Change the path segment to comply with the generation of a valid name.';
  private static readonly EXCEPTION_MESSAGE = `A path segment has characters which will not allow for the generation of a valid method name.`;

  constructor(private readonly path: string, private readonly node: ISegmentNode) {
    super();
  }

  public toString() {
    const invalidNode = `${this.path}/[${this.node.name}]`;
    return `${InvalidMethodNameGenerationException.EXCEPTION_MESSAGE} 
        Invalid Path Segment: ${invalidNode}. 
        ${InvalidMethodNameGenerationException.RESOLUTION_MESSAGE}`;
  }
}

function InvalidMethodNameGenerationValidator(
  node: ISegmentNode,
  path: string,
): Optional<InvalidMethodNameGenerationException> {
  if (!InvalidMethodNameGenerationException.VALID_METHOD_NAME_REGEX.test(node.name)) {
    return new InvalidMethodNameGenerationException(path, node);
  }
}
