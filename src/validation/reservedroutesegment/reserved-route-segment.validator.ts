import { ISegmentNode } from '../../parser';
import { Optional } from '../route-schema.exception';
import { ReservedRouteSegmentException } from './reserved-route-segment.exception';
import { RESERVED_ROUTE_KEYWORD_REGEX } from './reserved-route';

export const RESERVED_ROUTES_VALIDATORS = [
  reservedRouteBuildValidator,
  reservedRouteGetNameValidator,
  reservedRouteWithParamsValidator,
  reservedRouteWithParamValidator,
];

function reservedRouteWithParamValidator(node: ISegmentNode, path: string): Optional<ReservedRouteSegmentException> {
  if (RESERVED_ROUTE_KEYWORD_REGEX.WITH_PARAM.test(node.name)) {
    return new ReservedRouteSegmentException(RESERVED_ROUTE_KEYWORD_REGEX.WITH_PARAM, path, node);
  }
}
function reservedRouteWithParamsValidator(node: ISegmentNode, path: string): Optional<ReservedRouteSegmentException> {
  if (RESERVED_ROUTE_KEYWORD_REGEX.WITH_PARAMS.test(node.name)) {
    return new ReservedRouteSegmentException(RESERVED_ROUTE_KEYWORD_REGEX.WITH_PARAMS, path, node);
  }
}
function reservedRouteGetNameValidator(node: ISegmentNode, path: string): Optional<ReservedRouteSegmentException> {
  if (RESERVED_ROUTE_KEYWORD_REGEX.GET_NAME.test(node.name)) {
    return new ReservedRouteSegmentException(RESERVED_ROUTE_KEYWORD_REGEX.GET_NAME, path, node);
  }
}
function reservedRouteBuildValidator(node: ISegmentNode, path: string): Optional<ReservedRouteSegmentException> {
  if (RESERVED_ROUTE_KEYWORD_REGEX.BUILD.test(node.name)) {
    return new ReservedRouteSegmentException(RESERVED_ROUTE_KEYWORD_REGEX.BUILD, path, node);
  }
}
