import {
  ICustomClass,
  ICustomMethod,
  ICustomNamespace,
  ICustomSegmentStructure,
  ICustomSuperClass,
} from './generator.compiler';
import { IStructureNode } from './structure';
import { EndStateRouteSegment, QueryParamsRouteSegment, RouteSegment } from './models';

export function composeSchema(root: IStructureNode): ICustomSegmentStructure {
  return mapToCustomSegmentStructure(root);
}

function mapToCustomSegmentStructure(node: IStructureNode): ICustomSegmentStructure {
  return {
    class: mapToCustomClass(node),
    namespace: mapToCustomNamespace(node),
  };
}

function mapToCustomNamespace(node: IStructureNode): ICustomNamespace {
  return {
    name: node.className,
    customSegmentStructures: node.children.map(mapToCustomSegmentStructure),
  };
}

function mapToCustomClass(node: IStructureNode): ICustomClass {
  return {
    superClass: determineSuperClass(node),
    name: node.className,
    methods: collectMethods(node),
  };
}

function collectMethods(node: IStructureNode): ICustomMethod[] {
  return node.children.map((child) => {
    return {
      name: child.methodName,
      returnType: child.absoluteType,
      args: child.isPathVariable ? ['arg'] : [],
    };
  });
}

function determineSuperClass(node: IStructureNode): ICustomSuperClass {
  if (node.isEndState && !!node.queryParams) {
    return { name: QueryParamsRouteSegment.name, types: node.queryParams };
  }
  if (node.isEndState) {
    return { name: EndStateRouteSegment.name };
  }
  return { name: RouteSegment.name };
}
