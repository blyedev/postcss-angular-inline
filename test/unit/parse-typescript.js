import { test } from "uvu";
import * as assert from "uvu/assert";
import { getFixtureCode } from "../utils.js";
import { parseTypescript } from "../../src/parse-typescript.js";

const testCases = [
  {
    filename: "no-style.component.ts",
    styles: [],
  },
  {
    filename: "empty-style.component.ts",
    styles: [""],
  },
  {
    filename: "one-style.component.ts",
    styles: [".example { color: red; }"],
  },
  {
    filename: "multi-style.component.ts",
    styles: [
      ".example { color: red; }",
      `
      .another {
        background: blue;
      }
    `,
    ],
  },
];

testCases.forEach(({ filename, styles }) => {
  test(`Parse the strings of fixture: ${filename}`, () => {
    const result = parseTypescript(getFixtureCode(filename).code, filename);

    assert.ok(result);
    assert.instance(result, Array);
    assert.equal(
      result.map((sl) => sl.getLiteralText()),
      styles,
    );
  });
});

test.run();
