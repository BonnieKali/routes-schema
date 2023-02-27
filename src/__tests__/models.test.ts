import { EndStateRouteSegment, QueryParamsRouteSegment, RouteSegment } from '../models';

describe('models', () => {
  it('should build the route correctly with query params without undefined values', () => {
    const root = RouteSegment.from();
    const child1 = RouteSegment.from(root);
    const child2 = QueryParamsRouteSegment.from(child1) as QueryParamsRouteSegment<'a' | 'c'>;
    child2.withParam('a', 'b').withParams({ c: 'd' });

    const formattedRoute = child2.build();
    expect(formattedRoute).toBe('/routesegment/queryparamsroutesegment?a=b&c=d');
  });

  it('should build the route correctly with query params and undefined values', () => {
    const root = RouteSegment.from();
    const child1 = RouteSegment.from(root);
    const child2 = QueryParamsRouteSegment.from(child1) as QueryParamsRouteSegment<'a' | 'c'>;
    child2.withParam('a', 'b').withParams({ c: undefined });

    const formattedRoute = child2.build();
    expect(formattedRoute).toBe('/routesegment/queryparamsroutesegment?a=b');
  });

  it('should build the route correctly without query params', () => {
    const root = RouteSegment.from();
    const child1 = RouteSegment.from(root);
    const child2 = QueryParamsRouteSegment.from(child1) as QueryParamsRouteSegment<'a' | 'c'>;

    const formattedRoute = child2.build();
    expect(formattedRoute).toBe('/routesegment/queryparamsroutesegment');
  });

  it('should output only a slash', () => {
    const root = EndStateRouteSegment.from();
    const formattedRoute = root.build();
    expect(formattedRoute).toBe('/');
  });

  it('should throw error if build is called on RouteSegment', () => {
    const root = RouteSegment.from();
    expect(() => root.build()).toThrowError();
  });
});
