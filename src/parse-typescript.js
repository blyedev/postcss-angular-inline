import { Project, SyntaxKind } from "ts-morph";

/**
 * @typedef {import("ts-morph").StringLiteral | import("ts-morph").NoSubstitutionTemplateLiteral} StyleLiteral
 */

/**
 * Extracts style literals from Angular component code.
 * @param {string} content - The content of the TypeScript file.
 * @param {string} path - The file path of the TypeScript file.
 * @returns {StyleLiteral[]} An array of style literals extracted from the component.
 */
export function parseTypescript(content, path) {
  /** @type {Project} */
  const project = new Project({
    useInMemoryFileSystem: true,
  });

  /** @type {import("ts-morph").SourceFile} */
  const sourceFile = project.createSourceFile(path, content);

  return (
    sourceFile
      .getClasses()
      .flatMap((cls) => cls.getDecorators())
      .filter((decorator) => decorator.getName() === "Component")
      .map((decorator) => decorator.getArguments())
      // Get the argument of Component
      .filter(
        (args) =>
          args.length === 1 &&
          args[0].getKind() === SyntaxKind.ObjectLiteralExpression,
      )
      // Get the styles property of the object passed to Component
      .map((args) =>
        args[0]
          .asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
          .getProperty("styles"),
      )
      // Filter out undefined or non-PropertyAssignment
      .filter(
        (stylesProp) =>
          stylesProp && stylesProp.getKind() === SyntaxKind.PropertyAssignment,
      )
      // Get the initializer of the styles property
      .map((stylesProp) =>
        stylesProp
          .asKindOrThrow(SyntaxKind.PropertyAssignment)
          .getInitializer(),
      )
      // Flatten array literals into individual elements
      .flatMap((stylesVals) => {
        if (
          stylesVals &&
          stylesVals.getKind() === SyntaxKind.ArrayLiteralExpression
        ) {
          return stylesVals
            .asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
            .getElements();
        }
        return [stylesVals];
      })
      // Filter and cast to StyleLiteral
      .map((expression) => {
        if (expression.getKind() === SyntaxKind.StringLiteral) {
          return expression.asKindOrThrow(SyntaxKind.StringLiteral);
        } else if (
          expression.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral
        ) {
          return expression.asKindOrThrow(
            SyntaxKind.NoSubstitutionTemplateLiteral,
          );
        } else {
          throw new Error("Bad error, system will self-destruct");
        }
      })
  );
}
