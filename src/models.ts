export abstract class RouteSegment {
  protected path: string;

  constructor(private previousSegment?: RouteSegment) {
    this.path = ((<any>this).constructor.name as string).toLowerCase();
  }

  public build(): string {
    let path = '';
    let currentRouteSegment: RouteSegment | undefined = this;
    while (currentRouteSegment) {
      path = '/' + currentRouteSegment.path + path;
      currentRouteSegment = currentRouteSegment.previousSegment;
    }
    return path;
  }

  static from(routeSegment: RouteSegment) {
    const instance = Object.create(this.prototype);
    return new instance.constructor(routeSegment);
  }

  buildMethod<T extends RouteSegment>(t: any): T {
    return t.from(this);
  }
}
