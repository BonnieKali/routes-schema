export abstract class RouteSegment {
  protected path: string;

  constructor(private previousSegment?: RouteSegment) {
    this.path = ((this as any).constructor.name as string).toLowerCase();
  }

  public getName(): string {
    return this.path;
  }

  static from(routeSegment: RouteSegment, pathName?: string) {
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
    while (currentRouteSegment) {
      path = '/' + currentRouteSegment.path + path;
      currentRouteSegment = currentRouteSegment.previousSegment;
    }
    return path;
  }
}

export abstract class QueryParamsRouteSegment extends EndStateRouteSegment {
  private queryParams: { [key: string]: string } = {};

  public withParams(queryParams: { [key: string]: string }): this {
    this.queryParams = { ...this.queryParams, ...queryParams };
    return this;
  }

  public withParam(key: string, value: string): this {
    this.queryParams[key] = value;
    return this;
  }

  public build(): string {
    const buildRoute = super.build();
    if (Object.keys(this.queryParams).length === 0) {
      return buildRoute;
    }
    return buildRoute + '?' + new URLSearchParams(this.queryParams).toString();
  }
}
