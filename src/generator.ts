const routes = [
  "/home/{userId}/workout/{}?name='james'",
  '/home/user/{userId}/update/*',
  '/home/user/create',
  '/auth/login/check',
  '/auth/{userId}/login',
  '/auth/register',
  '/profile',
  '/profile/dashboard',
  '/profile/dashboard/today',
  '/profile/dashboard/yesterday',
  '/profile/dashboard/today/max',
  '/profile/dashboard/yesterday/max',
];

const className = 'home';

export function createFunctionDefinition(methodName: string, typePath: string): string {
  const type = `${typePath}.${methodName}`;
  return `
    ${methodName}(): ${type} {
       return ${type}.from(this)
    }`;
}

function createFunctionDefinitionStrings(functionNames: string[], fullClassName: string) {
  return functionNames.map((functionName) => createFunctionDefinition(functionName, fullClassName));
}

export function createClassDefinition(className: string, fullPath: string, functionNames: string[]) {
  const fullClassName = !!fullPath ? `${fullPath}.${className}` : className;
  const functionDefinitionStrings = createFunctionDefinitionStrings(functionNames, fullClassName).join('');

  return `
    export class ${className} extends RouteSegment {
      ${functionDefinitionStrings}
    }`;
}

interface Definition {
  name: string;
  children: Definition[];
}

export function createNamespaceAndClassDefinition(definition: Definition, fullPath: string): string {
  definition.name = definition.name.charAt(0).toUpperCase() + definition.name.slice(1);
  const fullNamePath = !!fullPath ? `${fullPath}.${definition.name}` : definition.name;
  const classFunctionNames = definition.children.map((childDefinition) => {
    childDefinition.name = childDefinition.name.charAt(0).toUpperCase() + childDefinition.name.slice(1);
    return childDefinition.name;
  });
  const nameSpaceClassesStrings = definition.children
    .map((c) => `${createNamespaceAndClassDefinition(c, fullNamePath)}`)
    .join('\n');

  return `
    ${createClassDefinition(definition.name, fullPath, classFunctionNames)}
    export namespace ${definition.name} {
      ${nameSpaceClassesStrings}
    }`;
}

const userIdUserIdDefinition: Definition = {
  name: 'userId',
  children: [],
};
const userIdLoginDefinition: Definition = {
  name: 'login',
  children: [],
};
const userIdDefinition: Definition = {
  name: 'userid',
  children: [userIdLoginDefinition, userIdUserIdDefinition],
};

const checkDefinition: Definition = {
  name: 'check',
  children: [],
};
const loginDefinition: Definition = {
  name: 'login',
  children: [checkDefinition],
};
export const authDefinition: Definition = {
  name: 'auth',
  children: [loginDefinition, userIdDefinition],
};
