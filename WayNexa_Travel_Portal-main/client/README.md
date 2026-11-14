# WayNexa travel portal

WayNexa is a responsive React, TypeScript and Vite travel discovery application with a small Node.js API. The client includes destination, stay, flight, transport, itinerary, review, account and owner-dashboard experiences.

## What works

- Destination and stay discovery, catalogue search, travel estimates and itinerary planning.
- Per-account favorites, trip drafts, settings, review drafts and sample itinerary records.
- MySQL-backed registration, sign-in, session persistence and activity history.
- Owner-only activity dashboard, controlled by the server-side `ADMIN_EMAILS` allowlist.
- A server-side Groq travel assistant integration when `GROQ_API_KEY` is configured.

The destination, stay, flight, review and fare catalogue is illustrative. Room counts and prices are not live, date-specific or verified. Saving a trip creates a sample itinerary record only: the app does not reserve a stay, book a flight, issue a ticket or process payments.

## Local setup (Windows / PowerShell)

1. Create a MySQL 8 database and run `server\schema.sql` from MySQL Workbench, or from the workspace root with the MySQL command-line client:

   ```powershell
   cmd /c "mysql -u root -p < server\schema.sql"
   ```

2. In MySQL Workbench, create a least-privilege user for the API (replace the password placeholder locally; never commit or share the real password):

   ```sql
   CREATE USER 'waynexa_app'@'127.0.0.1' IDENTIFIED BY 'replace-with-a-long-unique-password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON waynexa.* TO 'waynexa_app'@'127.0.0.1';
   ```

3. Add the MySQL settings from `server\.env.example` to the existing `server\.env` file. Keep your existing Groq configuration and replace the example MySQL password with the password you set in MySQL Workbench. Do not put database credentials in client files. Start the API from the workspace root:

   ```powershell
   npm run server:dev
   ```

   The server loads `server\.env` whether it is launched from the workspace root or directly from the `server` folder.

4. In a second terminal, install and start the client:

   ```powershell
   Set-Location "WayNexa_Travel_Portal-main\client"
   npm install
   npm run dev
   ```

5. Open the Vite URL (normally `http://localhost:5173`). Register the exact address listed in `ADMIN_EMAILS` to access the owner workspace. The Vite server proxies `/api` to `127.0.0.1:8000`. Open `http://127.0.0.1:8000/api/health` to confirm that MySQL reports `"database":"ok"` without exposing credentials.

## Account data and privacy

Passwords are stored as salted `scrypt` hashes. Sessions use random opaque tokens in HttpOnly cookies; only a hash of each token is stored in MySQL. Favorites, preferences, reviews, trip drafts and sample itinerary records are stored in the account's own MySQL row. API requests can read or update only the signed-in account's data.

The owner dashboard exposes account names/emails and recent activity such as page sections, search terms and saved-trip actions. It does not expose password hashes, saved account data or assistant conversation text. Never enter payment details. Review `server\schema.sql` and the API's activity allowlist before extending what is collected.

## Validation

From `WayNexa_Travel_Portal-main\client`:

```powershell
npm run lint
npm run build
```

## Before public launch

Use HTTPS and `NODE_ENV=production` (which enables Secure session cookies), keep API/database credentials out of the client, configure backups and persistent rate limiting, and add account verification, password reset and data-deletion flows. Connect licensed live travel inventory and a payment provider before enabling real reservations.
