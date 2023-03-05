import { RouteSchemaException } from '../route-schema.exception';
import { CollidingSegmentNodes } from './colliding-segment-node';

export class PathVariableCollisionException extends RouteSchemaException {
  static readonly EXCEPTION_MESSAGE = 'A path variable collision has been detected';
  static readonly RESOLUTION_MESSAGE = 'Change the path segment to avoid the collision with the path variable.';

  constructor(private readonly path: string, private readonly collidingSegmentNodes: CollidingSegmentNodes[]) {
    super();
  }

  public toString() {
    const message = this.collidingSegmentNodes
      .map((collidingNodes) => this.createExceptionMessage(collidingNodes))
      .join('\n');
    return `${message} 
    ${PathVariableCollisionException.RESOLUTION_MESSAGE}`;
  }

  private createExceptionMessage(collidingSegmentNodes: CollidingSegmentNodes): string {
    const pathVariablesString = collidingSegmentNodes.pathVariables.map((n) => `${this.path}[{${n.name}}]`).join('\n');
    const nonPathVariablesString = collidingSegmentNodes.nonPathVariables
      .map((n) => `${this.path}[${n.name}]`)
      .join('\n');

    return `${PathVariableCollisionException.EXCEPTION_MESSAGE}:
        Path Variables:
          ${pathVariablesString}
        Non Path Variables:
          ${nonPathVariablesString}`;
  }
}
