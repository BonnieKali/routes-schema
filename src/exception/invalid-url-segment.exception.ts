import { ISegmentNode } from '../parser';
import { Optional, RouteSchemaException } from './route-schema.exception';

export const INVALID_URL_VALIDATORS = [InvalidUrlSegmentValidator];

class InvalidUrlSegmentException extends RouteSchemaException {
  // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  public static readonly VALID_URL_REGEX = /^([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
  static readonly RESOLUTION_MESSAGE = 'Change the path segment to comply with the url standard.';
  private static readonly EXCEPTION_MESSAGE = `A path segment is not a valid url segment.`;

  constructor(private readonly path: string, private readonly node: ISegmentNode) {
    super();
  }

  public toString() {
    const invalidNode = `${this.path}[${this.node.name}]`;
    return `${InvalidUrlSegmentException.EXCEPTION_MESSAGE} 
        Invalid Path Segment: ${invalidNode}. 
    ${InvalidUrlSegmentException.RESOLUTION_MESSAGE}`;
  }
}

function InvalidUrlSegmentValidator(node: ISegmentNode, path: string): Optional<InvalidUrlSegmentException> {
  if (!InvalidUrlSegmentException.VALID_URL_REGEX.test(node.name)) {
    return new InvalidUrlSegmentException(path, node);
  }
}
