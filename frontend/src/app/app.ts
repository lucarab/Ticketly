import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  matCheckCircle, 
  matMenu, 
  matClose 
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [
    provideIcons({ 
      matCheckCircle, 
      matMenu, 
      matClose 
    })
  ]
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
