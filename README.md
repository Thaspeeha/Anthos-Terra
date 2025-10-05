# Anthos-Terra: Web-based Plant Bloom Visualization & Prediction Platform

## Description
Anthos-Terra is a web-based platform for monitoring, analyzing, and forecasting plant blooming events using NASA Earth observation data and other open datasets. Focused on sensors such as MODIS (MOD13A1), Landsat, UAESTATS, and VIIRS, the system ingests NDVI and related vegetation indices for interactive mapping and trend analysis of bloom activity.

---

## Features
- Integration with MODIS (MOD13A1), Landsat, UAESTATS, and VIIRS datasets (.hdf and raster)
- Automated NDVI extraction, regional aggregation, and multi-source fusion
- Interactive region selection and vegetation filtering
- Time-series visualization for bloom cycles/intensity with Plotly.js
- Geospatial mapping of bloom activity and phenology using Leaflet.js
- Bloom and pollen production panel powered by ML prediction (FastAPI, scikit-learn, XGBoost)
- API endpoints for data, forecast, and map overlays

---

## Architecture

**Frontend:**
- Framework: Next.js for dynamic, responsive web interface
- UI/Styling: Tailwind CSS for minimal, intuitive, accessible design
- Graphs: Plotly.js for interactive bloom trend visualizations
- Maps: Leaflet.js for geospatial mapping, region selection, and overlays
- Main entry: `/src/app`, `/pages/map.js`, `/components/BloomPanel.js`

**Backend:**
- No Backend (fully frontend aplication)

**Data Sources:**
- NASA Earth Observatory Global Maps (MODIS NDVI)
- NASA POWER Data Access Viewer (DAV)
- NASA Worldview Application
- NASA Observatory
- MODIS MOD13A1 (NDVI/EVI)
- Landsat (NDVI)
- UAESTATS environmental indicators
- VIIRS satellite phenology
- Data in `/public/data`, processed outputs in `/models/`

**Space Agency Partner & Other Data:**
- UAE.Stat (FCSC)
- Environment Agency – Abu Dhabi (EAD) Species Red List
- UAE Flora database
- Flower Station Dubai (Tribulus Omanense)
- GEE-Based Analysis of Spatiotemporal Patterns (LST/Land Cover)

**Hosting & Development:**
- Deployment: Vercel for frontend hosting
- Version Control: GitHub for repository and collaboration

**Storage:**
- Cloud storage/local disk for raw and processed data

---

## Setup

