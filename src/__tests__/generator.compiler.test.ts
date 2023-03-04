import {
  addImportsIntoSourceFile,
  createClass,
  createExportedVariable,
  createMethod,
  createNamespace,
  createRoutes,
  ICustomClass,
  ICustomMethod,
  ICustomNamespace,
  ICustomSegmentStructure,
  ICustomSuperClass,
} from '../generator.compiler';
import {
  ClassDeclaration,
  MethodDeclaration,
  ModuleDeclaration,
  ModuleDeclarationKind,
  Project,
  SourceFile,
} from 'ts-morph';
import * as models from '../models';

const project = new Project();
const sourceFile = project.createSourceFile(`/Users/james/IdeaProjects/routes-schema/src/file.ts`);
describe('creating valid functions', () => {
  let classDeclaration: ClassDeclaration;

  beforeEach(() => {
    classDeclaration = sourceFile.addClass({
      name: 'SomeClass',
    });
  });

  it('should create a valid function with no arguments', () => {
    const methodDefinition: ICustomMethod = {
      name: 'customMethod',
      returnType: 'CustomClass1.SomeClass.MethodClass',
      args: [],
    };
    const methodDeclaration = createMethod(classDeclaration, methodDefinition);

    assertMethod(methodDefinition, methodDeclaration);
    expect(methodDeclaration.getBodyText()).toEqual(`return ${methodDefinition.returnType}.from(this);`);
  });

  it('should create a valid function with arguments', () => {
    const methodDefinition: ICustomMethod = {
      name: 'customMethod',
      returnType: 'string',
      args: ['argument1', 'argument2'],
    };

    const methodDeclaration = createMethod(classDeclaration, methodDefinition);

    assertMethod(methodDefinition, methodDeclaration);
    expect(methodDeclaration.getBodyText()).toEqual(
      `return ${methodDefinition.returnType}.from(this,argument1,argument2);`,
    );
  });
});

describe('creating valid classes', () => {
  const superClass: ICustomSuperClass = {
    name: 'ParentClass',
    types: ['type1', 'type2'],
  };

  it('should create a valid class with a superclass without types', () => {
    const classDefinition: ICustomClass = {
      name: 'CustomClass',
      superClass: { ...superClass, types: undefined },
      methods: [],
    };

    const classDeclaration: ClassDeclaration = createClass(sourceFile, classDefinition);

    expect(classDeclaration.getName()).toBe(classDefinition.name);
    expect(classDeclaration.print()).toContain(`extends ${classDefinition.superClass!.name} {`);
    expect(classDeclaration.getMethods()).toHaveLength(0);
  });

  it('should create a valid class with a superclass with types', () => {
    const classDefinition: ICustomClass = {
      name: 'CustomClass',
      superClass: superClass,
      methods: [],
    };

    const classDeclaration: ClassDeclaration = createClass(sourceFile, classDefinition);

    expect(classDeclaration.getName()).toBe(classDefinition.name);
    expect(classDeclaration.print()).toContain(
      `extends ${classDefinition.superClass!.name}<'${superClass.types![0]}' | '${superClass.types![1]}'> {`,
    );
    expect(classDeclaration.getMethods()).toHaveLength(0);
  });

  it('should create a valid class without superclass', () => {
    const classDefinition: ICustomClass = {
      name: 'CustomClass',
      methods: [],
    };

    const classDeclaration: ClassDeclaration = createClass(sourceFile, classDefinition);

    expect(classDeclaration.getName()).toBe(classDefinition.name);
    expect(classDeclaration.print()).not.toContain(`extends`);
    expect(classDeclaration.getMethods()).toHaveLength(0);
  });
});

describe('create namespaces', () => {
  it('should create a valid namespace with no segment structure', () => {
    const customNamespace: ICustomNamespace = {
      name: 'CustomNamespace',
      customSegmentStructures: [],
    };

    const namespaceDeclaration: ModuleDeclaration = createNamespace(sourceFile, customNamespace);

    expect(namespaceDeclaration.getName()).toBe(customNamespace.name);
    expect(namespaceDeclaration.getDeclarationKind()).toEqual(ModuleDeclarationKind.Namespace);
    expect(namespaceDeclaration.getBodyText()).toBeFalsy();
  });

  it('should create a valid namespace with a single segment structure', () => {
    const classDefinition: ICustomClass = {
      name: 'CustomClassNamespace',
      methods: [],
    };
    const customNamespaceForClass: ICustomNamespace = {
      name: 'CustomClassNamespace',
      customSegmentStructures: [],
    };
    const segmentStructure: ICustomSegmentStructure = {
      class: classDefinition,
      namespace: customNamespaceForClass,
    };

    const customNamespace: ICustomNamespace = {
      name: 'CustomNamespace',
      customSegmentStructures: [segmentStructure],
    };

    const namespaceDeclaration: ModuleDeclaration = createNamespace(sourceFile, customNamespace);

    expect(namespaceDeclaration.getName()).toBe(customNamespace.name);
    expect(namespaceDeclaration.getDeclarationKind()).toEqual(ModuleDeclarationKind.Namespace);
    expect(namespaceDeclaration.getBodyText()).toBeTruthy();
    expect(namespaceDeclaration.getStructure().statements).toHaveLength(2);
    // @ts-ignore
    expect(namespaceDeclaration.getStructure().statements[0].kind).toEqual(2); // class def
    // @ts-ignore
    expect(namespaceDeclaration.getStructure().statements[1].kind).toEqual(29); // namespace def
  });
});

describe('creating Routes ', () => {
  let sourceFile: SourceFile;

  beforeEach(() => {
    sourceFile = project.createSourceFile(`route-classes.ts`, undefined, { overwrite: true });
  });

  it('should create a simple routes file', () => {
    const classDefinition: ICustomClass = {
      name: 'CustomClassWithNamespace',
      methods: [],
    };
    const customNamespaceForClass: ICustomNamespace = {
      name: 'CustomNamespaceWithClass',
      customSegmentStructures: [],
    };
    const segmentStructure: ICustomSegmentStructure = {
      class: classDefinition,
      namespace: customNamespaceForClass,
    };

    const file = createRoutes(sourceFile, segmentStructure);
    expect(file.getStructure().statements).toHaveLength(2);
    // @ts-ignore
    expect(file.getStructure().statements[0].kind).toEqual(2); // class def
    // @ts-ignore
    expect(file.getStructure().statements[1].kind).toEqual(29); // namespace def
  });

  it('should create a nested routes file', () => {
    const classDefinition2: ICustomClass = {
      name: 'CustomClass2',
      methods: [],
    };
    const customNamespaceForClass2: ICustomNamespace = {
      name: 'CustomNamespace2',
      customSegmentStructures: [],
    };
    const segmentStructure2: ICustomSegmentStructure = {
      class: classDefinition2,
      namespace: customNamespaceForClass2,
    };

    const classDefinition1: ICustomClass = {
      name: 'CustomClass1',
      methods: [],
    };
    const customNamespaceForClass1: ICustomNamespace = {
      name: 'CustomNamespace1',
      customSegmentStructures: [segmentStructure2],
    };
    const segmentStructure1: ICustomSegmentStructure = {
      class: classDefinition1,
      namespace: customNamespaceForClass1,
    };

    const file = createRoutes(sourceFile, segmentStructure1);
    // nesting layer 1
    expect(file.getStructure().statements).toHaveLength(2);
    // @ts-ignore
    expect(file.getStructure().statements[0].kind).toEqual(2); // class def
    // @ts-ignore
    expect(file.getStructure().statements[0].name).toEqual(classDefinition1.name);
    // @ts-ignore
    expect(file.getStructure().statements[1].kind).toEqual(29); // namespace def
    // @ts-ignore
    expect(file.getStructure().statements[1].name).toEqual(customNamespaceForClass1.name);

    // nesting layer 2
    // @ts-ignore
    const namespace1 = file.getStructure().statements[1];
    expect(namespace1.statements).toHaveLength(2);
    // @ts-ignore
    expect(namespace1.statements[0].kind).toEqual(2); // class def
    expect(namespace1.statements[0].name).toEqual(classDefinition2.name);
    // @ts-ignore
    expect(namespace1.statements[1].kind).toEqual(29); // namespace def
    // @ts-ignore
    expect(namespace1.statements[1].name).toEqual(customNamespaceForClass2.name);

    // nesting layer 3 should be empty
    const namespace2 = namespace1.statements[1];
    expect(namespace2.statements).toHaveLength(0);
  });
});

describe('importing classes ', () => {
  let sourceFile: SourceFile;

  beforeEach(() => {
    sourceFile = project.createSourceFile(`route-classes.ts`, undefined, { overwrite: true });
  });

  it('should import RouteSegment and EndStateRouteSegment', () => {
    const imports = Object.keys(models);
    const file = addImportsIntoSourceFile(sourceFile);

    expect(file.getImportStringLiterals()).toHaveLength(1);
    expect(file.getImportStringLiterals()[0].getLiteralValue()).toEqual('../models');

    expect(file.getImportDeclarations()).toHaveLength(1);
    expect(file.getImportDeclarations()[0].getNamedImports()).toHaveLength(imports.length);
    file
      .getImportDeclarations()[0]
      .getNamedImports()
      .forEach((nameImport) => {
        expect(imports).toContain(nameImport.getName());
      });
  });
});

describe('creating variables ', () => {
  let sourceFile: SourceFile;

  beforeEach(() => {
    sourceFile = project.createSourceFile(`route-classes.ts`, undefined, { overwrite: true });
  });

  it('should create exported const variable with type', () => {
    const variableName = 'variableName';
    const initializer = 'CustomClass.from()';
    const type = 'CustomType';
    createExportedVariable(sourceFile, variableName, initializer, type);

    expect(sourceFile.getVariableDeclarations()).toHaveLength(1);

    const variableDeclaration = sourceFile.getVariableDeclarations()[0];
    expect(sourceFile.getVariableDeclarations()[0].isExported()).toBeTruthy();
    expect(variableDeclaration.getStructure().name).toEqual(variableName);
    expect(variableDeclaration.getStructure().initializer).toEqual(initializer);
    expect(variableDeclaration.getStructure().type).toEqual(type);
  });
});

function assertMethod(methodDefinition: ICustomMethod, methodDeclaration: MethodDeclaration) {
  expect(methodDeclaration.getParameters()).toHaveLength(methodDefinition.args.length);
  if (methodDefinition.args.length > 0) {
    methodDeclaration.getParameters().forEach((param) => {
      expect(methodDefinition.args).toContain(param.getName());
    });
  }
  expect(methodDeclaration.getName()).toBe(methodDefinition.name);
  expect(methodDeclaration.getName()).toBe(methodDefinition.name);
  if (methodDefinition.returnType) {
    expect(methodDeclaration.print()).toContain(`: ${methodDefinition.returnType} {`);
  } else {
    expect(methodDeclaration.print()).toContain(`: ${methodDefinition.returnType} {`);
  }
}
