import { parseRoutes, printTree } from './parser';
import { run } from './generator.compiler';
import { mapToStructureNode } from './structure';
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

const structureTree = mapToStructureNode(segmentTree);
const customSegmentStructure = composeSchema(structureTree);

run(customSegmentStructure, 'src/generated/generated.ts');
