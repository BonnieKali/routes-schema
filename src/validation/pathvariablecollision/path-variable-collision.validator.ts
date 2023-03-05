import { ISegmentNode } from '../../parser';
import { Optional } from '../route-schema.exception';
import { PathVariableCollisionException } from './path-variable-collision.exception';
import { CollidingSegmentNodes } from './colliding-segment-node';

export const PATH_VARIABLE_COLLISION_VALIDATORS = [pathVariableCollisionValidator];

function pathVariableCollisionValidator(node: ISegmentNode, path: string): Optional<PathVariableCollisionException> {
  const collidingNodes = getPathVariableCollisions(node);
  if (collidingNodes.length > 0) {
    return new PathVariableCollisionException(`${path}${node.name}/`, collidingNodes);
  }
}
function getPathVariableCollisions(node: ISegmentNode): CollidingSegmentNodes[] {
  const nodesWithSameName: Record<string, ISegmentNode[]> = {};
  node.children.forEach((n) => {
    const nodeName = n.name;
    if (nodeName in nodesWithSameName) {
      nodesWithSameName[nodeName].push(n);
    } else {
      nodesWithSameName[nodeName] = [n];
    }
  });

  const collidingNodeNames: CollidingSegmentNodes[] = [];
  Object.entries(nodesWithSameName).forEach(([_, values]) => {
    const pathVariables = values.filter((n) => n.isPathVariable());
    const nonPathVariables = values.filter((n) => !n.isPathVariable());
    if (pathVariables.length > 0 && nonPathVariables.length > 0) {
      collidingNodeNames.push({
        pathVariables,
        nonPathVariables,
      });
    }
  });

  return collidingNodeNames;
}
