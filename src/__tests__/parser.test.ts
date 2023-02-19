import { parseRoutes } from '../parser';

describe('route parser tests', () => {
  it('should parse route', () => {
    const routes = [{ route: '/home/{name}/workouts' }];
    const root = parseRoutes(routes);

    expect(root).toBeDefined();
    expect(root.children.length).toBe(1);
    expect(root.children[0].name).toBe('home');
    expect(root.children[0].isPathVariable()).toBeFalsy();
    expect(root.children[0].isEndState()).toBeFalsy();
    expect(root.children[0].children.length).toBe(1);
    expect(root.children[0].children[0].name).toBe('name');
    expect(root.children[0].children[0].isPathVariable()).toBeTruthy();
    expect(root.children[0].children[0].isEndState()).toBeFalsy();
    expect(root.children[0].children[0].children.length).toBe(1);
    expect(root.children[0].children[0].children[0].name).toBe('workouts');
    expect(root.children[0].children[0].children[0].isPathVariable()).toBeFalsy();
    expect(root.children[0].children[0].children[0].isEndState()).toBeTruthy();
  });

  it('should not duplicate routes', () => {
    const routes = [{ route: '/home/name' }, { route: '/home/name' }];
    const root = parseRoutes(routes);

    expect(root).toBeDefined();
    expect(root.children.length).toBe(1);
    expect(root.children[0].children.length).toBe(1);
  });

  it('should parse multiple routes', () => {
    const routes = [{ route: '/home/name' }, { route: '/home/name2' }];
    const root = parseRoutes(routes);

    expect(root).toBeDefined();
    expect(root.children.length).toBe(1);
    expect(root.children[0].children.length).toBe(2);
    expect(root.children[0].children[0].name).toBe('name');
    expect(root.children[0].children[1].name).toBe('name2');
  });

  it('should parse queryParams correctly', () => {
    const routes = [{ route: '/home', queryParameters: ['id', 'name'] }];
    const root = parseRoutes(routes);

    expect(root).toBeDefined();
    expect(root.children.length).toBe(1);
    expect(root.children[0].queryParams).toEqual(['id', 'name']);
  });
});
