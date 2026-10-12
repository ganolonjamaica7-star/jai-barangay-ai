# JAI Barangay AI Assistant (Offline)

A simple offline FAQ website with the JAI logo and sample document templates.

## Run locally
1. Extract this folder.
2. Install Node.js if it is not installed.
3. Open this folder in VS Code.
4. In the terminal, run `npm install`.
5. Run `npm start` and open `http://localhost:3000`.

You can also open `www/index.html` directly in a browser for a basic preview.

## Included
- Offline FAQ chat for barangay clearance, indigency, residency, office hours, fees, dry seal/signatures, services, and request letters.
- JAI logo in `www/assets/jai-logo.png` and browser favicon.
- Downloadable sample templates in `www/templates/`.
- Capacitor configuration for Android project setup.

## Important
This is an offline FAQ and template helper, not an official barangay issuing system. Sample documents are not official certificates. Residents must confirm requirements and fees with their Barangay Hall. Only authorized barangay personnel can verify, approve, sign, and apply an official dry seal when required. Do not use the sample files to imitate official seals or signatures.

## Android packaging
After installing dependencies, run `npx cap add android` (if the Android folder has not been created), then `npx cap sync android` and `npx cap open android`. Android Studio is needed to build an APK. `server.js` is only for local preview; the APK uses the `www` folder.
