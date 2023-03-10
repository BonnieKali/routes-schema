# TODO

### Further development

- withQueryParam should accept type/enum of accepted params defined in the schema.
- Add verification step for user-defined routes.
  Create dictionary of all accessible methods from out models class and check for collisions after
  running them through the format method.
- We need to allow duplicate query params with the same key for accepting lists:
  - https://stackoverflow.com/questions/2602043/rest-api-best-practice-how-to-accept-list-of-parameter-values-as-input
- Create cli tool for generating routes
- Publish to npm
- Make pretty README

## Forbidden Route Segment Paths

Below are a list of paths you should not include within the schema e.g. /**build**/**get-Name**/**withQueryParams**.

1. **build** this will conflict with our _.build()_ method.
2. **(G|g)et(N|n)ame, (G|g)et-(N|n)ame, (G|g)et\_(N|n)ame** this will conflict with our _.getName()_ method.
3. **withQueryParam** this will confilct with our _.withQueryParam(arg)_ method.
4. **withQueryParams** this will confilct with our _.withQueryParam(args)_ method.

You also cannot have conflicting names with input variables because method overloading is not a feature of typescript e.g.
