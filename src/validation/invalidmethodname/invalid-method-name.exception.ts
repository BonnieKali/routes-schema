import { ISegmentNode } from '../../parser';
import { Optional, RouteSchemaException } from '../route-schema.exception';

export class InvalidMethodNameGenerationException extends RouteSchemaException {
  public static readonly VALID_METHOD_NAME_REGEX = /^[$A-Z_][0-9A-Z_$\-]*$/i;
  static readonly RESOLUTION_MESSAGE = 'Change the path segment to comply with the generation of a valid name.';
  static readonly EXCEPTION_MESSAGE = `A path segment has characters which will not allow for the generation of a valid method name.`;

  constructor(private readonly path: string, private readonly node: ISegmentNode) {
    super();
  }

  public toString() {
    const invalidNode = `${this.path}[${this.node.name}]`;
    return `${InvalidMethodNameGenerationException.EXCEPTION_MESSAGE} 
        Invalid Path Segment: ${invalidNode}. 
    ${InvalidMethodNameGenerationException.RESOLUTION_MESSAGE}`;
  }
}
