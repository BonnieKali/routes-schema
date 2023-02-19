export class StringUtils {
  constructor(private str: string) {}

  hyphenatedToCamelCase(): this {
    this.str = this.str.replace(/-([a-z])/g, (g) => {
      return g[1].toUpperCase();
    });
    return this;
  }

  capitalizeFirstLetter(): this {
    this.str = this.str.charAt(0).toUpperCase() + this.str.slice(1);
    return this;
  }

  underscoreToCamelCase(): this {
    this.str = this.str.replace(/_([a-z])/g, (g) => {
      return g[1].toUpperCase();
    });
    return this;
  }

  toString(): string {
    return this.str;
  }
}
