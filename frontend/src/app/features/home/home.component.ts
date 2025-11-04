import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Navbar } from '../shared/navbar/navbar.component';
import { 
  matQrCodeScanner, 
  matCheckCircle, 
  matEvent, 
  matDashboard, 
  matExtension, 
  matPhoneAndroid,
  matBolt,
  matCode
} from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-home',
  imports: [NgIcon, Navbar],
  templateUrl: './home.component.html',
  providers: [
    provideIcons({ 
      matQrCodeScanner, 
      matCheckCircle, 
      matEvent, 
      matDashboard, 
      matExtension, 
      matPhoneAndroid,
      matBolt,
      matCode
    })
  ]
})
export class HomeComponent {
  features = [
    {
      title: 'QR-Code-Validierung',
      description: 'Schnelle und sichere Einlasskontrolle durch QR-Code-Scanning beim Eingang.',
      icon: 'matQrCodeScanner'
    },
    {
      title: 'Einfacher Check-out',
      description: 'Vereinfachter Kaufprozess mit sofortiger QR-Ticket-Ausgabe für Käufer.',
      icon: 'matCheckCircle'
    },
    {
      title: 'Event-Verwaltung',
      description: 'Übersichtliche Verwaltung von Veranstaltungen und Ticketkontingenten.',
      icon: 'matEvent'
    },
    {
      title: 'Benutzerfreundliches Dashboard',
      description: 'Intuitive Benutzeroberfläche für Veranstalter mit allen wichtigen Funktionen.',
      icon: 'matDashboard'
    },
    {
      title: 'Modularer Aufbau',
      description: 'Erweiterbare Architektur für zukünftige Features und Anpassungen.',
      icon: 'matExtension'
    },
    {
      title: 'Responsives Design',
      description: 'Optimiert für Desktop und mobile Geräte - überall einsatzbereit.',
      icon: 'matPhoneAndroid'
    }
  ];
}