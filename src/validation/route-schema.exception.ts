import { ISegmentNode } from '../parser';

interface IToString {
  toString(): string;
}
export abstract class RouteSchemaException extends Error implements IToString {}

export type Optional<T> = T | undefined | null;
export type RouteSchemaValidator = (node: ISegmentNode, path: string) => Optional<RouteSchemaException>;
