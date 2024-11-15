import { Component } from "@angular/core";

@Component({
  selector: "app-example",
  template: "<div></div>",
  styles: [
    ".example { color: red; }",
    `
      .other {
        background: blue;
      }

      .another {
        background: blue;
      }
    `,
  ],
})
export class ExampleComponent {}
