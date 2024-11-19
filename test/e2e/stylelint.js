import { test } from "uvu";
import stylelint from "stylelint";
import stylelintConfig from "stylelint-config-standard";
import customSyntax from "../../src/index.js";
import { getAllFixtureFilenames, getFixtureCode } from "../utils.js";
import * as assert from "uvu/assert";

const stylelintRun = (content, path, opts) => {
  return stylelint.lint({
    code: content,
    codeFilename: path,
    customSyntax,
    config: stylelintConfig,
    ...opts,
  });
};

const fixtures = getAllFixtureFilenames();

fixtures.forEach((filename) => {
  const fixture = getFixtureCode(filename);

  test(`Test if stylelint runs: ${fixture.filename}`, async () => {
    await stylelintRun(fixture.code, fixture.path);
  });
});

const autofixFiles = [
  { fixable: "fixable.component.ts", fixed: "fixed.component.ts" },
];

autofixFiles.forEach(({ fixable, fixed }) => {
  const fixture = getFixtureCode(fixable);

  test(`Test if stylelint fixes errors: ${fixture.filename}`, async () => {
    const result = await stylelintRun(fixture.code, fixture.path, {
      fix: true,
    });
    assert.is(result.code, getFixtureCode(fixed).code);
  });
});

const noSourceFixture = getFixtureCode("no-style.component.ts");
test(`Test if stylelint considers this empty source: ${noSourceFixture.filename}`, async () => {
  const result = await stylelintRun(noSourceFixture.code, noSourceFixture.path);
  assert.equal(result.results[0].warnings, []);
});

const emptySourceFixture = getFixtureCode("empty-style.component.ts");
test(`Test if stylelint considers this empty source: ${emptySourceFixture.filename}`, async () => {
  const result = await stylelintRun(
    emptySourceFixture.code,
    emptySourceFixture.path,
  );

  assert.equal(result.results[0].warnings[0], {
    line: 6,
    column: 11,
    endLine: 6,
    endColumn: 12,
    rule: "no-empty-source",
    severity: "error",
    text: "Unexpected empty source (no-empty-source)",
    url: undefined,
  });
});

test.run();
