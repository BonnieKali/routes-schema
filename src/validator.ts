import { ISegmentNode } from './parser';
import { RESERVED_ROUTES_VALIDATORS } from './exception/reserved-route-segment.exception';
import { INVALID_URL_VALIDATORS } from './exception/invalid-url-segment.exception';
import { Optional, RouteSchemaException, RouteSchemaValidator } from './exception/route-schema.exception';
import { PATH_VARIABLE_COLLISION_VALIDATORS } from './exception/path-variable-collision.exception';
import { INVALID_METHOD_NAME_GENERATION_VALIDATORS } from './exception/invalid-method-name.exception';

export function validate(root: ISegmentNode): void {
  let exceptions: Optional<RouteSchemaException>[] = [];
  const validators: RouteSchemaValidator[] = [
    ...RESERVED_ROUTES_VALIDATORS,
    ...INVALID_URL_VALIDATORS,
    ...PATH_VARIABLE_COLLISION_VALIDATORS,
    ...INVALID_METHOD_NAME_GENERATION_VALIDATORS,
  ];
  function validateNode(node: ISegmentNode) {
    exceptions = exceptions.concat(validators.map((validator) => validator(node, '')));
    node.children.forEach((child) => validateNode(child));
  }

  validateNode(root);

  exceptions
    .filter((e) => !e)
    // @ts-ignore
    .forEach((e: RouteSchemaException) => {
      console.error(e.toString);
    });
}
