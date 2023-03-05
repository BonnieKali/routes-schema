import { ISegmentNode } from '../../parser';

export interface CollidingSegmentNodes {
  pathVariables: ISegmentNode[];
  nonPathVariables: ISegmentNode[];
}
