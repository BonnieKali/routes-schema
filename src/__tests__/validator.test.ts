import { IUserDefinedRoute } from '../schema';
import { DuplicateRouteError, InvalidRouteError, validateRoutes } from '../validator';

describe('route validator tests', () => {
  it('should not throw exception for single valid route', () => {
    const routes: IUserDefinedRoute[] = [{ route: '/home' }];
    expect(() => validateRoutes(routes)).not.toThrow();
  });

  it('should not throw exception for multiple routes', () => {
    const routes: IUserDefinedRoute[] = [{ route: '/home' }, { route: '/' }, { route: '/home/user' }];
    expect(() => validateRoutes(routes)).not.toThrow();
  });

  it('should not throw exception for routes with valid query params', () => {
    const routes: IUserDefinedRoute[] = [
      { route: '/home' },
      { route: '/home/user' },
      { route: '/home/{userId}/workout/{workoutId}', queryParameters: ['name', 'location'] },
      { route: '/', queryParameters: [] },
    ];
    expect(() => validateRoutes(routes)).not.toThrow();
  });

  it('should throw exception for duplicate routes', () => {
    const routes: IUserDefinedRoute[] = [{ route: '/home' }, { route: '/home' }];
    expect(() => validateRoutes(routes)).toThrow(new DuplicateRouteError(['/home']));
  });

  it('should throw an error when given invalid route', () => {
    const routes: IUserDefinedRoute[] = [
      { route: '/home/{userId}/workout/{workoutId}', queryParameters: ['name', 'location'] },
      { route: '/' },
      { route: '/home/userId', queryParameters: ['param1', 'param2'] },
      { route: 'invalid route' },
    ];
    expect(() => validateRoutes(routes)).toThrow(new InvalidRouteError([{ route: 'invalid route' }]));
  });
});
