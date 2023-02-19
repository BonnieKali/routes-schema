import { IUserDefinedRoute } from './schema';

interface ISegmentNode {
  name: string;
  children: ISegmentNode[];
  queryParams?: string[];
  markEndState(): void;
  isEndState(): boolean;
  isPathVariable(): boolean;
}

class SegmentNode implements ISegmentNode {
  name: string;
  children: SegmentNode[];
  queryParams?: string[];
  private readonly isPathVariableFlag: boolean;
  private isEndStateFlag: boolean;

  constructor(segmentName: string, children?: SegmentNode[], queryParams?: string[]) {
    this.name = this.determineName(segmentName);
    this.isPathVariableFlag = this.determineIsPathVariable(segmentName);
    this.children = children ?? [];
    this.queryParams = queryParams;
    this.isEndStateFlag = false;
  }

  markEndState(): void {
    this.isEndStateFlag = true;
  }
  isEndState(): boolean {
    return this.isEndStateFlag;
  }

  isPathVariable(): boolean {
    return this.isPathVariableFlag;
  }

  private determineName(name: string): string {
    return name.replace(/[{}]/g, '');
  }

  private determineIsPathVariable(name: string): boolean {
    return /{.*}/.test(name);
  }

  prettyString(): string {
    const pathVariableIdentifier = this.isPathVariable() ? ':' : '';
    const endState = this.isEndState() ? '=|' : '';
    const queryParams = this.queryParams ? ` ?[${this.queryParams.join(',')}]` : '';
    return `${pathVariableIdentifier}${this.name}${endState}${queryParams}`;
  }
}

export function parseRoutes(routes: IUserDefinedRoute[]): SegmentNode {
  const root = new SegmentNode('');
  routes.forEach((route) => attachRoute(route, root));
  return root;
}

function attachRoute(route: IUserDefinedRoute, root: SegmentNode) {
  const routeSegments = route.route.split("/").filter((segment) => !!segment);

  let lastVisitedNode = root;
  for (const routeSegment of routeSegments) {
    const existingChildNode = lastVisitedNode.children.find((child) => child.name === routeSegment);

    if (existingChildNode) {
      lastVisitedNode = existingChildNode;
      continue;
    }

    const newSegmentNode = new SegmentNode(routeSegment);
    lastVisitedNode.children.push(newSegmentNode);
    lastVisitedNode = newSegmentNode;
  }

  lastVisitedNode.markEndState();
  if (!!route.queryParameters && route.queryParameters.length > 0) {
    lastVisitedNode.queryParams = [...route.queryParameters];
  }

  return root;
}

/**
 * Prints the tree in a human-readable format
 */
export function printTree(tree: SegmentNode, level: number = 0) {
  console.log(`${'- '.repeat(level)}${tree.prettyString()}`);

  for (const child of tree.children) {
    printTree(child, level + 1);
  }
}
