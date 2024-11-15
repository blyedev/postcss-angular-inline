import { Component } from "@angular/core";

@Component({
  selector: "app-example",
  template: "<div></div>",
  styles: [
    ".example { color: red; }",
    `
      .another {
        background: blue;
      }
    `,
  ],
})
export class ExampleComponent {}
