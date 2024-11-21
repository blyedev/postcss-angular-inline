import { test } from "uvu";
import * as assert from "uvu/assert";
import { getFixtureCode } from "../utils.js";
import { Input } from "postcss";
import { parseTypescript } from "../../src/parser/parse-typescript.js";

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
  const fixture = getFixtureCode(filename);

  test(`Parse the strings of fixture: ${fixture.filename}`, () => {
    const input = new Input(fixture.code, { from: fixture.path });

    const result = parseTypescript(input);

    assert.ok(result);
    assert.instance(result, Array);
    assert.equal(
      result.map((sl) => sl.getLiteralText()),
      styles,
    );
  });
});

test.run();
