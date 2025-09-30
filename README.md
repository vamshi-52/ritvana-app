<<<<<<< HEAD

# Ritvana Starter (Expo) - Minimal Starter App

This zip includes:
- An Expo React Native starter app (frontend)
- A Firebase Cloud Function starter (optional) to proxy OpenAI (functions folder)

**IMPORTANT:** This is a starter scaffold. Replace Firebase config and OpenAI keys before use.

## Files included
- package.json
- App.js
- /src/screens (Login, Signup, Onboarding, Home, NewRitual, Chat)
- /src/services (firebaseConfig.js, authService.js, ritualsService.js)
- /functions/index.js (Cloud Function example)
- README (this file)

## How to run on Windows (step-by-step)

1. Install prerequisites:
   - Node.js (LTS) from https://nodejs.org (verify `node -v` and `npm -v`)
   - Expo CLI: open PowerShell and run:
     ```
     npm install -g expo-cli
     ```
   - Git (optional)
   - Android Studio (if you want emulator) or Expo Go app on your phone

2. Unzip the bundle and open a terminal in the project folder:
   ```
   cd ritvana_starter
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password) and Firestore
   - In Firebase > Project settings > Add Web App, copy config keys
   - Open `src/services/firebaseConfig.js` and paste your keys replacing placeholders

5. Start the Expo dev server:
   ```
   npm run start
   ```
   - This opens Expo DevTools in the browser.
   - Scan the QR code with Expo Go on your phone, or press `a` to open Android emulator.

6. Optional: Cloud Function for OpenAI proxy
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Initialize functions and set config:
     ```
     cd functions
     npm install
     firebase functions:config:set openai.key="YOUR_OPENAI_KEY"
     firebase deploy --only functions
     ```
   - Replace function URL in the app where needed.

## Notes & Next steps
- This app uses Firestore for storing rituals and completions.
- For production, adjust Firestore security rules and move sensitive logic (streak awarding) to Cloud Functions.
- This starter aims to match Ritvana behavior (onboarding rituals, marking done, points). UI styling is simple; you can enhance visual design to match Fabulous.

Happy building! 🌸
=======
# ritvana-app
Daily routine tracker app
>>>>>>> 4310d920472c8f3e39555b763a258cb32278fdb3
