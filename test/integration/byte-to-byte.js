import { test } from "uvu";
import * as assert from "uvu/assert";
import postcss from "postcss";
import customSyntax from "../../src/index.js";
import { getAllFixtureFilenames, getFixtureCode } from "../utils.js";

getAllFixtureFilenames().forEach((filename) => {
  const fixture = getFixtureCode(filename);

  test(`CustomSyntax byte-to-byte transformation on: ${fixture.filename}`, async () => {
    const result = await postcss().process(fixture.code, {
      syntax: customSyntax,
      from: filename,
    });

    const outputContent = result.css;

    assert.snapshot(
      outputContent,
      fixture.code,
      `The output should match the input byte-to-byte for ${filename}.`,
    );
  });
});

test.run();
