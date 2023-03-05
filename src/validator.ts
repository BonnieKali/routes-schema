import { ISegmentNode } from './parser';
import { RouteSchemaException, RouteSchemaValidator } from './validation/route-schema.exception';
import { RESERVED_ROUTES_VALIDATORS } from './validation/reservedroutesegment/reserved-route-segment.validator';
import { INVALID_URL_VALIDATORS } from './validation/invalidurlsegment/invalid-url-segment.validator';
import { PATH_VARIABLE_COLLISION_VALIDATORS } from './validation/pathvariablecollision/path-variable-collision.validator';
import { INVALID_METHOD_NAME_GENERATION_VALIDATORS } from './validation/invalidmethodname/invalid-method-name.validator';

const EXCEPTION_SEPARATOR = '----------';

export function validate(root: ISegmentNode): void {
  const exceptions: RouteSchemaException[] = [];
  const validators: RouteSchemaValidator[] = [
    ...RESERVED_ROUTES_VALIDATORS,
    ...INVALID_URL_VALIDATORS,
    ...PATH_VARIABLE_COLLISION_VALIDATORS,
    ...INVALID_METHOD_NAME_GENERATION_VALIDATORS,
  ];
  const rootNodeValidators: RouteSchemaValidator[] = [...PATH_VARIABLE_COLLISION_VALIDATORS];
  function validateNode(node: ISegmentNode, path: string) {
    const newExceptions = getExceptionsForNode(node, validators, path);
    exceptions.push(...newExceptions);
    node.children.forEach((child) => validateNode(child, `${path}${node.name}/`));
  }

  function validateRootNode(root: ISegmentNode) {
    const newExceptions = getExceptionsForNode(root, rootNodeValidators, '/');
    exceptions.push(...newExceptions);
    root.children.forEach((child) => validateNode(child, root.name + '/'));
  }

  validateRootNode(root);

  exceptions.forEach((e: RouteSchemaException) => {
    // @ts-ignore
    console.error(`${EXCEPTION_SEPARATOR} \n${e.toString()}\n ${EXCEPTION_SEPARATOR}\n`);
  });
}

function getExceptionsForNode(node: ISegmentNode, validators: RouteSchemaValidator[], path: string) {
  return validators
    .map((validator) => validator(node, path)) // TODO: pass in path
    .filter((e) => !!e) as RouteSchemaException[];
}
