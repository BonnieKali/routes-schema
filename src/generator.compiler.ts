import {
  ClassDeclaration,
  MethodDeclaration,
  ModuleDeclaration,
  ModuleDeclarationKind,
  Project,
  Scope,
  SourceFile,
} from 'ts-morph';

export function run() {
  const project = new Project();
  const sourceFile = project.createSourceFile(`/Users/james/IdeaProjects/routes-schema/src/file.ts`);

  const classDefinition2: ICustomClass = {
    name: 'CustomClass2',
    customMethods: [],
    classConstructor: undefined,
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
    customMethods: [],
    classConstructor: undefined,
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
  file.formatText();
  // tslint:disable-next-line:no-console
  console.log(file.getText());
  file.save();
}

export function createMethod(classDeclaration: ClassDeclaration, methodDefinition: ICustomMethod): MethodDeclaration {
  const methodDeclaration = classDeclaration.addMethod({
    name: methodDefinition.name,
  });
  methodDeclaration.addParameters(
    methodDefinition.args.map((arg) => {
      return {
        name: arg,
        type: 'any',
      };
    }),
  );

  if (!!methodDefinition.returnType) {
    methodDeclaration.setReturnType(methodDefinition.returnType);
  }

  const fromArguments = ['this', ...methodDefinition.args].join(',');
  methodDeclaration.setBodyText((writer) =>
    writer.writeLine(`return ${methodDefinition.returnType}.from(${fromArguments});`),
  );

  return methodDeclaration;
}

export function createClass(moduleDeclaration: ModuleDeclaration | SourceFile, classDefinition: ICustomClass) {
  const classDeclaration = moduleDeclaration.addClass({
    name: classDefinition.name,
  });
  if (classDefinition.parentClass?.name) {
    classDeclaration.setExtends(classDefinition.parentClass?.name);
  }
  if (classDefinition.classConstructor) {
    const con = classDeclaration.addConstructor();
    con.addParameters(
      classDefinition.classConstructor.args.map((arg) => {
        return {
          name: arg,
          type: 'any',
        };
      }),
    );
    con.setBodyText('super();');
  }
  return classDeclaration;
}

export function createRoutes(sourceFile: SourceFile, rootSegmentStructure: ICustomSegmentStructure) {
  createSegmentStructure(sourceFile, rootSegmentStructure);
  return sourceFile;
}

export function createNamespace(
  moduleDeclaration: ModuleDeclaration | SourceFile,
  namespaceDefinition: ICustomNamespace,
) {
  const namespaceDeclaration = moduleDeclaration.addModule({
    name: namespaceDefinition.name,
  });
  namespaceDeclaration.setDeclarationKind(ModuleDeclarationKind.Namespace);

  namespaceDefinition.customSegmentStructures.forEach((seg) => createSegmentStructure(namespaceDeclaration, seg));
  return namespaceDeclaration;
}

export function createSegmentStructure(
  moduleDeclaration: ModuleDeclaration | SourceFile,
  segmentStructure: ICustomSegmentStructure,
) {
  const classDeclaration = createClass(moduleDeclaration, segmentStructure.class);
  const namespaceDeclaration = createNamespace(moduleDeclaration, segmentStructure.namespace);
}

export interface ICustomMethod {
  name: string;
  returnType?: string; // constructors do not have return types
  args: string[];
}
export interface ICustomClass {
  name: string;
  customMethods: ICustomMethod[];
  classConstructor?: ICustomMethod;
  parentClass?: ICustomClass;
}
export interface ICustomNamespace {
  name: string;
  customSegmentStructures: ICustomSegmentStructure[];
}
export interface ICustomSegmentStructure {
  class: ICustomClass;
  namespace: ICustomNamespace;
}
