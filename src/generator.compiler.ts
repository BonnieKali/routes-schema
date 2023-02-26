import {
  ClassDeclaration,
  MethodDeclaration,
  ModuleDeclaration,
  ModuleDeclarationKind,
  Project,
  SourceFile,
  VariableDeclarationKind,
} from 'ts-morph';
import * as models from './models';

export function generate(
  customSegmentStructure: ICustomSegmentStructure,
  outputFile: string,
  rootRouteName = 'RootRoute',
) {
  const project = new Project();
  const sourceFile = project.createSourceFile(outputFile, undefined, { overwrite: true });

  const file = createRoutes(sourceFile, customSegmentStructure);

  const className = customSegmentStructure.class.name;
  createExportedVariable(file, rootRouteName, `${className}.from()`, className);

  addImportsIntoSourceFile(file);

  file.formatText();
  console.log(file.getText());
  file.save();
}

export function createExportedVariable(file: SourceFile, variableName: string, initializer: string, type: string) {
  file.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{ name: variableName, initializer: initializer, type: type }],
    isExported: true,
  });
}

export function addImportsIntoSourceFile(sourceFile: SourceFile) {
  const importLocation = '../models';
  const classNames = Object.keys(models);
  addImport(sourceFile, classNames, importLocation);
  return sourceFile;
}

function addImport(sourceFile: SourceFile, classNames: string[], location: string) {
  sourceFile.addImportDeclaration({
    namedImports: classNames.map((name) => {
      return { name };
    }),
    moduleSpecifier: location,
  });
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
  returnType: string;
  args: string[];
}
export interface ICustomClass {
  name: string;
  methods: ICustomMethod[];
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
