// e.g. 'my-hypenated-string' -> 'myHypenatedString'
export function hyphenatedToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function underscoreToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

export class StringUtils {
  constructor(private str: string) {}

  hyphenatedToCamelCase(): this {
    this.str = this.str.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    return this;
  }

  capitalizeFirstLetter(): this {
    this.str = this.str.charAt(0).toUpperCase() + this.str.slice(1);
    return this;
  }

  underscoreToCamelCase(): this {
    this.str = this.str.replace(/_([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    return this;
  }

  toString(): string {
    return this.str;
  }
}
