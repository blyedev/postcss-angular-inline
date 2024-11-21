import { Project, SyntaxKind } from "ts-morph";

/**
 * @typedef {import("ts-morph").StringLiteral | import("ts-morph").NoSubstitutionTemplateLiteral} StyleLiteral
 */

/**
 * Parses TypeScript source to extract style literals from component decorators.
 *
 * @param {import("postcss").Input} input - The PostCSS input containing the source CSS and its originating file.
 * @returns {StyleLiteral[]} An array of style literals extracted from the components within the source file.
 */
export function parseTypescript(input) {
  const project = new Project({
    useInMemoryFileSystem: true,
  });

  const sourceFile = project.createSourceFile(input.from, input.css);
  return extractStyleLiterals(sourceFile);
}

/**
 * Extracts style literals from a source file.
 *
 * @param {import("ts-morph").SourceFile} sourceFile - The TypeScript source file to parse.
 * @returns {StyleLiteral[]} An array of extracted style literals.
 */
function extractStyleLiterals(sourceFile) {
  return sourceFile
    .getClasses()
    .flatMap(getComponentDecorators)
    .flatMap(getDecoratorArguments)
    .filter(isObjectLiteral)
    .flatMap(getStylesProperty)
    .flatMap(getStyleValues)
    .map(castToStyleLiteral);
}

/**
 * Retrieves component decorators from a class.
 *
 * @param {import("ts-morph").ClassDeclaration} cls - The class declaration.
 * @returns {import("ts-morph").Decorator[]} An array of Component decorators.
 */
function getComponentDecorators(cls) {
  return cls.getDecorators().filter(isComponentDecorator);
}

/**
 * Determines whether a given decorator is a Component decorator.
 *
 * @param {import("ts-morph").Decorator} decorator - The decorator to evaluate.
 * @returns {boolean} `true` if the decorator is named "Component"; otherwise, `false`.
 */
function isComponentDecorator(decorator) {
  return decorator.getName() === "Component";
}

/**
 * Retrieves arguments from a decorator.
 *
 * @param {import("ts-morph").Decorator} decorator - The decorator.
 * @returns {import("ts-morph").Node[]} An array of decorator arguments.
 */
function getDecoratorArguments(decorator) {
  return decorator.getArguments();
}

/**
 * Checks if the provided expression is an object literal.
 *
 * @param {import("ts-morph").Expression} expr - The expression to check.
 * @returns {boolean} `true` if the expression is an ObjectLiteralExpression; otherwise, `false`.
 */
function isObjectLiteral(expr) {
  return expr.getKind() === SyntaxKind.ObjectLiteralExpression;
}

/**
 * Extracts the 'styles' property from an ObjectLiteralExpression.
 *
 * @param {import("ts-morph").ObjectLiteralExpression} obj - The object literal representing component metadata.
 * @returns {import("ts-morph").Expression[]} An array containing the initializer of the 'styles' property, if it exists.
 */
function getStylesProperty(obj) {
  const prop = obj.getProperty("styles");
  return prop && prop.getKind() === SyntaxKind.PropertyAssignment
    ? [
        prop
          .asKindOrThrow(SyntaxKind.PropertyAssignment)
          .getInitializerOrThrow(),
      ]
    : [];
}

/**
 * Retrieves the style values from an expression, handling both single expressions and array literals.
 *
 * @param {import("ts-morph").Expression} expr - The initializer expression of the 'styles' property.
 * @returns {import("ts-morph").Expression[]} An array of expressions representing individual style literals.
 */
function getStyleValues(expr) {
  if (expr.getKind() === SyntaxKind.ArrayLiteralExpression) {
    return expr.asKindOrThrow(SyntaxKind.ArrayLiteralExpression).getElements();
  }
  return [expr];
}

/**
 * Converts an expression to a StyleLiteral type, ensuring it is a supported literal.
 *
 * @param {import("ts-morph").Expression} expr - The expression to cast.
 * @returns {StyleLiteral} The expression cast to a StyleLiteral.
 * @throws {Error} If the expression is not a StringLiteral or NoSubstitutionTemplateLiteral.
 */
function castToStyleLiteral(expr) {
  if (expr.getKind() === SyntaxKind.StringLiteral) {
    return expr.asKindOrThrow(SyntaxKind.StringLiteral);
  } else if (expr.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral) {
    return expr.asKindOrThrow(SyntaxKind.NoSubstitutionTemplateLiteral);
  }
  throw new Error("Unsupported style literal type.");
}
