import { Component } from '@angular/core';
import { ApiStatusComponent } from './api-status/api-status.component';

@Component({
  selector: 'app-header-component',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [ApiStatusComponent],
})
export class HeaderComponent {}
