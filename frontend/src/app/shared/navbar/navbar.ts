import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { 
  matCheckCircle,
  matMenu,
  matClose
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-navbar',
  imports: [NgIcon, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.html',
  providers: [
    provideIcons({ 
      matCheckCircle,
      matMenu,
      matClose
    })
  ]
})
export class Navbar {
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
