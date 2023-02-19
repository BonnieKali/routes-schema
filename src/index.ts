import { parseRoutes, printTree } from './parser';
import { generate } from './generator.compiler';
import { mapToStructureTree } from './structure';
import { composeSchema } from './structure-composer';

const routes = [
  { route: '/home/{userId}/workout/{workoutId}', queryParameters: ['name', 'location'] },
  { route: '/', queryParameters: [] },
  { route: '/home/userId' },
  { route: '/auth/login/check' },
  { route: '/auth/{userId}/login' },
  { route: '/auth/register' },
  { route: '/profile', queryParameters: ['id'] },
  { route: '/profile/dashboard' },
  { route: '/profile/dashboard/today' },
  { route: '/profile/dashboard/today' },
];

const segmentTree = parseRoutes(routes);
printTree(segmentTree);

const structureTree = mapToStructureTree(segmentTree);
const schema = composeSchema(structureTree);
generate(schema, 'src/generated/generated.ts');

run(customSegmentStructure, 'src/generated/generated.ts');
