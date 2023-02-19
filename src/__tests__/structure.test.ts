import { SegmentNode } from '../parser';
import { mapToStructureNode, ROOT_CLASS_NAME } from '../structure';

describe('structure', () => {
  it('should construct StructureNode tree', () => {
    // Given
    const root = new SegmentNode('');
    const child1 = new SegmentNode('child1');
    const child2 = new SegmentNode('second-child');
    const child3 = new SegmentNode('third_child');
    const child4 = new SegmentNode('child4');
    const child5 = new SegmentNode('child5');
    const child6 = new SegmentNode('{child6}');

    root.children.push(child1);
    root.children.push(child2);
    root.children.push(child3);
    child1.children.push(child4);
    child1.children.push(child5);
    child2.children.push(child6);

    child3.markEndState();
    child4.markEndState();
    child5.markEndState();
    child6.markEndState();

    // When
    const structureTree = mapToStructureNode(root);

    // Then
    expect(structureTree.segmentName).toBe('');
    expect(structureTree.className).toBe(ROOT_CLASS_NAME);
    expect(structureTree.methodName).toBe('');
    expect(structureTree.absoluteType).toBe(ROOT_CLASS_NAME);
    expect(structureTree.isEndState).toBe(false);
    expect(structureTree.isPathVariable).toBe(false);
    expect(structureTree.children.length).toBe(3);

    expect(structureTree.children[0].segmentName).toBe('child1');
    expect(structureTree.children[0].className).toBe('Child1');
    expect(structureTree.children[0].methodName).toBe('child1');
    expect(structureTree.children[0].absoluteType).toBe(`${ROOT_CLASS_NAME}.Child1`);
    expect(structureTree.children[0].isEndState).toBe(false);
    expect(structureTree.children[0].isPathVariable).toBe(false);
    expect(structureTree.children[0].children.length).toBe(2);

    expect(structureTree.children[1].segmentName).toBe('second-child');
    expect(structureTree.children[1].className).toBe('SecondChild');
    expect(structureTree.children[1].methodName).toBe('secondChild');
    expect(structureTree.children[1].absoluteType).toBe(`${ROOT_CLASS_NAME}.SecondChild`);
    expect(structureTree.children[1].isEndState).toBe(false);
    expect(structureTree.children[1].isPathVariable).toBe(false);
    expect(structureTree.children[1].children.length).toBe(1);

    expect(structureTree.children[2].segmentName).toBe('third_child');
    expect(structureTree.children[2].className).toBe('ThirdChild');
    expect(structureTree.children[2].methodName).toBe('thirdChild');
    expect(structureTree.children[2].absoluteType).toBe(`${ROOT_CLASS_NAME}.ThirdChild`);
    expect(structureTree.children[2].isEndState).toBe(true);
    expect(structureTree.children[2].isPathVariable).toBe(false);

    expect(structureTree.children[0].children[0].segmentName).toBe('child4');
    expect(structureTree.children[0].children[0].className).toBe('Child4');
    expect(structureTree.children[0].children[0].methodName).toBe('child4');
    expect(structureTree.children[0].children[0].absoluteType).toBe(`${ROOT_CLASS_NAME}.Child1.Child4`);
    expect(structureTree.children[0].children[0].isEndState).toBe(true);
    expect(structureTree.children[0].children[0].isPathVariable).toBe(false);

    expect(structureTree.children[0].children[1].segmentName).toBe('child5');
    expect(structureTree.children[0].children[1].className).toBe('Child5');
    expect(structureTree.children[0].children[1].methodName).toBe('child5');
    expect(structureTree.children[0].children[1].absoluteType).toBe(`${ROOT_CLASS_NAME}.Child1.Child5`);
    expect(structureTree.children[0].children[1].isEndState).toBe(true);
    expect(structureTree.children[0].children[1].isPathVariable).toBe(false);

    expect(structureTree.children[1].children[0].segmentName).toBe('child6');
    expect(structureTree.children[1].children[0].className).toBe('Child6');
    expect(structureTree.children[1].children[0].methodName).toBe('child6');
    expect(structureTree.children[1].children[0].absoluteType).toBe(`${ROOT_CLASS_NAME}.SecondChild.Child6`);
    expect(structureTree.children[1].children[0].isEndState).toBe(true);
    expect(structureTree.children[1].children[0].isPathVariable).toBe(true);
  });
});
