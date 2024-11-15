import { test } from "uvu";
import * as assert from "uvu/assert";
import { parse } from "../../src/index.js";
import postcss, { Document, Input, Root } from "postcss";
import { getAllFixtureFilenames, getFixtureCode } from "../utils.js";

getAllFixtureFilenames().forEach((filename) => {
  const fixture = getFixtureCode(filename);

  test(`Parse runs for: ${fixture.filename}`, () => {
    const result = parse(fixture.code, {
      from: fixture.path,
    });

    assert.ok(result);
    assert.instance(result, postcss.Document);
    result.nodes.forEach((node) => {
      assert.instance(node, postcss.Root);
    });
  });
});

/**
 * An array of test cases for verifying the Document parsing functionality.
 *
 * Each test case includes:
 * - `filename`: The name of the file to test.
 * - `expected`: A function that generates the expected `Document` instance based on the provided code and processing options.
 * @type {Array<{
 *   on: boolean,
 *   filename: string,
 *   expected: (code: string, processOpts: import('postcss').ProcessOptions) => import('postcss').Document
 * }>}
 */
const testCases = [
  {
    on: true,
    filename: "no-style.component.ts",
    expected: (code, processOpts) => {
      const expectedDoc = new Document();
      expectedDoc.source = {
        input: new Input(code, processOpts),
        start: {
          line: 1,
          column: 1,
          offset: 0,
        },
      };
      return expectedDoc;
    },
  },
  {
    on: false,
    filename: "empty-style.component.ts",
    expected: (code, processOpts) => {
      const input = new Input(code, processOpts);
      const document = new Document();
      document.source = {
        input,
        start: {
          line: 1,
          column: 1,
          offset: 0,
        },
      };
      const root = new Root();
      const raws = {
        after: "",
        codeBefore:
          'import { Component } from "@angular/core";\n\n@Component({\n  selector: "app-example",\n  template: "<div></div>",\n  styles: "',
        codeAfter: '",\n})\nexport class ExampleComponent {}\n',
      };
      root.raws = raws;
      root.source = {
        input,
        start: {
          line: 6,
          column: 11,
          offset: 121,
        },
        end: {
          line: 6,
          column: 11,
          offset: 121,
        },
      };
      document.push(root);

      return document;
    },
  },
];

testCases.forEach(({ on, filename, expected }) => {
  if (!on) return;
  const fixture = getFixtureCode(filename);

  test(`Parse returns correctly: ${fixture.filename}`, () => {
    /** @type {postcss.ProcessOptions} */
    const processOpts = {
      from: fixture.path,
    };

    const result = parse(fixture.code, processOpts);

    assert.ok(result);
    assert.instance(result, postcss.Document);

    assert.equal(result.toJSON(), expected(fixture.code, processOpts).toJSON());
  });
});

test.run();
