import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Navbar } from '../shared/navbar/navbar.component';
import { 
  matPeople, 
  matLightbulb, 
  matRocket, 
  matFavorite, 
  matStar, 
  matTrendingUp 
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-about',
  imports: [NgIcon, Navbar],
  templateUrl: './about.component.html',
  providers: [
    provideIcons({ 
      matPeople, 
      matLightbulb, 
      matRocket, 
      matFavorite, 
      matStar, 
      matTrendingUp 
    })
  ]
})
export class AboutComponent {
  values = [
    {
      title: 'Innovation',
      description: 'Wir entwickeln kontinuierlich neue Lösungen und verbessern bestehende Funktionen, um den sich wandelnden Bedürfnissen der Event-Branche gerecht zu werden.',
      icon: 'matLightbulb'
    },
    {
      title: 'Benutzerfreundlichkeit',
      description: 'Einfachheit steht im Mittelpunkt unseres Designs. Jede Funktion wird so entwickelt, dass sie intuitiv und ohne komplizierte Schulungen nutzbar ist.',
      icon: 'matStar'
    },
    {
      title: 'Zuverlässigkeit',
      description: 'Unsere Plattform ist darauf ausgelegt, auch bei hohem Andrang stabil zu funktionieren. Ihre Events sind bei uns in sicheren Händen.',
      icon: 'matRocket'
    }
  ];
}