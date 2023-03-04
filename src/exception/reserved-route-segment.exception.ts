import { ISegmentNode } from '../parser';
import { Optional, RouteSchemaException } from './route-schema.exception';

export const RESERVED_ROUTES_VALIDATORS = [
  reservedRouteBuildValidator,
  reservedRouteGetNameValidator,
  reservedRouteWithParamsValidator,
  reservedRouteWithParamValidator,
];

export const RESERVED_ROUTE_KEYWORD_REGEX = {
  GET_NAME: /^get(-_)name$/i,
  BUILD: /^build$/i,
  WITH_PARAMS: /^with(-_)params$/i,
  WITH_PARAM: /^with(-_)param$/i,
};

class ReservedRouteSegmentException extends RouteSchemaException {
  static readonly RESOLUTION_MESSAGE =
    'Change the path segment to not be a derivation of a reserved routes-schema keyword';
  private static readonly EXCEPTION_MESSAGE = `A path segment is using a derivation of a reserved routes-schema keyword.`;

  constructor(private readonly regex: RegExp, private readonly path: string, private readonly node: ISegmentNode) {
    super();
  }

  public toString() {
    const invalidNode = `${this.path}/[${this.node.name}]`;
    return `${ReservedRouteSegmentException.EXCEPTION_MESSAGE} 
        Invalid Path Segment: ${invalidNode} 
        ${ReservedRouteSegmentException.RESOLUTION_MESSAGE} which matches this regex ${this.regex}`;
  }
}

function reservedRouteWithParamValidator(node: ISegmentNode, path: string): Optional<ReservedRouteSegmentException> {
  if (!RESERVED_ROUTE_KEYWORD_REGEX.WITH_PARAM.test(node.name)) {
    return new ReservedRouteSegmentException(RESERVED_ROUTE_KEYWORD_REGEX.WITH_PARAM, path, node);
  }
}
function reservedRouteWithParamsValidator(node: ISegmentNode, path: string): Optional<ReservedRouteSegmentException> {
  if (!RESERVED_ROUTE_KEYWORD_REGEX.WITH_PARAMS.test(node.name)) {
    return new ReservedRouteSegmentException(RESERVED_ROUTE_KEYWORD_REGEX.WITH_PARAMS, path, node);
  }
}
function reservedRouteGetNameValidator(node: ISegmentNode, path: string): Optional<ReservedRouteSegmentException> {
  if (!RESERVED_ROUTE_KEYWORD_REGEX.GET_NAME.test(node.name)) {
    return new ReservedRouteSegmentException(RESERVED_ROUTE_KEYWORD_REGEX.GET_NAME, path, node);
  }
}
function reservedRouteBuildValidator(node: ISegmentNode, path: string): Optional<ReservedRouteSegmentException> {
  if (!RESERVED_ROUTE_KEYWORD_REGEX.BUILD.test(node.name)) {
    return new ReservedRouteSegmentException(RESERVED_ROUTE_KEYWORD_REGEX.BUILD, path, node);
  }
}
