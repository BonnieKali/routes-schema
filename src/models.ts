export abstract class RouteSegment {
  protected path: string;

  constructor(private previousSegment?: RouteSegment) {
    this.path = ((this as any).constructor.name as string).toLowerCase();
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

  static from(routeSegment: RouteSegment, pathName?: string) {
    const instance = Object.create(this.prototype);
    const newInstance = new instance.constructor(routeSegment);
    newInstance.path = pathName ?? newInstance.path;
    return newInstance;
  }
}
