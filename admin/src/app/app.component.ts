import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // Thay RouterOutlet bằng RouterModule
import { ChatComponent } from './chat/chat.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Import RouterModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'admin';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.validateSession();
  }
}
