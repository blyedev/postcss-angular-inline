# PostCSS Angular Inline

A [PostCSS](https://github.com/postcss/postcss) syntax plugin to process inline CSS styles in Angular components, enabling the use of PostCSS transformations and Stylelint.

> **Note:** Generally, you don't need a syntax plugin for Angular unless you're using inline styles. It's common practice to generate styles outside of the component, but if you choose to use inline styles, this plugin enables PostCSS transformations and Stylelint integration.

## Usage with Stylelint

To use Stylelint with this syntax plugin and confine linting to only .component.ts files, follow these steps:

1. Install Stylelint and Necessary Plugins

   ```bash
   npm install --save-dev stylelint stylelint-config-standard postcss-angular-inline
   ```

2. Create a .stylelintrc.json Configuration File

   ```json
   {
     "extends": ["stylelint-config-standard"],
     "overrides": [
       {
         "files": ["**/*.component.ts"],
         "customSyntax": "postcss-angular-inline"
       }
     ]
   }
   ```

3. Run Stylelint on .component.ts Files

   ```bash
   npx stylelint "**/*.component.ts"
   ```

## Usage with PostCSS

1. Install via npm:

   ```bash
   npm install --save-dev postcss-angular-inline
   ```

2. Configure PostCSS:

   ```javascript
   // postcss.config.js
   module.exports = {
     syntax: "postcss-angular-inline",
     plugins: [
       // Your PostCSS plugins
     ],
   };
   ```

## Roadmap to Version 1.0.0

The following features and improvements are planned before the official 1.0.0 release:

1. Better Typing (Target Version: 0.2.0)

   - Improve TypeScript definitions for enhanced developer experience and code safety.

2. Testing (Target Version: 0.3.0)

   - Enhance the test suite to ensure reliability and prevent regressions.

3. Support for Preprocessors (Target Version: 0.4.0)

   - Add support for SCSS and LESS inline styles in Angular components.

4. Handling Empty Strings (Target Version: 0.5.0)

   - Fix issues where empty inline styles are not correctly recognized or processed.

5. Preserving Escaped Newlines (Target Version: 0.6.0)
   - Ensure escaped newlines `\n` in strings are preserved and correctly represented in the output.

## Current Limitations

- Escaped newlines (\n) are not preserved, affecting tools like Stylelint.
- Empty sources may not be handled correctly by Stylelint.
- Does not support SCSS or LESS in inline styles.
