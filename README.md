# 🎓 Ticketly – Hochschulprojekt an der DHBW Heidenheim

Ticketly ist ein Full-Stack-Projekt mit einer Angular-Frontend-Anwendung und einer NestJS-Backend-API. Die Projektstruktur erlaubt es, beide Anwendungen zentral aus dem Hauptverzeichnis zu verwalten und zu starten.

Dieses Projekt ist im Rahmen der Projektarbeit im Modul **„Web-Programmierung“** an der **Duale Hochschule Baden-Württemberg (DHBW) Heidenheim** entstanden.

## 🧾 Projektbeschreibung

**Ticketly** ist ein Minimum Viable Product (MVP) zur digitalen Verwaltung von Tickets für **Vereine, Veranstaltungen und lokale Events**. Die Anwendung ist **kostenfrei und quelloffen (Open Source)** und richtet sich insbesondere an kleinere Organisationen, die eine einfache und effiziente Lösung zur Einlasskontrolle benötigen.

### Hauptfunktionen:
- **QR-Code-Validierung** beim Check-in
- **Vereinfachter Check-out-Prozess** für Käufer
- **Verwaltung von Veranstaltungen und Ticketkontingenten**
- **Benutzerfreundliches Dashboard** für Veranstalter
- **Modularer Aufbau** zur einfachen Erweiterung
- **Responsives Design** für Desktop und mobile Geräte

Ziel ist es, eine leicht zugängliche und datenschutzfreundliche Lösung bereitzustellen, die ohne kommerzielle Lizenzkosten auskommt und dennoch moderne Web-Technologien nutzt.

## 📦 Projektstruktur

```
/
├── frontend/   → Angular-App (http://localhost:4200/)
└── backend/    → NestJS-API (http://localhost:3000/)
```

## 🚀 Einstieg

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

### 🛠 Abhängigkeiten installieren
```bash
npm install             # Installiert alles (root + frontend + backend)
npm run install:frontend
npm run install:backend
```

### 🚀 Anwendungen starten
```bash
npm start               # Startet Frontend und Backend gleichzeitig
npm run start:frontend  # Startet nur die Angular-App
npm run start:backend   # Startet nur das NestJS-Backend im Entwicklungsmodus
```

### 🧹 Code formatieren (Backend)
```bash
npm run format
```

### ✅ Tests ausführen (Backend)
```bash
npm run test            # Unit-Tests
npm run test:watch      # Tests im Watch-Modus
npm run test:cov        # Testabdeckung anzeigen
npm run test:e2e        # End-to-End-Tests
```

### 🔍 Linting (Backend)
```bash
npm run lint
```

## 👥 Autor:innen

- Luca Rab  
- Arthur Braulik  
- Nico Knapp  
- Amelie Gössl

## 📄 Lizenz

Dieses Projekt steht unter der [Creative Commons Attribution-NonCommercial 4.0 International Lizenz (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/deed.de).
Du darfst dieses Werk teilen, remixen, verändern und darauf aufbauen, solange du:
- **Namensnennung** gibst (z. B. die Autor:innen erwähnst),
- es **nicht kommerziell** nutzt.
