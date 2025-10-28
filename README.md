# 🎓 Ticketly – Hochschulprojekt an der DHBW Heidenheim

Ticketly ist ein Full-Stack-Projekt mit einer Angular-Frontend-Anwendung und einer NestJS-Backend-API. Die Projektstruktur erlaubt es, beide Anwendungen zentral aus dem Hauptverzeichnis zu verwalten und zu starten.
Dieses Projekt ist im Rahmen der Projektarbeit im Modul **„Web-Programmierung“** an der **Duale Hochschule Baden-Württemberg (DHBW) Heidenheim** entstanden.

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
Du darfst dieses Werk teilen und bearbeiten, solange du:
- **Namensnennung** gibst (z. B. die Autor:innen erwähnst),
- es **nicht kommerziell** nutzt.
