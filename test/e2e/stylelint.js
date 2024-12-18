import { test } from "uvu";
import stylelint from "stylelint";
import stylelintConfig from "stylelint-config-standard";
import customSyntax from "../../src/index.js";
import { getAllFixtureFilenames, getFixtureCode } from "../utils.js";
import { equal, not, ok, snapshot } from "uvu/assert";

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
    snapshot(result.code, getFixtureCode(fixed).code);
  });
});

const noSourceFixture = getFixtureCode("no-style.component.ts");
test(`Test if stylelint considers this empty source: ${noSourceFixture.filename}`, async () => {
  const result = await stylelintRun(noSourceFixture.code, noSourceFixture.path);
  equal(
    result.results[0].warnings.length,
    0,
    `Expected no warnings but the following warnings were raised: ${result.results[0].warnings}`,
  );
});

// TODO: Fix these
const emptySourceWarning = [
  //"empty-style.component.ts",
  //"whitespace.component.ts",
];

emptySourceWarning.forEach((filename) => {
  const fixture = getFixtureCode(filename);
  test(`Test if stylelint considers this empty source: ${fixture.filename}`, async () => {
    const result = await stylelintRun(fixture.code, fixture.path);
    ok(result);
    ok(result.results[0]);

    const warnings = result.results[0].warnings;
    not.equal(warnings, [], "Expected warnings not to be empty");
    ok(
      warnings.map((w) => w.rule).includes("no-empty-source"),
      `Expected a warning about empty source. Warnings: ${JSON.stringify(warnings)}`,
    );
  });
});

test.run();
