export abstract class RouteSegment {
  protected path: string;

  protected constructor(private previousSegment?: RouteSegment) {
    this.path = ((this as any).constructor.name as string).toLowerCase();
  }

  public getName(): string {
    return this.path;
  }

  static from(routeSegment?: RouteSegment, pathName?: string) {
    const instance = Object.create(this.prototype);
    const newInstance = new instance.constructor(routeSegment);
    newInstance.path = pathName ?? newInstance.path;
    return newInstance;
  }
}

export abstract class EndStateRouteSegment extends RouteSegment {
  public build(): string {
    let path = '';
    let currentRouteSegment: RouteSegment | undefined | any = this;
    while (currentRouteSegment.previousSegment) {
      path = '/' + currentRouteSegment.path + path;
      currentRouteSegment = currentRouteSegment.previousSegment;
    }
    if (path === '') {
      return '/';
    }
    return path;
  }
}

export abstract class QueryParamsRouteSegment<T extends string> extends EndStateRouteSegment {
  private queryParams: { [key in T]+?: string } = {};

  public withParams(queryParams: { [key in T]+?: string }): this {
    this.queryParams = { ...this.queryParams, ...queryParams };
    return this;
  }

  public withParam(key: T, value: string): this {
    this.queryParams[key] = value;
    return this;
  }

  public build(): string {
    const buildRoute = super.build();
    if (Object.keys(this.queryParams).length === 0) {
      return buildRoute;
    }

    // @ts-ignore
    return buildRoute + '?' + new URLSearchParams(this.queryParams).toString();
  }
}
