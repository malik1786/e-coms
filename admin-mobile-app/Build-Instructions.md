# 📱 Sufi Admin Mobile App (APK)

This project is a premium mobile-first admin panel designed to be built as an Android APK.

## 🚀 How to Connect to Your Hosted Website
To ensure the APK connects to your hosted server instead of localhost, update the API URL in `src/pages/Login.jsx`, `Dashboard.jsx`, etc.

**Pro-tip:** You can set a global base URL for Axios in `src/main.jsx`:
```javascript
import axios from 'axios';
axios.defaults.baseURL = 'https://your-website-domain.com'; // Change this to your hosted domain
```

## 🛠️ How to Generate the APK
1. **Install Dependencies:**
   ```bash
   cd admin-mobile-app
   npm install
   ```
2. **Build the Web Project:**
   ```bash
   npm run build
   ```
3. **Add Android Platform (requires Android Studio):**
   ```bash
   npx cap add android
   ```
4. **Copy Build to Android:**
   ```bash
   npx cap copy
   ```
5. **Open in Android Studio to Build APK:**
   ```bash
   npx cap open android
   ```
   *In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)*

## ✨ Design Features
- **Glassmorphism:** Elegant frosted glass effects.
- **Dark Mode:** Premium black & gold aesthetic optimized for OLED mobile screens.
- **Micro-animations:** Smooth transitions using Framer Motion.
- **Mobile First:** Designed for one-handed operation.
