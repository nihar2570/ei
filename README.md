# Election Intelligence (Multi-State Decision Engine)

Unified election intelligence, booth voter analytics, and demographic simulation platform for **Andhra Pradesh** and **Telangana**.

---

## Monorepo Architecture

```
Election-Intelligence/
├── andhra-dashboard/             # Andhra Pradesh 175-AC War Room & Decision Engine
├── andhra-electoral-rolls-2026/  # Andhra Pradesh 2026 ECI Draft Rolls & Booth Roster
├── andhra-pipeline-scripts/      # Andhra Pradesh OCR, E-Roll & Panna harvest pipelines
├── andhra_generate_surveys.py    # Andhra Pradesh caste survey generator
│
├── telangana-dashboard/          # Telangana 119-AC War Room & Results Engine
└── telangana-data/               # Telangana historical election datasets & GIS layers
```

---

## Getting Started

### Andhra Pradesh Dashboard
```bash
cd andhra-dashboard
npm install
npm run dev
```

### Telangana Dashboard
```bash
cd telangana-dashboard
npm install
npm run dev
```
