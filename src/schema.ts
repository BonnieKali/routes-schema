export interface IUserDefinedRoute {
  route: string;
  queryParameters?: string[];
}

export const exampleRoutes: IUserDefinedRoute[] = [
  { route: '/home/{userId}/workout/{workoutId}', queryParameters: ['name', 'location'] },
  { route: '/', queryParameters: [] },
  { route: '/home/userId' },
  { route: '/auth/login/check' },
  { route: '/auth/{userId}/login' },
  { route: '/auth/register' },
  { route: '/profile', queryParameters: ['id'] },
  { route: '/profile/dashboard' },
  { route: '/profile/dashboard/today' },
];

/*
  Rules for route string:
    the routes are split by '/'
    a route that is an inpute is enclosed within '{''}'
    a route is an end state if it is the last segment
 */
