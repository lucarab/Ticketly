# 🎟️ Ticketly

Ticketly ist ein Full-Stack-Projekt mit einer Angular-Frontend-Anwendung und einer NestJS-Backend-API.

> **Hinweis:** Ticketly ist ein experimenteller Prototyp, der im Rahmen einer Hochschulprojektarbeit im Modul "Web-Programmierung" an der Duale Hochschule Baden-Württemberg (DHBW) Heidenheim entwickelt wurde. Die Anwendung dient ausschließlich Demonstrations- und Lernzwecken und ist **nicht für den produktiven Einsatz geeignet**.

## 🧾 Projektbeschreibung

**Ticketly** ist ein Minimum Viable Product (MVP) zur digitalen Verwaltung von Tickets für **Vereine, Veranstaltungen und lokale Events**. Die Anwendung ist **kostenfrei und quelloffen (Open Source)** und richtet sich insbesondere an kleinere Organisationen, die eine einfache und effiziente Lösung zur Einlasskontrolle benötigen.

### Hauptfunktionen:
- **QR-Code-Validierung** beim Einlass
- **Vereinfachter Check-out-Prozess mit Ausgabe eines QR-Tickets** für Käufer
- **Verwaltung von Veranstaltungen und Ticketkontingenten**
- **Benutzerfreundliches Dashboard** für Veranstalter
- **Modularer Aufbau** zur einfachen Erweiterung
- **Responsives Design** für Desktop und mobile Geräte

Ziel ist es, eine leicht zugängliche und datenschutzfreundliche Lösung bereitzustellen, die ohne kommerzielle Lizenzkosten auskommt und dennoch moderne Web-Technologien nutzt.

## 🗂️ Projektstruktur

```
/
├── frontend/   → Angular-App (http://localhost:4200/)
└── backend/    → NestJS-API (http://localhost:3000/)
```

## 🚀 Getting Started

### 1. Repository klonen
```bash
git clone https://github.com/lucarab/Ticketly.git
cd Ticketly
```

### 2. Alle Abhängigkeiten installieren
```bash
npm install
```
Installiert automatisch alle Pakete im Hauptverzeichnis sowie in `frontend` und `backend`.

### 3. Beide Anwendungen starten
```bash
npm start
```
- Angular-Frontend läuft unter [http://localhost:4200](http://localhost:4200)  
- NestJS-Backend läuft unter [http://localhost:3000](http://localhost:3000)


## 🔧 Verfügbare Befehle

### Abhängigkeiten installieren
```bash
npm install             # Installiert alles (root + frontend + backend)
npm run install:frontend
npm run install:backend
```

### Anwendungen starten
```bash
npm start               # Startet Frontend und Backend gleichzeitig
npm run start:frontend  # Startet nur die Angular-App
npm run start:backend   # Startet nur das NestJS-Backend im Entwicklungsmodus
```


> **Hinweis:** Die Standardbefehle von Angular (`ng ...`) und NestJS (`nest ...`) sind weiterhin direkt in den jeweiligen Unterverzeichnissen (`frontend/` bzw. `backend/`) verfügbar und können dort wie gewohnt verwendet werden.


## 👥 Autor:innen
- Arthur Braulik
- Amelie Gössl
- Nico Knapp
- Luca Rab

## 📄 Lizenz

Dieses Projekt steht unter der [Creative Commons Attribution-NonCommercial 4.0 International Lizenz (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/deed.de).

Du darfst dieses Werk teilen, remixen, verändern und darauf aufbauen, solange du:
- **Namensnennung** gibst (z. B. die Autor:innen erwähnst),
- es **nicht kommerziell** nutzt.
