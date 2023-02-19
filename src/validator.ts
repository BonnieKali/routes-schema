import { IUserDefinedRoute } from './schema';

const routeRegExp = /^\/[a-zA-Z](([a-zA-Z0-9-]+|\{[a-zA-Z0-9-]+\})\/)+([a-zA-Z0-9-]+|\{[a-zA-Z0-9-]+\})+/;

export class InvalidRouteError extends Error {
  constructor(routes: IUserDefinedRoute[]) {
    super(`Invalid routes found: ${routes}`);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class DuplicateRouteError extends Error {
  constructor(routes: string[]) {
    super(`Duplicate routes found: ${routes}`);
  }
}

export function validateRoutes(routes: IUserDefinedRoute[]): void {
  const uniqueRoutes: { [key: string]: boolean } = {};
  const duplicateRoutes: string[] = [];
  const invalidRoutes: IUserDefinedRoute[] = [];

  routes.forEach((route) => {
    if (!uniqueRoutes[route.route]) {
      uniqueRoutes[route.route] = true;
    } else if (!routeRegExp.test(route.route)) {
      invalidRoutes.push(route);
    } else {
      duplicateRoutes.push(route.route);
    }
  });

  if (invalidRoutes.length > 0) {
    throw new InvalidRouteError(invalidRoutes);
  } else if (duplicateRoutes.length > 0) {
    throw new DuplicateRouteError(duplicateRoutes);
  }
}
