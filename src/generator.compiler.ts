import { ClassDeclaration, Project, Scope, SourceFile } from 'ts-morph';
export function run() {
  const project = new Project();
  const sourceFile = project.createSourceFile(`/Users/james/IdeaProjects/routes-schema/src/file.ts`);

  const classDeclaration = sourceFile.addClass({
    name: 'SomeClass',
  });

  const constr = classDeclaration.addConstructor({});

  constr.setBodyText('this.myProp = myProp');

  classDeclaration.addProperty({
    name: 'myProp',
    type: 'string',
    initializer: "'hello world!'",
    scope: Scope.Public,
  });
  sourceFile.formatText();
  // tslint:disable-next-line:no-console
  console.log(sourceFile.getText());
}

interface RouteSegmentClass {
  name: string;
  path: string;
}
function createClass(sourceFile: SourceFile, routeSegmentClass: RouteSegmentClass): void {
  const classDeclaration = sourceFile.addClass({
    name: routeSegmentClass.name,
  });
}

interface IFunction {
  name: string;
  path: string;
}
function createMethod(classDeclaration: ClassDeclaration, functionDefinition: IFunction): void {
  classDeclaration.addMethod({
    name: functionDefinition.name,
  });
}

interface ICustomMethod {
  name: string;
  returnType: string;
  args: string[];
}
interface ICustomClass {
  name: string;
  constructor: ICustomMethod;
  customMethods: ICustomMethod;
}
interface ICustomNamespace {
  name: string;
  customSegmentStructures: ICustomSegmentStructure[];
}
interface ICustomSegmentStructure {
  class: ICustomClass;
  namespace: ICustomNamespace;
}
