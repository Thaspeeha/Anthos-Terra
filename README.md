# 🌱 **Anthos-Terra**: Web-based Plant Bloom Visualization & Prediction Platform

---

## 📝 **Description**
Anthos-Terra is a web-based platform for **monitoring, analyzing, and forecasting plant blooming events** using NASA Earth observation data and other open datasets. Focused on sensors such as MODIS (MOD13A1), Landsat, UAESTATS, and VIIRS, the system ingests NDVI and related vegetation indices for interactive mapping and trend analysis of bloom activity.

---

## ✨ **Features**

- 💾 **Integration with MODIS (MOD13A1), Landsat, UAESTATS, and VIIRS datasets**
- 📈 **Automated NDVI extraction**, regional aggregation, and multi-source fusion
- 🗺️ **Interactive region selection** and vegetation filtering
- 📊 **Time-series visualization** for bloom cycles/intensity with *Plotly.js*
- 🟩 **Geospatial mapping** of bloom activity and phenology using *Leaflet.js*
- 🔮 **Bloom & pollen production panel** powered by ML prediction (*FastAPI*, *scikit-learn*, *XGBoost*)
- 🌐 **API endpoints** for data, forecast, and map overlays

---

## 🏗️ **Architecture**

### 🎨 **Frontend**
- **Framework:** dynamic & responsive
- **UI/Styling:** minimal, intuitive, accessible
- **Graphs:** bloom trends
- **Maps:** region selection & overlays
- **Files:** `/src/app`, `/pages/map.js`, `/components/BloomPanel.js`

### 🤖 **Backend**
No Backend (fully frontend)

### 🌍 **Data Sources**
- **NASA Earth Observatory Global Maps (MODIS NDVI)**
- **NASA POWER DAV**, **NASA Worldview Application**
- **MODIS MOD13A1 (NDVI/EVI)**, **Landsat (NDVI)**
- **UAESTATS**, **VIIRS**

### 🚀 **Hosting & Development**
- ⚡ **Deployment:** Live Sever for frontend hosting

  

- 🔗 **Version Control:** GitHub for repo & collaboration

### 🗄️ **Storage**
- ☁️ Cloud storage/local disk for raw and processed data

Watch Video- Demonstration of the protoptype
[![Watch Anthos Terra Demo](https://img.youtube.com/vi/ylHSUAkc6_Y/0.jpg)](https://www.youtube.com/watch?v=ylHSUAkc6_Y)


