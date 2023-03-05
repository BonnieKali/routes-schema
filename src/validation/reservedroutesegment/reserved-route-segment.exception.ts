import { ISegmentNode } from '../../parser';
import { Optional, RouteSchemaException } from '../route-schema.exception';

export class ReservedRouteSegmentException extends RouteSchemaException {
  static readonly RESOLUTION_MESSAGE =
    'Change the path segment to not be a derivation of a reserved routes-schema keyword';
  private static readonly EXCEPTION_MESSAGE = `A path segment is using a derivation of a reserved routes-schema keyword.`;

  constructor(private readonly regex: RegExp, private readonly path: string, private readonly node: ISegmentNode) {
    super();
  }

  public toString() {
    const invalidNode = `${this.path}[${this.node.name}]`;
    return `${ReservedRouteSegmentException.EXCEPTION_MESSAGE} 
        Invalid Path Segment: ${invalidNode} 
    ${ReservedRouteSegmentException.RESOLUTION_MESSAGE} which matches this regex ${this.regex}`;
  }
}
