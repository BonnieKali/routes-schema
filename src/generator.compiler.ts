import {
  ClassDeclaration,
  MethodDeclaration,
  ModuleDeclaration,
  ModuleDeclarationKind,
  Project,
  SourceFile,
} from 'ts-morph';

export function run(customSegmentStructure: ICustomSegmentStructure, outputFile: string) {
  const project = new Project();
  const sourceFile = project.createSourceFile(outputFile, undefined, { overwrite: true });

  const file = createRoutes(sourceFile, customSegmentStructure);
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
  if (classDefinition.superClass) {
    classDeclaration.setExtends(classDefinition.superClass);
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
  classDeclaration.setIsExported(true);
  classDefinition.methods.forEach((method) => createMethod(classDeclaration, method));
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
  namespaceDeclaration.setIsExported(true);

  namespaceDefinition.customSegmentStructures.forEach((seg) => createSegmentStructure(namespaceDeclaration, seg));
  return namespaceDeclaration;
}

export function createSegmentStructure(
  moduleDeclaration: ModuleDeclaration | SourceFile,
  segmentStructure: ICustomSegmentStructure,
) {
  createClass(moduleDeclaration, segmentStructure.class);
  createNamespace(moduleDeclaration, segmentStructure.namespace);
}

export interface ICustomMethod {
  name: string;
  returnType?: string; // constructors do not have return types
  args: string[];
}
export interface ICustomClass {
  name: string;
  methods: ICustomMethod[];
  classConstructor?: ICustomMethod;
  superClass?: string;
}
export interface ICustomNamespace {
  name: string;
  customSegmentStructures: ICustomSegmentStructure[];
}
export interface ICustomSegmentStructure {
  class: ICustomClass;
  namespace: ICustomNamespace;
}
