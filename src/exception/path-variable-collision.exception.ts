import { ISegmentNode } from '../parser';
import { Optional, RouteSchemaException } from './route-schema.exception';

export const PATH_VARIABLE_COLLISION_VALIDATORS = [pathVariableCollisionValidator];

class PathVariableCollisionException extends RouteSchemaException {
  static readonly EXCEPTION_MESSAGE = 'A path variable collision has been detected.';
  static readonly RESOLUTION_MESSAGE = 'Change the path segment to avoid the collision with the path variable.';

  constructor(private readonly path: string, private readonly collidingSegmentNodes: CollidingSegmentNodes[]) {
    super();
  }

  public toString() {
    const message = this.collidingSegmentNodes
      .map((collidingNodes) => this.createExceptionMessage(collidingNodes))
      .join('\n');
    return `${message} ${PathVariableCollisionException.RESOLUTION_MESSAGE}`;
  }

  private createExceptionMessage(collidingSegmentNodes: CollidingSegmentNodes): string {
    const pathVariablesString = collidingSegmentNodes.pathVariables.map((n) => `${this.path}/[{${n.name}}]`).join('\n');
    const nonPathVariablesString = collidingSegmentNodes.nonPathVariables
      .map((n) => `${this.path}/[${n.name}]`)
      .join('\n');

    return `${PathVariableCollisionException.EXCEPTION_MESSAGE}:\n 
        Path Variables:\n${pathVariablesString}
        Non Path Variables:\n${nonPathVariablesString}`;
  }
}

interface CollidingSegmentNodes {
  pathVariables: ISegmentNode[];
  nonPathVariables: ISegmentNode[];
}

function pathVariableCollisionValidator(node: ISegmentNode, path: string): Optional<PathVariableCollisionException> {
  const collidingNodes = getPathVariableCollisions(node);
  if (collidingNodes.length > 0) {
    return new PathVariableCollisionException(path, collidingNodes);
  }
}
function getPathVariableCollisions(node: ISegmentNode): CollidingSegmentNodes[] {
  const nodesWithSameName: Record<string, ISegmentNode[]> = {};
  node.children.forEach((n) => {
    const nodeName = n.name;
    if (nodeName in nodesWithSameName) {
      nodesWithSameName[nodeName].push(n);
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
