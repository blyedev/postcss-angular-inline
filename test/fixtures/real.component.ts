import { Component, OnInit } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterLink, RouterOutlet, AsyncPipe],
  templateUrl: "./app.component.html",
  styles: [
    `
      header {
      }
    `,
    `
      header {
        height: 32px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
      }
    `,
    `
      header img {
        height: 24px;
        width: 24px;
      }
    `,
    `
      header nav {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        gap: 24px;
      }
    `,
    `
      a {
        color: black;
        font-size: 18px;
        text-decoration: none;
        font-family: Arial, Helvetica, sans-serif;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = "calendar-app-frontend";
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkSession().subscribe();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
