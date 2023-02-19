import { IStructureNode, ROOT_CLASS_NAME } from '../structure';
import { composeSchema } from '../structure-composer';

describe('structure-composer', () => {
  it('should compose schema', () => {
    const root: IStructureNode = {
      segmentName: '',
      className: ROOT_CLASS_NAME,
      methodName: '',
      absoluteType: '',
      isEndState: false,
      isPathVariable: false,
      children: [
        {
          segmentName: 'child1',
          className: 'Child1',
          methodName: 'child1',
          absoluteType: 'Child1',
          isEndState: false,
          isPathVariable: false,
          children: [
            {
              segmentName: 'child3',
              className: 'Child3',
              methodName: 'child3',
              absoluteType: 'Child1.Child3',
              isEndState: true,
              isPathVariable: true,
              children: [],
            },
          ],
        },
        {
          segmentName: 'second-child',
          className: 'SecondChild',
          methodName: 'secondChild',
          absoluteType: 'SecondChild',
          isEndState: true,
          isPathVariable: false,
          children: [],
        },
      ],
    };

    const segmentStructure = composeSchema(root);

    const rootClass = segmentStructure.class;
    const rootNamespace = segmentStructure.namespace;
    expect(rootClass.name).toBe(ROOT_CLASS_NAME);
    expect(rootClass.superClass).toBe('RouteSegment');
    expect(rootClass.methods.length).toBe(2);
    expect(rootClass.methods[0].name).toBe('child1');
    expect(rootClass.methods[0].returnType).toBe('Child1');
    expect(rootClass.methods[0].args.length).toBe(0);
    expect(rootClass.methods[1].name).toBe('secondChild');
    expect(rootClass.methods[1].returnType).toBe('SecondChild');
    expect(rootClass.methods[1].args.length).toBe(0);
    expect(rootNamespace.name).toBe(ROOT_CLASS_NAME);
    expect(rootNamespace.customSegmentStructures.length).toBe(2);

    const child1Class = rootNamespace.customSegmentStructures[0].class;
    const child1Namespace = rootNamespace.customSegmentStructures[0].namespace;
    expect(child1Class.name).toBe('Child1');
    expect(child1Class.superClass).toBe('RouteSegment');
    expect(child1Class.methods.length).toBe(1);
    expect(child1Class.methods[0].name).toBe('child3');
    expect(child1Class.methods[0].returnType).toBe('Child1.Child3');
    expect(child1Class.methods[0].args.length).toBe(1);
    expect(child1Namespace.name).toBe('Child1');
    expect(child1Namespace.customSegmentStructures.length).toBe(1);

    const child3Class = child1Namespace.customSegmentStructures[0].class;
    const child3Namespace = child1Namespace.customSegmentStructures[0].namespace;
    expect(child3Class.name).toBe('Child3');
    expect(child3Class.superClass).toBe('RouteSegment');
    expect(child3Class.methods.length).toBe(0);
    expect(child3Namespace.name).toBe('Child3');
    expect(child3Namespace.customSegmentStructures.length).toBe(0);

    const child2Class = rootNamespace.customSegmentStructures[1].class;
    const child2Namespace = rootNamespace.customSegmentStructures[1].namespace;
    expect(child2Class.name).toBe('SecondChild');
    expect(child2Class.superClass).toBe('RouteSegment');
    expect(child2Class.methods.length).toBe(0);
    expect(child2Namespace.name).toBe('SecondChild');
    expect(child2Namespace.customSegmentStructures.length).toBe(0);
  });
});
