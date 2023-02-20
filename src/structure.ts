import { ISegmentNode } from './parser';
import { StringUtils } from './string-utils';

export const ROOT_CLASS_NAME = 'Routes';

export interface IStructureNode {
  readonly segmentName: string;
  readonly className: string;
  readonly methodName: string;
  readonly absoluteType: string;
  readonly isEndState: boolean;
  readonly isPathVariable: boolean;
  readonly children: IStructureNode[];
  readonly queryParams?: string[];
}

export function mapToStructureTree(node: ISegmentNode, previousAbsoluteType: string = ''): IStructureNode {
  const className = formatClassName(node.name);
  const absoluteType = formatAbsoluteType(previousAbsoluteType, className);

  return {
    segmentName: node.name,
    className: className,
    methodName: formatMethodName(node.name),
    absoluteType: absoluteType,
    isEndState: node.isEndState(),
    isPathVariable: node.isPathVariable(),
    children: node.children.map((child) => mapToStructureTree(child, absoluteType)),
    queryParams: node.queryParams,
  };
}

function formatClassName(name: string) {
  if (name === '') {
    return ROOT_CLASS_NAME;
  }
  return new StringUtils(name).hyphenatedToCamelCase().underscoreToCamelCase().capitalizeFirstLetter().toString();
}

function formatMethodName(name: string) {
  return new StringUtils(name).hyphenatedToCamelCase().underscoreToCamelCase().lowercaseFirstLetter().toString();
}

function formatAbsoluteType(previousAbsoluteType: string, className: string) {
  if (!previousAbsoluteType) {
    return className;
  }
  return `${previousAbsoluteType}.${className}`;
}
